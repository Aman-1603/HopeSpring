// hope_spring/backend/routes/programRoutes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* =========================================================
   GET ALL PROGRAMS (ADMIN)
   GET /api/programs
========================================================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, title, description, category,
        date, time, location, max_capacity, instructor, status,
        participants,
        day_label, time_label, column_index, sort_order, is_active,
        cal_event_type_id, cal_slug, cal_user
      FROM programs
      ORDER BY date ASC NULLS LAST, time ASC NULLS LAST, id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching programs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   PUBLIC: SUPPORT GROUPS (CARDS)
   GET /api/programs/support-groups
   MUST be ABOVE any /:id routes
========================================================= */
router.get("/support-groups", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, title, description, instructor,
        day_label, time_label, column_index, sort_order,
        cal_event_type_id, cal_slug, cal_user
      FROM programs
      WHERE category='support_group' AND is_active=TRUE
      ORDER BY column_index ASC, sort_order ASC, id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching support groups:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   CATEGORIES (fixed routes first)
========================================================= */

/* GET all categories
   GET /api/programs/categories/all
*/
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

/* ADD category
   POST /api/programs/categories
*/
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

/* DELETE category
   DELETE /api/programs/categories/:name
*/
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
   DELETE SINGLE OCCURRENCE (fixed prefix)
   DELETE /api/programs/occurrence/:occId
========================================================= */
router.delete("/occurrence/:occId", async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM program_occurrences WHERE id=$1`,
      [req.params.occId]
    );
    res.json({ message: "Occurrence deleted" });
  } catch (err) {
    console.error("❌ Error deleting occurrence:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================================================
   GET OCCURRENCES FOR A PROGRAM
   GET /api/programs/:id/occurrences
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
   ADD PROGRAM + OCCURRENCES
   POST /api/programs
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

      // support-group fields
      day_label,
      time_label,
      column_index,
      sort_order,
      is_active,

      // extra session dates from admin (datetime-local strings)
      additionalDates = [],
    } = req.body;

    // 1) Insert program
    const programInsert = await client.query(
      `
      INSERT INTO programs (
        title, description, category, date, time, location,
        max_capacity, instructor, status,
        day_label, time_label, column_index, sort_order, is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
      `,
      [
        title,
        description,
        category,
        date || null,
        time || null,
        location,
        maxCapacity,
        instructor,
        status || "upcoming",

        day_label || null,
        time_label || null,
        column_index || 1,
        sort_order || 0,
        is_active ?? true,
      ]
    );

    const createdProgram = programInsert.rows[0];
    const programId = createdProgram.id;

    // 2) Insert main occurrence (from date + time)
    if (date && time) {
      const mainStartsAt = new Date(`${date}T${time}`);
      await client.query(
        `
        INSERT INTO program_occurrences (program_id, starts_at)
        VALUES ($1, $2)
        `,
        [programId, mainStartsAt]
      );
    }

    // 3) Insert additional occurrences
    for (const dt of additionalDates) {
      if (!dt) continue;
      const startsAt = new Date(dt);
      await client.query(
        `
        INSERT INTO program_occurrences (program_id, starts_at)
        VALUES ($1, $2)
        `,
        [programId, startsAt]
      );
    }

    await client.query("COMMIT");
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
   EDIT PROGRAM (+ optional replace occurrences)
   PUT /api/programs/:id
========================================================= */
router.put("/:id", async (req, res) => {
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

      // if passed, we replace occurrences
      additionalDates,
    } = req.body;

    // 1) Update program
    const programUpdate = await client.query(
      `
      UPDATE programs SET
        title=$1, description=$2, category=$3,
        date=$4, time=$5, location=$6,
        max_capacity=$7, instructor=$8, status=$9,
        day_label=$10, time_label=$11, column_index=$12,
        sort_order=$13, is_active=$14,
        updated_at=NOW()
      WHERE id=$15
      RETURNING *
      `,
      [
        title,
        description,
        category,
        date || null,
        time || null,
        location,
        maxCapacity,
        instructor,
        status,

        day_label || null,
        time_label || null,
        column_index || 1,
        sort_order || 0,
        is_active ?? true,

        req.params.id,
      ]
    );

    const updatedProgram = programUpdate.rows[0];

    // 2) If admin sent additionalDates, replace occurrences
    if (Array.isArray(additionalDates)) {
      const programId = req.params.id;

      await client.query(
        `DELETE FROM program_occurrences WHERE program_id=$1`,
        [programId]
      );

      if (date && time) {
        const mainStartsAt = new Date(`${date}T${time}`);
        await client.query(
          `
          INSERT INTO program_occurrences (program_id, starts_at)
          VALUES ($1, $2)
          `,
          [programId, mainStartsAt]
        );
      }

      for (const dt of additionalDates) {
        if (!dt) continue;
        const startsAt = new Date(dt);
        await client.query(
          `
          INSERT INTO program_occurrences (program_id, starts_at)
          VALUES ($1, $2)
          `,
          [programId, startsAt]
        );
      }
    }

    await client.query("COMMIT");
    res.json(updatedProgram);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error updating program:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

/* =========================================================
   DELETE PROGRAM (CASCADE OCCURRENCES)
   DELETE /api/programs/:id
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
