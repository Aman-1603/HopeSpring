import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Mark attendance
router.patch("/:programId/mark", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const programId = req.params.programId;

    const result = await pool.query(
      `INSERT INTO attendance (user_id, program_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, program_id) DO NOTHING
       RETURNING *`,
      [userId, programId]
    );

    res.json({
      success: true,
      message: "Attendance recorded",
      attendance: result.rows[0] || null,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
