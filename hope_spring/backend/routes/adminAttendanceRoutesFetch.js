import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// 1️⃣ Total summary + chart data
router.get("/summary", async (req, res) => {
  try {
    const totalAttendance = await pool.query(
      `SELECT COUNT(*) AS count FROM attendance`
    );

    const uniqueUsers = await pool.query(
      `SELECT COUNT(DISTINCT user_id) AS count FROM attendance`
    );

    const programsAttended = await pool.query(
      `SELECT COUNT(DISTINCT program_id) AS count FROM attendance`
    );

    const topPrograms = await pool.query(
      `SELECT p.title, COUNT(a.id) AS count
       FROM attendance a
       JOIN programs p ON p.id = a.program_id
       GROUP BY p.id
       ORDER BY count DESC
       LIMIT 5`
    );

    const attendanceOverTime = await pool.query(
      `SELECT DATE(attended_at) AS date, COUNT(*) AS count
       FROM attendance
       GROUP BY DATE(attended_at)
       ORDER BY date ASC`
    );

    res.json({
      success: true,
      totalAttendance: totalAttendance.rows[0].count,
      uniqueUsers: uniqueUsers.rows[0].count,
      programsAttended: programsAttended.rows[0].count,
      topPrograms: topPrograms.rows,
      attendanceOverTime: attendanceOverTime.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ Get attendance for a specific program
router.get("/program/:id", async (req, res) => {
  try {
    const programId = req.params.id;

    const attendance = await pool.query(
      `SELECT a.*, u.name AS user_name, u.email
       FROM attendance a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.program_id = $1
       ORDER BY a.attended_at DESC`,
      [programId]
    );

    res.json({ success: true, attendance: attendance.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
