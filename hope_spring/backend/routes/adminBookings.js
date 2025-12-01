import express from "express";
import { pool } from "../db.js";  // ✔ correct import

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
  `
  SELECT 
    b.id,
    b.program_id,
    b.user_id,
    b.cal_booking_id,
    b.attendee_name,
    b.attendee_email,
    b.status,
    b.event_start,
    b.event_end,
    b.created_at,
    b.cal_event_type_id,

    -- Program table fields
    p.id AS program_db_id,
    p.title AS program_title,
    p.category AS program_category,
    p.subcategory AS program_subcategory,
    p.date AS program_date,
    p.time AS program_time,
    p.instructor AS facilitator_name,
    p.max_capacity,
    p.participants

  FROM bookings b
  LEFT JOIN programs p ON p.id = b.program_id
  ORDER BY b.event_start DESC;
  `
);

    res.status(200).json({
      success: true,
      bookings: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings",
    });
  }
});

export default router;
