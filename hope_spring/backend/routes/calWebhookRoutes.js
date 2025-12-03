// backend/routes/calWebhookRoutes.js
import express from "express";
import { pool } from "../db.js";
import { normalizeCalBooking } from "./bookingRoutes.js";

const router = express.Router();

/* ============================================================
   MAIN WEBHOOK ENDPOINT
============================================================ */
router.post("/", async (req, res) => {
  try {
    const rawBody =
      req.body instanceof Buffer ? req.body.toString("utf8") : req.body;

    let json;
    try {
      json = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
    } catch (err) {
      console.error("[Cal webhook] JSON parse failed:", err);
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const trigger =
      json?.triggerEvent || json?.event || json?.type || null;

    const payload =
      json?.payload ||
      json?.data?.payload ||
      json?.data ||
      null;

    if (!trigger || !payload) {
      console.warn("[Cal webhook] Missing trigger or payload:", json);
      return res.status(200).json({ ok: true, skipped: "no trigger/payload" });
    }

    console.log("[Cal webhook] trigger:", trigger);

    switch (trigger) {
      case "BOOKING_CREATED":
        await handleBookingCreated(payload);
        break;

      case "BOOKING_CANCELLED":
        await handleBookingCancelled(payload);
        break;

      case "BOOKING_REJECTED":
        await handleBookingRejected(payload);
        break;

      default:
        console.log("[Cal webhook] Ignored trigger:", trigger);
        break;
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[Cal webhook] Handler error:", err);
    // Always 200 so Cal doesn’t spam retries
    return res.status(200).json({ ok: false });
  }
});

/* ============================================================
   HELPERS — Find program by eventTypeId or slug
============================================================ */
async function findProgramForWebhook(payload) {
  const eventTypeId =
    payload?.eventTypeId ||
    payload?.event_type_id ||
    payload?.eventType?.id ||
    payload?.event_type ||
    null;

  if (eventTypeId) {
    const r1 = await pool.query(
      `SELECT id FROM programs WHERE cal_event_type_id = $1 LIMIT 1`,
      [Number(eventTypeId)]
    );
    if (r1.rows.length > 0) return r1.rows[0].id;
  }

  const slug =
    payload?.type ||
    payload?.slug ||
    payload?.eventType?.slug ||
    payload?.event_type ||
    null;

  if (slug) {
    const r2 = await pool.query(
      `SELECT id FROM programs WHERE cal_slug = $1 LIMIT 1`,
      [slug]
    );
    if (r2.rows.length > 0) return r2.rows[0].id;
  }

  console.warn("[Cal webhook] Could not map payload to a program:", {
    eventTypeId,
    slug,
  });

  return null;
}

/* ============================================================
   BOOKING_CREATED
   - Uses normalizeCalBooking to derive seat_count
============================================================ */
async function handleBookingCreated(payload) {
  const norm = normalizeCalBooking(payload);
  const uid = norm?.cal_booking_id;

  if (!uid) {
    console.warn("[Cal webhook] BOOKING_CREATED without uid:", payload);
    return;
  }

  const programId = await findProgramForWebhook(payload);
  if (!programId) {
    console.warn(
      "[Cal webhook] BOOKING_CREATED: program not found, skipping:",
      uid
    );
    return;
  }

  const attendeeName = norm.attendee_name || "Participant";
  const attendeeEmail = norm.attendee_email || "unknown@example.com";
  const start = norm.event_start || null;
  const end = norm.event_end || null;

  const seatCount =
    typeof norm.seat_count === "number" && norm.seat_count > 0
      ? norm.seat_count
      : 1;

  await pool.query(
    `
    INSERT INTO bookings (
      program_id,
      cal_booking_id,
      event_start,
      event_end,
      attendee_name,
      attendee_email,
      seat_count,
      status,
      raw,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,'ACCEPTED',$8,NOW())
    ON CONFLICT (cal_booking_id)
    DO UPDATE SET
      program_id     = EXCLUDED.program_id,
      event_start    = EXCLUDED.event_start,
      event_end      = EXCLUDED.event_end,
      attendee_name  = EXCLUDED.attendee_name,
      attendee_email = EXCLUDED.attendee_email,
      seat_count     = EXCLUDED.seat_count,
      status         = 'ACCEPTED',
      raw            = EXCLUDED.raw
    `,
    [
      programId,
      uid,
      start,
      end,
      attendeeName,
      attendeeEmail,
      seatCount,
      norm.raw || payload,
    ]
  );

  console.log(
    "[Cal webhook] BOOKING_CREATED synced:",
    uid,
    "→ program",
    programId,
    "seats=",
    seatCount
  );
}

/* ============================================================
   BOOKING_CANCELLED
============================================================ */
async function handleBookingCancelled(payload) {
  const uid = payload?.uid;
  if (!uid) {
    console.warn("[Cal webhook] BOOKING_CANCELLED without uid:", payload);
    return;
  }

  await pool.query(
    `
    UPDATE bookings
    SET status = 'CANCELLED',
        raw = $2
    WHERE cal_booking_id = $1
    `,
    [uid, payload]
  );

  console.log("[Cal webhook] BOOKING_CANCELLED synced:", uid);
}

/* ============================================================
   BOOKING_REJECTED
============================================================ */
async function handleBookingRejected(payload) {
  const uid = payload?.uid;
  if (!uid) {
    console.warn("[Cal webhook] BOOKING_REJECTED without uid:", payload);
    return;
  }

  await pool.query(
    `
    UPDATE bookings
    SET status = 'REJECTED',
        raw = $2
    WHERE cal_booking_id = $1
    `,
    [uid, payload]
  );

  console.log("[Cal webhook] BOOKING_REJECTED synced:", uid);
}

export default router;
