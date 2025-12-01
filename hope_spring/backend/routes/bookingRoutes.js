// backend/routes/bookingRoutes.js

import express from "express";
import { pool } from "../db.js";

const router = express.Router();


export function normalizeCalBooking(calPayload) {
  if (!calPayload) return null;

  const {
    uid,
    startTime,
    endTime,
    attendees = [],
    metadata = {},
  } = calPayload;

  const first = attendees[0] || {};
  return {
    cal_booking_id: uid || null,
    event_start: startTime || null,
    event_end: endTime || null,
    attendee_name: first.name || null,
    attendee_email: first.email || null,
    user_id: metadata.userId || null,
    raw: calPayload,
  };
}

/* ============================================================
   GET /api/bookings
   Admin view — all bookings
============================================================ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      ORDER BY b.event_start DESC NULLS LAST, b.created_at DESC
      `
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("❌ Fetch bookings failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   GET /api/bookings/user/:userId
   User dashboard — their bookings
============================================================ */
router.get("/user/:userId", async (req, res) => {
  try {
    const uid = Number(req.params.userId);
    if (!uid || !Number.isFinite(uid)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      WHERE b.user_id = $1
      ORDER BY b.event_start DESC NULLS LAST, b.created_at DESC
      `,
      [uid]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("❌ Fetch user bookings failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   POST /api/bookings/programs/:id/sync
   Maintains bookings list integrity (cleanup logic)
============================================================ */
router.post("/programs/:id/sync", async (req, res) => {
  try {
    const pid = Number(req.params.id);
    if (!pid || !Number.isFinite(pid)) {
      return res.status(400).json({ error: "Invalid program id" });
    }

    const { rows: existing } = await pool.query(
      `
      SELECT id, cal_booking_id
      FROM bookings
      WHERE program_id = $1
      `,
      [pid]
    );

    const removed = [];
    for (const b of existing) {
      if (!b.cal_booking_id) continue;

      const inCalStillExists = true; // Stub — keep existing logic
      if (!inCalStillExists) {
        removed.push(b.id);
        await pool.query(`DELETE FROM bookings WHERE id = $1`, [b.id]);
      }
    }

    return res.json({
      ok: true,
      removed,
      message: "Sync completed",
    });
  } catch (err) {
    console.error("❌ Program sync failed:", err);
    res.status(500).json({ error: "Failed to sync program bookings" });
  }
});

/* ============================================================
   GET /api/bookings/programs/:id/summary
   For Admin Waitlist page
   Returns:
     capacity
     bookedCount (future ACCEPTED/CONFIRMED/BOOKED)
     freeSeats
     waitlistWaiting
============================================================ */
router.get("/programs/:id/summary", async (req, res) => {
  try {
    const programId = Number(req.params.id);
    if (!programId || !Number.isFinite(programId)) {
      return res.status(400).json({ error: "Invalid program id" });
    }

    const progRes = await pool.query(
      `
      SELECT
        id,
        title,
        max_capacity,
        participants
      FROM programs
      WHERE id = $1
      `,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];
    const nowIso = new Date().toISOString();

    // Count future active bookings
    const bookRes = await pool.query(
      `
      SELECT COUNT(*) AS cnt
      FROM bookings
      WHERE program_id = $1
        AND (event_start IS NULL OR event_start >= $2)
        AND LOWER(status) IN ('accepted','confirmed','booked')
      `,
      [programId, nowIso]
    );

    const bookedCount = Number(bookRes.rows[0]?.cnt || 0);

    // Count waiting waitlist entries
    const wlRes = await pool.query(
      `
      SELECT COUNT(*) AS cnt
      FROM waitlist
      WHERE program_id = $1
        AND status = 'waiting'
      `,
      [programId]
    );

    const waitlistWaiting = Number(wlRes.rows[0]?.cnt || 0);

    const capacity =
      prog.max_capacity != null ? Number(prog.max_capacity) : null;

    const freeSeats =
      capacity != null ? Math.max(capacity - bookedCount, 0) : null;

    return res.json({
      programId: prog.id,
      title: prog.title,
      capacity,
      participants: prog.participants || 0,
      bookedCount,
      freeSeats,
      waitlistWaiting,
    });
  } catch (err) {
    console.error("❌ Error loading summary:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

export default router;
