// backend/routes/bookingRoutes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ------------------------------------------
   Normalizer for Cal booking payloads
-------------------------------------------*/
export function normalizeCalBooking(calPayload) {
  if (!calPayload) return null;

  const {
    uid,
    id,
    bookingId,
    startTime,
    endTime,
    start,
    end,
    attendees = [],
    metadata = {},
    status,
  } = calPayload;

  const first = attendees[0] || {};

  // how many seats does this booking use?
  const seatCountRaw =
    (Array.isArray(attendees) && attendees.length) ||
    calPayload.seats ||
    calPayload.seatCount ||
    null;

  const seat_count =
    typeof seatCountRaw === "number" && seatCountRaw > 0
      ? seatCountRaw
      : 1;

  return {
    cal_booking_id: uid || id || bookingId || null,
    event_start: startTime || start || null,
    event_end: endTime || end || null,
    attendee_name: first.name || null,
    attendee_email: first.email || null,
    user_id: metadata.userId || metadata.memberId || null,
    seat_count,
    status: status || "ACCEPTED",
    raw: calPayload,
  };
}

/* ============================================================
   GET /api/bookings          (Admin: all bookings)
============================================================ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title   AS program_title,
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
   GET /api/bookings/user/:userId   (Member: their bookings)
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
        p.title   AS program_title,
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
   (stub for future cleanup logic)
============================================================ */
router.post("/programs/:id/sync", async (req, res) => {
  try {
    const pid = Number(req.params.id);
    if (!pid || !Number.isFinite(pid)) {
      return res.status(400).json({ error: "Invalid program id" });
    }

    // right now we don't actually delete anything – placeholder
    return res.json({
      ok: true,
      removed: [],
      message: "Sync completed (no-op placeholder)",
    });
  } catch (err) {
    console.error("❌ Program sync failed:", err);
    res.status(500).json({ error: "Failed to sync program bookings" });
  }
});

/* ============================================================
   GET /api/bookings/programs/:id/summary
   Used by:
     - ProgramTemplate (to show Join waitlist)
     - AdminWaitlist dashboard

   Returns:
     capacity         (from programs.max_capacity)
     bookedCount      (SUM of seat_count for future active bookings)
     freeSeats        (capacity - bookedCount)
     waitlistWaiting  (# of waitlist rows with status='waiting')
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

    // 🔥 IMPORTANT: use SUM(seat_count), not COUNT(*)
    const bookRes = await pool.query(
      `
      SELECT COALESCE(
        SUM(
          CASE
            WHEN seat_count IS NOT NULL AND seat_count > 0
              THEN seat_count
            ELSE 1
          END
        ),
        0
      ) AS cnt
      FROM bookings
      WHERE program_id = $1
        AND (event_start IS NULL OR event_start >= $2)
        AND LOWER(status) IN ('accepted','confirmed','booked')
      `,
      [programId, nowIso]
    );

    const bookedCount = Number(bookRes.rows[0]?.cnt || 0);

    // Waitlist count
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
