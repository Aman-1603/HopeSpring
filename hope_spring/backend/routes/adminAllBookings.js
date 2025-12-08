// backend/routes/adminAllBookings.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* 
   PUBLIC ADMIN FETCH — NO TOKEN CHECK
   Returns ALL bookings + program details
*/
router.get("/", async (req, res) => {
  try {
    const query = await pool.query(`
      SELECT
        b.id,
        b.program_id,
        b.user_id,
        b.attendee_name,
        b.attendee_email,
        b.status,
        b.event_start,
        b.event_end,
        b.created_at,
        b.zoom_url,
        p.title AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      ORDER BY b.created_at DESC
    `);

    return res.json({
      success: true,
      bookings: query.rows
    });

  } catch (err) {
    console.error("❌ Error fetching admin all bookings:", err);
    return res.status(500).json({
      success: false,
      message: "Server error loading bookings"
    });
  }
});

export default router;
