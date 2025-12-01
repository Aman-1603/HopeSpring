// backend/routes/waitlistRoutes.js
import express from "express";
import { pool } from "../db.js";
import { cal } from "../lib/calClient.js";

const router = express.Router();

/* ------------------------------------------
   Helpers
-------------------------------------------*/

function normalizeEmail(v) {
  return v ? String(v).trim().toLowerCase() : null;
}

/**
 * Utility to normalize waitlist status strings.
 * We only really use: waiting, promoted, cancelled
 */
const WAITLIST_STATUS = {
  WAITING: "waiting",
  PROMOTED: "promoted",
  CANCELLED: "cancelled",
};

/* ------------------------------------------
   POST /api/waitlist/join
   Body: { programId, memberId?, name?, email? }
-------------------------------------------*/
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

    const trimmedEmail = normalizeEmail(email);

    // 2) Avoid duplicate "waiting" entries
    const existingRes = await pool.query(
      `
      SELECT id, program_id, member_id, attendee_name, attendee_email, status, created_at
      FROM waitlist
      WHERE program_id = $1
        AND status = $2
        AND (
          ($3::INT IS NOT NULL AND member_id = $3::INT)
          OR
          ($3::INT IS NULL AND attendee_email IS NOT NULL AND attendee_email = $4)
        )
      LIMIT 1
      `,
      [pid, WAITLIST_STATUS.WAITING, memberId || null, trimmedEmail]
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
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, program_id, member_id, attendee_name, attendee_email, status, created_at
      `,
      [
        pid,
        memberId || null,
        name || null,
        trimmedEmail,
        WAITLIST_STATUS.WAITING,
      ]
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

/* ------------------------------------------
   GET /api/waitlist/program/:programId
   Returns waitlist entries for a program
-------------------------------------------*/
router.get("/program/:programId", async (req, res) => {
  try {
    const pid = Number(req.params.programId);
    if (!pid || !Number.isFinite(pid)) {
      return res
        .status(400)
        .json({ error: "programId must be a valid number" });
    }

    const rowsRes = await pool.query(
      `
      SELECT
        id,
        program_id,
        member_id,
        attendee_name,
        attendee_email,
        status,
        created_at
      FROM waitlist
      WHERE program_id = $1
      ORDER BY created_at ASC
      `,
      [pid]
    );

    const items = rowsRes.rows || [];

    const waiting = items.filter((w) => w.status === WAITLIST_STATUS.WAITING)
      .length;
    const promoted = items.filter(
      (w) => w.status === WAITLIST_STATUS.PROMOTED
    ).length;
    const cancelled = items.filter(
      (w) => w.status === WAITLIST_STATUS.CANCELLED
    ).length;

    return res.json({
      ok: true,
      programId: pid,
      waitlist: items,
      counts: {
        waiting,
        promoted,
        cancelled,
        total: items.length,
      },
    });
  } catch (err) {
    console.error("❌ Error loading waitlist for program:", err);
    return res.status(500).json({ error: "Failed to load waitlist" });
  }
});

/* ------------------------------------------
   POST /api/waitlist/:id/cancel
   Soft-cancel a waitlist entry
-------------------------------------------*/
router.post("/:id/cancel", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || !Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid waitlist id" });
    }

    const updateRes = await pool.query(
      `
      UPDATE waitlist
      SET status = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, WAITLIST_STATUS.CANCELLED]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: "Waitlist entry not found" });
    }

    return res.json({
      ok: true,
      waitlist: updateRes.rows[0],
    });
  } catch (err) {
    console.error("❌ Error cancelling waitlist entry:", err);
    return res.status(500).json({ error: "Failed to cancel waitlist entry" });
  }
});

