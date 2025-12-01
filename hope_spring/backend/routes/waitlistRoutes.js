// backend/routes/waitlistRoutes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * POST /api/waitlist/join
 * Body: { programId, memberId?, name?, email? }
 */
router.post("/join", async (req, res) => {
  try {
    const { programId, memberId, name, email } = req.body || {};

    const pid = Number(programId);
    if (!pid || !Number.isFinite(pid)) {
      return res
        .status(400)
        .json({ error: "programId is required and must be a number" });
    }

    // 1) Make sure program exists and is active
    const progRes = await pool.query(
      `
      SELECT id, title, is_active
      FROM programs
      WHERE id = $1
      `,
      [pid]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];
    if (prog.is_active === false) {
      return res.status(400).json({ error: "Program is not active" });
    }

    const trimmedEmail = email ? String(email).trim().toLowerCase() : null;

    // 2) Avoid duplicate "waiting" entries
    const existingRes = await pool.query(
      `
      SELECT id, program_id, member_id, attendee_name, attendee_email, status, created_at
      FROM waitlist
      WHERE program_id = $1
        AND status = 'waiting'
        AND (
          ($2::INT IS NOT NULL AND member_id = $2::INT)
          OR
          ($2::INT IS NULL AND attendee_email IS NOT NULL AND attendee_email = $3)
        )
      LIMIT 1
      `,
      [pid, memberId || null, trimmedEmail]
    );

    if (existingRes.rows.length > 0) {
      return res.status(200).json({
        ok: true,
        existing: true,
        waitlist: existingRes.rows[0],
        message: "Already on the waitlist for this program",
      });
    }

    // 3) Insert new waitlist row
    const insertRes = await pool.query(
      `
      INSERT INTO waitlist (
        program_id,
        member_id,
        attendee_name,
        attendee_email,
        status
      )
      VALUES ($1, $2, $3, $4, 'waiting')
      RETURNING id, program_id, member_id, attendee_name, attendee_email, status, created_at
      `,
      [pid, memberId || null, name || null, trimmedEmail]
    );

    return res.status(201).json({
      ok: true,
      waitlist: insertRes.rows[0],
    });
  } catch (err) {
    console.error("❌ Error adding to waitlist:", err);
    return res.status(500).json({ error: "Failed to join waitlist" });
  }
});

export default router;
