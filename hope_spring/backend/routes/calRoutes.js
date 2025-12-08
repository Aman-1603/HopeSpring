// backend/routes/calRoutes.js
import express from "express";
import { pool } from "../db.js";
import {
  cal,
  createEventType,
  createSchedule,
  getEventType,
  updateEventType,
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
   Seats from capacity  (TOP-LEVEL FIELDS)
   Cal v2 still expects:

     seatsPerTimeSlot
     seatsShowAttendees
     seatsShowAvailabilityCount

   as top-level properties on the event type,
   NOT a nested `seats: { ... }` object.
-------------------------------- */
function makeSeatsPatchFromCapacity(capacity) {
  const capNum = Number(capacity);
  if (!capNum || !Number.isFinite(capNum) || capNum <= 0) {
    // no valid capacity → don't enable seats
    return null;
  }

  return {
    seatsPerTimeSlot: capNum,
    seatsShowAttendees: false,
    seatsShowAvailabilityCount: true,
  };
}

/* -------------------------------
   Core linker
   programId param name is flexible
-------------------------------- */
async function linkProgramToCal(programId, res) {
  try {
    // 1) Load program - include max_capacity + duration_minutes + is_active
    const progRes = await pool.query(
      `
      SELECT id,
             title,
             description,
             max_capacity,
             duration_minutes,
             cal_event_type_id,
             cal_schedule_id,
             cal_slug,
             cal_user,
             is_active
      FROM programs
      WHERE id = $1
      `,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];

    // 🔒 Don’t create / relink Cal events for archived programs
    if (prog.is_active === false) {
      return res.status(400).json({
        error:
          "Program is archived. Unarchive it before creating or relinking a Cal event type.",
      });
    }

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

    // 3) Create a NEW schedule for THIS program
    const title = prog.title || "Support Group";
    const scheduleName = `Program ${prog.id}: ${title}`;

    let schedule;
    try {
      schedule = await createSchedule({
        name: scheduleName,
        timeZone: CAL_TZ,
        availability: [], // admin will configure dates/times in Cal UI
        overrides: [],
        isDefault: false,
      });
    } catch (err) {
      console.error("❌ Cal createSchedule error:", err.message);
      return res
        .status(502)
        .json({ error: err.message || "Failed to create Cal schedule" });
    }

    const scheduleId = schedule.id;

    // 4) Create NEW event type using that schedule
    const slug = makeSlug(title, prog.id);
    const desc = (prog.description || "").slice(0, 250);

    const seatsPatch = makeSeatsPatchFromCapacity(prog.max_capacity);

    // derive duration from DB, fallback to 60
    const lengthMinutes =
      Number(prog.duration_minutes) && Number(prog.duration_minutes) > 0
        ? Number(prog.duration_minutes)
        : 60;

    const payload = {
      title,
      slug,
      description: desc,
      lengthInMinutes: lengthMinutes,
      scheduleId, // attach this event type to the program-specific schedule
      metadata: {},
      ...(seatsPatch || {}), // <- TOP LEVEL
    };

    let created;
    try {
      console.log(
        "[Cal] createEventType payload:",
        JSON.stringify(payload, null, 2)
      );
      created = await createEventType(payload);
    } catch (err) {
      console.error("❌ Cal createEventType error:", err.message);
      return res
        .status(502)
        .json({ error: err.message || "Failed to create Cal event type" });
    }

    const eventTypeId = created.id;
    const calSlug = created.slug || slug;
    const calUser = CAL_USER;

    // 5) Persist to programs
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
   Sync seats (capacity -> Cal)
   POST /api/cal/programs/:id/sync-seats
-------------------------------- */
router.post("/programs/:id/sync-seats", async (req, res) => {
  try {
    const programId = req.params.id;

    const progRes = await pool.query(
      `
      SELECT id, title, max_capacity, cal_event_type_id
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

    const seatsPatch = makeSeatsPatchFromCapacity(prog.max_capacity);

    if (!seatsPatch) {
      return res.status(400).json({
        error:
          "Program max_capacity is not a positive number, cannot sync seats",
      });
    }

    console.log(
      "[Cal] sync seats → eventType",
      prog.cal_event_type_id,
      "payload",
      seatsPatch
    );

    const updatedEventType = await updateEventType(prog.cal_event_type_id, {
      ...seatsPatch,
    });

    return res.json({
      ok: true,
      programId: prog.id,
      eventTypeId: prog.cal_event_type_id,
      seats: seatsPatch,
      eventType: updatedEventType,
    });
  } catch (err) {
    console.error("❌ Error syncing seats to Cal:", err);
    return res.status(500).json({ error: "Failed to sync seats to Cal" });
  }
});

/* -------------------------------
   Sync duration (duration_minutes -> lengthInMinutes)
   POST /api/cal/programs/:id/sync-duration
-------------------------------- */
router.post("/programs/:id/sync-duration", async (req, res) => {
  try {
    const programId = req.params.id;

    const progRes = await pool.query(
      `
      SELECT id, title, duration_minutes, cal_event_type_id
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

    const lengthMinutes =
      Number(prog.duration_minutes) && Number(prog.duration_minutes) > 0
        ? Number(prog.duration_minutes)
        : 60;

    console.log(
      "[Cal] sync duration → eventType",
      prog.cal_event_type_id,
      "lengthInMinutes",
      lengthMinutes
    );

    const updatedEventType = await updateEventType(prog.cal_event_type_id, {
      lengthInMinutes: lengthMinutes,
    });

    return res.json({
      ok: true,
      programId: prog.id,
      eventTypeId: prog.cal_event_type_id,
      lengthMinutes,
      eventType: updatedEventType,
    });
  } catch (err) {
    console.error("❌ Error syncing duration to Cal:", err);
    return res.status(500).json({ error: "Failed to sync duration to Cal" });
  }
});

/* -------------------------------
   Fetch slots from Cal for a program
   GET /api/cal/programs/:id/slots
-------------------------------- */
router.get("/programs/:id/slots", async (req, res) => {
  try {
    const programId = req.params.id;

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

    const now = new Date();
    const start = now.toISOString();
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const end = endDate.toISOString();

    const apiRes = await cal.get("/slots", {
      params: {
        eventTypeId,
        start,
        end,
        timeZone: CAL_TZ,
      },
      headers: {
        "cal-api-version": "2024-09-04",
      },
    });

    const raw = apiRes.data || {};
    const data = raw.data || {};

    const slots = [];
    const dateSet = new Set();

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
    } else if (Array.isArray(data.slots)) {
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
    } else if (Array.isArray(data)) {
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
   Save booking from Cal embed → DB
   POST /api/cal/bookings/from-embed
-------------------------------- */
router.post("/bookings/from-embed", async (req, res) => {
  try {
    const {
      programId,
      userId,
      calBookingId,
      date,
      durationMinutes,
      attendeeName,
      attendeeEmail,
      status,
    } = req.body || {};

    if (!programId || !date) {
      return res
        .status(400)
        .json({ error: "programId and date are required" });
    }

    const start = new Date(date);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    let end = null;
    const dur = Number(durationMinutes);
    if (dur && Number.isFinite(dur) && dur > 0) {
      end = new Date(start.getTime() + dur * 60 * 1000);
    }

    const insertRes = await pool.query(
      `
      INSERT INTO bookings
        (program_id,
         user_id,
         cal_booking_id,
         attendee_name,
         attendee_email,
         status,
         event_start,
         event_end,
         created_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (cal_booking_id)
      DO UPDATE SET
        program_id     = EXCLUDED.program_id,
        user_id        = EXCLUDED.user_id,
        attendee_name  = EXCLUDED.attendee_name,
        attendee_email = EXCLUDED.attendee_email,
        status         = EXCLUDED.status,
        event_start    = EXCLUDED.event_start,
        event_end      = EXCLUDED.event_end
      RETURNING *
      `,
      [
        Number(programId),
        userId ? Number(userId) : null,
        calBookingId || null,
        attendeeName || null,
        attendeeEmail || null,
        status || "booked",
        start.toISOString(),
        end ? end.toISOString() : null,
      ]
    );

    return res.status(201).json({
      ok: true,
      booking: insertRes.rows[0],
    });
  } catch (err) {
    console.error("❌ Error saving Cal booking to DB:", err);
    return res
      .status(500)
      .json({ error: "Failed to save booking to database" });
  }
});

/* -------------------------------
   Linking routes
-------------------------------- */

// This matches your current frontend: POST /api/cal/event-types/:programId
router.post("/event-types/:programId", async (req, res) => {
  const programId = req.params.programId;
  return linkProgramToCal(programId, res);
});

router.post("/programs/:id/event-type", async (req, res) => {
  const programId = req.params.id;
  return linkProgramToCal(programId, res);
});

router.post("/programs/:id/link", async (req, res) => {
  const programId = req.params.id;
  return linkProgramToCal(programId, res);
});

export default router;
