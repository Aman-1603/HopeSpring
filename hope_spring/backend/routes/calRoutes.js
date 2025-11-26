// backend/routes/calRoutes.js
import express from "express";
import { pool } from "../db.js";
import {
  cal,
  createEventType,
  getEventType,
} from "../lib/calClient.js";

const router = express.Router();

/* -------------------------------
   Env helper
-------------------------------- */
function requireEnv(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || String(v).trim() === "") {
    throw new Error(`Missing env var: ${name}`);
  }
  return String(v).trim();
}

// Cal username for embedding
const CAL_USER = requireEnv("CAL_USERNAME", "kamutest");
const CAL_TZ = "America/New_York";

/* -------------------------------
   Slug helper
-------------------------------- */
function makeSlug(title, id) {
  const base = String(title || "support-group")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${id}`;
}

/* -------------------------------
   Core linker
   programId param name is flexible
-------------------------------- */
async function linkProgramToCal(programId, res) {
  try {
    // 1) Load program
    const progRes = await pool.query(
      `
      SELECT id, title, description,
             cal_event_type_id, cal_schedule_id, cal_slug, cal_user
      FROM programs
      WHERE id = $1
      `,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];

    // 2) If already linked, just confirm + return
    if (prog.cal_event_type_id) {
      try {
        const existing = await getEventType(prog.cal_event_type_id);
        return res.json({
          linked: true,
          programId: prog.id,
          cal: {
            eventTypeId: prog.cal_event_type_id,
            scheduleId: prog.cal_schedule_id,
            slug: prog.cal_slug,
            user: prog.cal_user || CAL_USER,
            eventType: existing,
          },
        });
      } catch (err) {
        console.error(
          "Cal getEventType failed for existing link:",
          err.message
        );
        return res.json({
          linked: true,
          programId: prog.id,
          cal: {
            eventTypeId: prog.cal_event_type_id,
            scheduleId: prog.cal_schedule_id,
            slug: prog.cal_slug,
            user: prog.cal_user || CAL_USER,
          },
          warning: "Cal event lookup failed, but program is already linked.",
        });
      }
    }

    // 3) Create NEW event type for THIS program
    const title = prog.title || "Support Group";
    const slug = makeSlug(title, prog.id);
    const desc = (prog.description || "").slice(0, 250);

    // No scheduleId here → Cal uses its own default schedule.
    const payload = {
      title,
      slug,
      description: desc,
      lengthInMinutes: 60,
      metadata: {},
    };

    let created;
    try {
      created = await createEventType(payload);
    } catch (err) {
      console.error("❌ Cal createEventType error:", err.message);
      return res
        .status(502)
        .json({ error: err.message || "Failed to create Cal event type" });
    }

    const eventTypeId = created.id;
    const scheduleId = created.scheduleId ?? null;
    const calSlug = created.slug || slug;
    const calUser = CAL_USER;

    // 4) Persist to programs
    const updateRes = await pool.query(
      `
      UPDATE programs
      SET cal_event_type_id = $1,
          cal_schedule_id   = $2,
          cal_slug          = $3,
          cal_user          = $4
      WHERE id = $5
      RETURNING *
      `,
      [eventTypeId, scheduleId, calSlug, calUser, programId]
    );

    const updated = updateRes.rows[0];

    return res.status(201).json({
      linked: true,
      program: updated,
      cal: {
        eventTypeId,
        scheduleId,
        slug: calSlug,
        user: calUser,
      },
    });
  } catch (err) {
    console.error("❌ linkProgramToCal error:", err);
    return res
      .status(500)
      .json({ error: "Failed to link program with Cal event type" });
  }
}

/* -------------------------------
   NEW: fetch slots from Cal for a program
   GET /api/cal/programs/:id/slots
-------------------------------- */
router.get("/programs/:id/slots", async (req, res) => {
  try {
    const programId = req.params.id;

    // 1) Load program + event type id
    const progRes = await pool.query(
      `
      SELECT id, title, cal_event_type_id
      FROM programs
      WHERE id = $1
      `,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];

    if (!prog.cal_event_type_id) {
      return res
        .status(400)
        .json({ error: "Program is not linked to a Cal event type" });
    }

    const eventTypeId = prog.cal_event_type_id;

    // 2) Define window: today → +90 days
    const now = new Date();
    const start = now.toISOString();
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const end = endDate.toISOString();

    // 3) Call Cal slots endpoint
    const apiRes = await cal.get("/slots", {
      params: {
        eventTypeId,
        start,
        end,
        timeZone: CAL_TZ,
      },
    });

    const raw = apiRes.data || {};
    const data = raw.data || {};

    const slots = [];
    const dateSet = new Set();

    // Case 1: new shape (what your curl showed)
    // data = { "YYYY-MM-DD": [ { start: "..." }, ... ], ... }
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      !Array.isArray(data.slots)
    ) {
      for (const [day, arr] of Object.entries(data)) {
        if (!Array.isArray(arr)) continue;
        dateSet.add(day);
        for (const item of arr) {
          const isoStart =
            item.startTime || item.start || item.start_time || "";
          if (!isoStart) continue;
          slots.push({
            ...item,
            date: day,
            start: isoStart,
          });
        }
      }
    }
    // Case 2: old docs style: data.slots = [ { startTime: ... } ]
    else if (Array.isArray(data.slots)) {
      for (const s of data.slots) {
        const isoStart = s.startTime || s.start || s.start_time || "";
        if (!isoStart) continue;
        const day = isoStart.split("T")[0];
        if (day) dateSet.add(day);
        slots.push({
          ...s,
          date: day,
          start: isoStart,
        });
      }
    }
    // Case 3: worst case fallback – data is already an array
    else if (Array.isArray(data)) {
      for (const s of data) {
        const isoStart = s.startTime || s.start || s.start_time || "";
        if (!isoStart) continue;
        const day = isoStart.split("T")[0];
        if (day) dateSet.add(day);
        slots.push({
          ...s,
          date: day,
          start: isoStart,
        });
      }
    }

    const dates = Array.from(dateSet).sort();

    return res.json({
      programId: prog.id,
      title: prog.title,
      eventTypeId,
      timeZone: CAL_TZ,
      dates,
      slots,
    });
  } catch (err) {
    console.error("❌ Error fetching Cal slots for program:", err);
    return res.status(500).json({ error: "Failed to fetch Cal slots" });
  }
});

/* -------------------------------
   Existing routes
-------------------------------- */

// This matches your current frontend: POST /api/cal/event-types/:programId
router.post("/event-types/:programId", async (req, res) => {
  const programId = req.params.programId;
  return linkProgramToCal(programId, res);
});

// Alternative paths if you ever refactor frontend:
router.post("/programs/:id/event-type", async (req, res) => {
  const programId = req.params.id;
  return linkProgramToCal(programId, res);
});

router.post("/programs/:id/link", async (req, res) => {
  const programId = req.params.id;
  return linkProgramToCal(programId, res);
});

export default router;
