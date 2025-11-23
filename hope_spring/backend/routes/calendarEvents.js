import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* =========================================================
   GET ALL CALENDAR EVENTS (programs + occurrences)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        po.id AS occurrence_id,
        p.id AS program_id,
        p.title,
        p.description,
        p.category,
        p.instructor,
        p.location,
        po.starts_at,
        po.ends_at
      FROM program_occurrences po
      JOIN programs p ON p.id = po.program_id
      ORDER BY po.starts_at ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error loading calendar events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