/* ------------------------------------------
   POST /api/waitlist/:id/promote
   Body: { programId, slotStart, slotEnd? }
   - Creates a booking in Cal (/v2/bookings)
   - Upserts into bookings table immediately
   - Marks waitlist row as 'promoted' on success
-------------------------------------------*/
router.post("/:id/promote", async (req, res) => {
  try {
    const waitlistId = Number(req.params.id);
    const { programId, slotStart, slotEnd } = req.body || {};

    if (!waitlistId || !Number.isFinite(waitlistId)) {
      return res.status(400).json({ error: "Invalid waitlist id" });
    }

    const pid = Number(programId);
    if (!pid || !Number.isFinite(pid)) {
      return res
        .status(400)
        .json({ error: "programId is required and must be a number" });
    }

    if (!slotStart) {
      return res
        .status(400)
        .json({ error: "slotStart (ISO string) is required" });
    }

    // 1) Load waitlist entry
    const wlRes = await pool.query(
      `
      SELECT id, program_id, member_id, attendee_name, attendee_email, status, created_at
      FROM waitlist
      WHERE id = $1
      `,
      [waitlistId]
    );

    if (wlRes.rows.length === 0) {
      return res.status(404).json({ error: "Waitlist entry not found" });
    }

    const entry = wlRes.rows[0];
    if (entry.program_id !== pid) {
      // sanity check
      console.warn(
        "⚠️ promote mismatch: body.programId != entry.program_id",
        pid,
        entry.program_id
      );
    }

    // 2) Load program (need Cal eventTypeId + duration)
    const progRes = await pool.query(
      `
      SELECT
        id,
        title,
        cal_event_type_id,
        duration_minutes
      FROM programs
      WHERE id = $1
      `,
      [pid]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];
    if (!prog.cal_event_type_id) {
      return res
        .status(400)
        .json({ error: "Program is not linked to a Cal event type" });
    }

    const eventTypeId = prog.cal_event_type_id;

    const start = new Date(slotStart);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid slotStart" });
    }

    let end = null;
    const dur =
      Number(prog.duration_minutes) && Number(prog.duration_minutes) > 0
        ? Number(prog.duration_minutes)
        : 60;
    if (slotEnd) {
      const tmp = new Date(slotEnd);
      if (!Number.isNaN(tmp.getTime())) end = tmp;
    }
    if (!end) {
      end = new Date(start.getTime() + dur * 60 * 1000);
    }

    // 3) Build Cal /bookings payload
    const metadata = {};
    // Cal expects metadata values as strings
    metadata.hsProgramId = String(pid);
    metadata.hsWaitlistId = String(entry.id);
    if (entry.member_id) {
      metadata.memberId = String(entry.member_id);
    }

    const payload = {
      eventTypeId,
      start: start.toISOString(),
      end: end.toISOString(),
      responses: {
        name: entry.attendee_name || "",
        email: entry.attendee_email,
      },
      timeZone: "America/New_York",
      language: "en",
      status: "ACCEPTED",
      metadata,
    };

    console.log("▶️ Cal /bookings payload:", JSON.stringify(payload, null, 2));

    // 4) Call Cal API (v2)
    let calRes;
    try {
      calRes = await cal.post("/bookings", payload);
    } catch (err) {
      console.error(
        "❌ Cal POST /bookings failed:",
        err?.response?.data || err
      );
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        "Cal booking failed";
      return res.status(502).json({ error: msg });
    }

    const calData = calRes.data?.data || calRes.data || {};
    const calBookingId =
      calData.uid ||
      calData.id ||
      calData.bookingId ||
      calData.bookingID ||
      null;

    // Derive fields for DB (fallback to what we already know)
    const eventStartIso =
      calData.startTime || calData.start || payload.start || start.toISOString();
    const eventEndIso =
      calData.endTime || calData.end || payload.end || end.toISOString();

    const attendeeFromCal =
      (Array.isArray(calData.attendees) && calData.attendees[0]) || null;

    const attendeeEmail =
      attendeeFromCal?.email || entry.attendee_email || null;
    const attendeeName =
      attendeeFromCal?.name || entry.attendee_name || null;

    const status = calData.status || "ACCEPTED";
    const userId = entry.member_id || null;

    // Build raw payload for debugging/analytics
    const rawPayload = {
      source: "waitlist-promote",
      booking: calData,
      apiPayload: payload,
    };

    // 5) Upsert into bookings table (same pattern as webhook)
    const insertRes = await pool.query(
      `
      INSERT INTO bookings (
        program_id,
        user_id,
        cal_booking_id,
        attendee_name,
        attendee_email,
        status,
        event_start,
        event_end,
        cal_event_type_id,
        raw,
        created_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      ON CONFLICT (cal_booking_id)
      DO UPDATE SET
        program_id        = EXCLUDED.program_id,
        user_id           = EXCLUDED.user_id,
        attendee_name     = EXCLUDED.attendee_name,
        attendee_email    = EXCLUDED.attendee_email,
        status            = EXCLUDED.status,
        event_start       = EXCLUDED.event_start,
        event_end         = EXCLUDED.event_end,
        cal_event_type_id = EXCLUDED.cal_event_type_id,
        raw               = bookings.raw || EXCLUDED.raw
      RETURNING *
      `,
      [
        pid,
        userId,
        calBookingId,
        attendeeName,
        attendeeEmail,
        status,
        eventStartIso,
        eventEndIso,
        eventTypeId,
        rawPayload,
        new Date().toISOString(),
      ]
    );

    const bookingRow = insertRes.rows[0];

    // 6) Mark waitlist as promoted
    const updRes = await pool.query(
      `
      UPDATE waitlist
      SET status = $2
      WHERE id = $1
      RETURNING *
      `,
      [waitlistId, WAITLIST_STATUS.PROMOTED]
    );

    return res.json({
      ok: true,
      promoted: updRes.rows[0],
      calBooking: {
        id: calBookingId,
        raw: calData,
      },
      booking: bookingRow,
    });
  } catch (err) {
    console.error("❌ Error promoting waitlist entry:", err);
    return res.status(500).json({ error: "Failed to promote waitlist entry" });
  }
});

export default router;
