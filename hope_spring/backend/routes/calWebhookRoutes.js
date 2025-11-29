// hope_spring/backend/routes/calWebhookRoutes.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// IMPORTANT: server.js must mount this router with express.raw({ type: "application/json" })
// so req.body here will be a Buffer, not already JSON-parsed.

router.post("/", async (req, res) => {
  try {
    const rawBody =
      req.body instanceof Buffer ? req.body.toString("utf8") : req.body;
    const payload = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    // Cal sometimes wraps in { triggerEvent, createdAt, payload: { ...actual booking... } }
    // or in { data: { ... } }
    const root = payload?.data || payload;
    const data = root?.payload || root;

    if (!data) {
      console.warn("[Cal webhook] No data in payload", payload);
      return res.status(400).json({ error: "No data" });
    }

    // booking id / uid
    const calBookingId =
      data.id || data.uid || data.bookingId || data.bookingID || null;

    if (!calBookingId) {
      console.warn("[Cal webhook] No booking id in payload", data);
      return res.status(400).json({ error: "No booking id" });
    }

    // event type id
    const calEventTypeId =
      data.eventTypeId ||
      data.eventType_id ||
      data.eventType?.id ||
      null;

    // times
    const startTime =
      data.startTime || data.startsAt || data.start || data.start_time || null;
    const endTime =
      data.endTime || data.endsAt || data.end || data.end_time || null;

    // status
    const status = data.status || "confirmed";

    // attendee info – prefer attendees array, fall back to direct fields
    const primary =
      data.attendee ||
      (Array.isArray(data.attendees) ? data.attendees[0] : null) ||
      {};

    const attendeeName =
      data.name ||
      primary.name ||
      data.responses?.name?.value ||
      null;

    const attendeeEmail =
      data.email ||
      primary.email ||
      data.responses?.email?.value ||
      null;

    // ---------- metadata: HopeSpring user id ----------
    const metadata = data.metadata || data.meta || {};

    let userId = null;

    const metaUserId =
      metadata.userId ||
      metadata.hsUserId ||
      metadata.hs_user_id ||
      null;

    if (metaUserId != null) {
      const parsed = parseInt(String(metaUserId), 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        userId = parsed;
      }
    }

    // Fallback: infer user from attendee email if userId still unknown
    if (!userId && attendeeEmail) {
      const { rows } = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [attendeeEmail]
      );
      userId = rows[0]?.id || null;
    }

    // Map Cal eventTypeId -> programs.id
    let programId = null;
    if (calEventTypeId) {
      const { rows } = await pool.query(
        "SELECT id FROM programs WHERE cal_event_type_id = $1 LIMIT 1",
        [calEventTypeId]
      );
      programId = rows[0]?.id || null;
    }

    await pool.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (cal_booking_id)
      DO UPDATE SET
        program_id        = COALESCE(EXCLUDED.program_id, bookings.program_id),
        user_id           = COALESCE(EXCLUDED.user_id, bookings.user_id),
        attendee_name     = EXCLUDED.attendee_name,
        attendee_email    = EXCLUDED.attendee_email,
        status            = EXCLUDED.status,
        event_start       = EXCLUDED.event_start,
        event_end         = EXCLUDED.event_end,
        cal_event_type_id = COALESCE(EXCLUDED.cal_event_type_id, bookings.cal_event_type_id),
        raw               = EXCLUDED.raw
      `,
      [
        programId,
        userId,
        calBookingId,
        attendeeName,
        attendeeEmail,
        status,
        startTime,
        endTime,
        calEventTypeId,
        data, // store the unwrapped data as raw
      ]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("[Cal webhook] error:", err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
