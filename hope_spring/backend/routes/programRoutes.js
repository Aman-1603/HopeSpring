// hope_spring/backend/routes/programRoutes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

const TZ = "America/New_York"; // keep as-is unless HopeSpring wants different TZ

/* =========================
   Timezone-safe helpers
========================= */

// Get timezone offset (in minutes) of a given UTC date in a target timeZone
function getTimeZoneOffsetMinutes(utcDate, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dtf.formatToParts(utcDate);
  const values = {};
  for (const p of parts) {
    if (p.type !== "literal") {
      values[p.type] = p.value;
    }
  }

  const asUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return (asUTC - utcDate.getTime()) / 60000;
}

// Convert NY local date+time ("YYYY-MM-DD", "HH:mm") to a UTC Date
function nyLocalToUtc(dateStr, timeStr, timeZone = TZ) {
  if (!dateStr || !timeStr) return null;

  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);

  // First guess: treat local as UTC
  const utcGuess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));

  // Figure out real offset for that instant in the target TZ
  const offsetMin = getTimeZoneOffsetMinutes(utcGuess, timeZone);

  // Shift back to get true UTC instant for the local time
  return new Date(utcGuess.getTime() - offsetMin * 60000);
}

/* =========================================================
   GET ALL PROGRAMS (ADMIN)
   ⚠️ participants = COUNT(bookings where status='ACCEPTED')
========================================================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.category,
        p.date,
        p.time,
        p.location,
        p.max_capacity,
        p.instructor,
        p.status,

        COALESCE(b.count_accepted, 0) AS participants,

        p.day_label,
        p.time_label,
        p.column_index,
        p.sort_order,
        p.is_active,
        p.cal_event_type_id,
        p.cal_slug,
        p.cal_user,
        p.cal_schedule_id,
        p.duration_minutes,
        p.zoom_link
      FROM programs p
      LEFT JOIN (
        SELECT
          program_id,
          COUNT(*) FILTER (WHERE status = 'ACCEPTED') AS count_accepted
        FROM bookings
        GROUP BY program_id
      ) b ON b.program_id = p.id
      ORDER BY p.date ASC NULLS LAST, p.time ASC NULLS LAST, p.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching programs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   SUPPORT GROUPS
   ⚠️ participants = COUNT(bookings where status='ACCEPTED')
========================================================= */
router.get("/support-groups", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.instructor,
        p.day_label,
        p.time_label,
        p.column_index,
        p.sort_order,
        p.cal_event_type_id,
        p.cal_slug,
        p.cal_user,
        p.cal_schedule_id,
        p.zoom_link,
        COALESCE(b.count_accepted, 0) AS participants
      FROM programs p
      LEFT JOIN (
        SELECT
          program_id,
          COUNT(*) FILTER (WHERE status = 'ACCEPTED') AS count_accepted
        FROM bookings
        GROUP BY program_id
      ) b ON b.program_id = p.id
      WHERE p.category = 'support_group' AND p.is_active = TRUE
      ORDER BY p.column_index ASC, p.sort_order ASC, p.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching support groups:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   CATEGORIES CRUD
========================================================= */
router.get("/categories/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
      `,
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ existing: true, name });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/categories/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    await pool.query("DELETE FROM categories WHERE name=$1", [name]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   DELETE SINGLE OCCURRENCE
========================================================= */
router.delete("/occurrence/:occId", async (req, res) => {
  try {
    await pool.query(`DELETE FROM program_occurrences WHERE id=$1`, [
      req.params.occId,
    ]);
    res.json({ message: "Occurrence deleted" });
  } catch (err) {
    console.error("❌ Error deleting occurrence:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   GET OCCURRENCES FOR A PROGRAM
========================================================= */
router.get("/:id/occurrences", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, program_id, starts_at, ends_at, is_cancelled, notes
      FROM program_occurrences
      WHERE program_id=$1
      ORDER BY starts_at ASC
      `,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching occurrences:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   ADD PROGRAM
   ✅ Cal fields are just stored; availability is owned by Cal dashboard
========================================================= */
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxCapacity,
      instructor,
      status,
      day_label,
      time_label,
      column_index,
      sort_order,
      is_active,
      additionalDates = [],

      // new fields
      durationMinutes,
      zoomLink,

      // optional Cal fields from admin (per-program only)
      cal_event_type_id,
      cal_schedule_id,
      cal_slug,
      cal_user,
    } = req.body;

    const baseDate = date ? String(date).slice(0, 10) : null;
    const baseTime = time ? String(time).slice(0, 5) : null;

    const finalCalEventTypeId = cal_event_type_id ?? null;
    const finalCalScheduleId = cal_schedule_id ?? null;

    const programInsert = await client.query(
      `
      INSERT INTO programs (
        title, description, category, date, time, location,
        max_capacity, instructor, status,
        day_label, time_label, column_index, sort_order, is_active,
        cal_event_type_id, cal_schedule_id, cal_slug, cal_user,
        duration_minutes, zoom_link
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,
        $10,$11,$12,$13,$14,
        $15,$16,$17,$18,
        $19,$20
      )
      RETURNING *
      `,
      [
        title,
        description,
        category,
        baseDate || null,
        baseTime || null,
        location,
        maxCapacity,
        instructor,
        status || "upcoming",
        day_label || null,
        time_label || null,
        column_index || 1,
        sort_order || 0,
        is_active ?? true,
        finalCalEventTypeId,
        finalCalScheduleId,
        cal_slug ?? null,
        cal_user ?? null,
        durationMinutes != null ? durationMinutes : null,
        zoomLink ?? null,
      ]
    );

    const createdProgram = programInsert.rows[0];
    const programId = createdProgram.id;

    // main occurrence (NY local -> UTC instant)
    if (baseDate && baseTime) {
      const startsAtUTC = nyLocalToUtc(baseDate, baseTime);
      if (startsAtUTC) {
        await client.query(
          `INSERT INTO program_occurrences (program_id, starts_at)
           VALUES ($1, $2)`,
          [programId, startsAtUTC]
        );
      }
    }

    // extra occurrences -> FORCE primary time
    for (const d of additionalDates) {
      if (!d) continue;
      const extraDate = String(d).slice(0, 10);
      if (!extraDate || !baseTime) continue;

      const startsAtUTC = nyLocalToUtc(extraDate, baseTime);
      if (!startsAtUTC) continue;

      await client.query(
        `INSERT INTO program_occurrences (program_id, starts_at)
         VALUES ($1, $2)`,
        [programId, startsAtUTC]
      );
    }

    await client.query("COMMIT");

    // ❌ NO Cal sync here. Cal dashboard is the source of availability.
    res.status(201).json(createdProgram);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error adding program:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

/* =========================================================
   EDIT PROGRAM (partial update + optional occurrence replace)
   ✅ Cal fields are just stored; no schedule updates
========================================================= */
router.put("/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const programId = req.params.id;

    // 1) Load existing row for merge (prevents NULL overwrite)
    const currentRes = await client.query(
      `SELECT * FROM programs WHERE id=$1`,
      [programId]
    );
    const current = currentRes.rows[0];
    if (!current) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Program not found" });
    }

    // 2) Merge request over existing
    const merged = { ...current, ...req.body };

    // Handle camelCase -> snake
    if (req.body.maxCapacity != null) {
      merged.max_capacity = req.body.maxCapacity;
    }
    if (req.body.durationMinutes != null) {
      merged.duration_minutes = req.body.durationMinutes;
    }
    if (req.body.zoomLink !== undefined) {
      merged.zoom_link = req.body.zoomLink;
    }

    const baseDate = merged.date ? String(merged.date).slice(0, 10) : null;
    const baseTime = merged.time ? String(merged.time).slice(0, 5) : null;

    const finalCalEventTypeId =
      req.body.cal_event_type_id !== undefined
        ? req.body.cal_event_type_id
        : current.cal_event_type_id;

    const finalCalScheduleId =
      req.body.cal_schedule_id !== undefined
        ? req.body.cal_schedule_id
        : current.cal_schedule_id;

    const finalCalSlug =
      req.body.cal_slug !== undefined ? req.body.cal_slug : current.cal_slug;

    const finalCalUser =
      req.body.cal_user !== undefined ? req.body.cal_user : current.cal_user;

    const programUpdate = await client.query(
      `
      UPDATE programs SET
        title=$1, description=$2, category=$3,
        date=$4, time=$5, location=$6,
        max_capacity=$7, instructor=$8, status=$9,
        day_label=$10, time_label=$11, column_index=$12,
        sort_order=$13, is_active=$14,
        cal_event_type_id=$15, cal_schedule_id=$16, cal_slug=$17, cal_user=$18,
        duration_minutes=$19, zoom_link=$20
      WHERE id=$21
      RETURNING *
      `,
      [
        merged.title,
        merged.description,
        merged.category,
        baseDate,
        baseTime,
        merged.location,
        merged.max_capacity,
        merged.instructor,
        merged.status,
        merged.day_label,
        merged.time_label,
        merged.column_index ?? 1,
        merged.sort_order ?? 0,
        merged.is_active ?? true,
        finalCalEventTypeId ?? null,
        finalCalScheduleId ?? null,
        finalCalSlug ?? null,
        finalCalUser ?? null,
        merged.duration_minutes ?? null,
        merged.zoom_link ?? null,
        programId,
      ]
    );

    // 4) Replace occurrences ONLY if additionalDates is explicitly provided
    if (Array.isArray(req.body.additionalDates)) {
      const additionalDates = req.body.additionalDates;

      await client.query(
        `DELETE FROM program_occurrences WHERE program_id=$1`,
        [programId]
      );

      if (baseDate && baseTime) {
        const startsAtUTC = nyLocalToUtc(baseDate, baseTime);
        if (startsAtUTC) {
          await client.query(
            `INSERT INTO program_occurrences (program_id, starts_at)
             VALUES ($1, $2)`,
            [programId, startsAtUTC]
          );
        }
      }

      for (const d of additionalDates) {
        if (!d) continue;
        const extraDate = String(d).slice(0, 10);
        if (!extraDate || !baseTime) continue;

        const startsAtUTC = nyLocalToUtc(extraDate, baseTime);
        if (!startsAtUTC) continue;

        await client.query(
          `INSERT INTO program_occurrences (program_id, starts_at)
           VALUES ($1, $2)`,
          [programId, startsAtUTC]
        );
      }
    }

    await client.query("COMMIT");

    // ❌ NO Cal sync here either
    res.json(programUpdate.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error updating program:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

/* =========================================================
   DELETE PROGRAM
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM programs WHERE id=$1", [req.params.id]);
    res.json({ message: "Program deleted" });
  } catch (err) {
    console.error("❌ Error deleting program:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
