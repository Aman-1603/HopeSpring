// backend/routes/bookingRoutes.js
import express from "express";
import axios from "axios";
import { pool } from "../db.js";

const router = express.Router();

const CAL_V1_BASE = "https://api.cal.com/v1";

/**
 * Normalize Cal booking to your DB fields
 */
function normalizeCalBooking(b) {
  if (!b) return null;

  const uid = b.uid || b.id || null;
  if (!uid) return null;

  const start = b.start || b.startTime || b.start_time || null;
  const end = b.end || b.endTime || b.end_time || null;

  const attendees = Array.isArray(b.attendees) ? b.attendees : [];
  const attendee = attendees[0] || {};

  return {
    cal_booking_id: uid,
    attendee_name: attendee.name || null,
    attendee_email: attendee.email || null,
    status: b.status || null,
    event_start: start ? new Date(start) : null,
    event_end: end ? new Date(end) : null,
    raw: b,
  };
}

/**
 * POST /api/bookings/programs/:id/sync
 * Sync Cal bookings into your "bookings" table
 */
router.post("/programs/:id/sync", async (req, res) => {
  const client = await pool.connect();

  try {
    const programId = req.params.id;

    // 1) Get the program + event type
    const progRes = await client.query(
      `SELECT id, cal_event_type_id FROM programs WHERE id = $1`,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const eventTypeId = progRes.rows[0].cal_event_type_id;
    if (!eventTypeId) {
      return res.status(400).json({ error: "Program has no Cal event type" });
    }

    const apiKey = process.env.CAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing CAL_API_KEY" });
    }

    // 2) Fetch bookings from Cal v1
    // Keep it simple: grab recent bookings for this eventType
    const apiRes = await axios.get(`${CAL_V1_BASE}/bookings`, {
      params: {
        apiKey: apiKey.trim(),
        eventTypeId,
        take: 200,
        // you *can* add filters later if v1 supports them
        // status: "accepted",
      },
      timeout: 20000,
    });

    const data = apiRes.data;
    let calBookings = [];

    if (Array.isArray(data)) {
      calBookings = data;
    } else if (Array.isArray(data?.data)) {
      calBookings = data.data;
    } else if (Array.isArray(data?.bookings)) {
      calBookings = data.bookings;
    } else if (Array.isArray(data?.items)) {
      calBookings = data.items;
    } else {
      console.warn("⚠️ Unexpected Cal bookings payload shape:", Object.keys(data || {}));
    }

    await client.query("BEGIN");

    let inserted = 0;
    let updated = 0;

    for (const b of calBookings) {
      const norm = normalizeCalBooking(b);
      if (!norm) continue;

      const {
        cal_booking_id,
        attendee_name,
        attendee_email,
        status,
        event_start,
        event_end,
      } = norm;

      const result = await client.query(
        `
        INSERT INTO bookings (
          program_id,
          cal_booking_id,
          attendee_name,
          attendee_email,
          status,
          event_start,
          event_end
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (cal_booking_id)
        DO UPDATE SET
          attendee_name  = EXCLUDED.attendee_name,
          attendee_email = EXCLUDED.attendee_email,
          status         = EXCLUDED.status,
          event_start    = EXCLUDED.event_start,
          event_end      = EXCLUDED.event_end,
          created_at     = now()
        RETURNING xmax = 0 AS inserted
        `,
        [
          programId,
          cal_booking_id,
          attendee_name,
          attendee_email,
          status,
          event_start,
          event_end,
        ]
      );

      if (result.rows[0].inserted) inserted++;
      else updated++;
    }

    await client.query("COMMIT");

    return res.json({
      programId,
      fetchedFromCal: calBookings.length,
      inserted,
      updated,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Sync error:", err?.response?.data || err);
    return res.status(500).json({ error: "Failed to sync bookings" });
  } finally {
    client.release();
  }
});

export default router;
