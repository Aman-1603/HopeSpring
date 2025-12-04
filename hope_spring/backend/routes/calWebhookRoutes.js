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
    // always 200 so Cal doesn't spam retries
    return res.status(200).json({ ok: false });
  }
});

/* ============================================================
   HELPERS — Map eventTypeId or slug → program.id
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

  console.warn("[Cal webhook] Could not map payload to program:", {
    eventTypeId,
    slug,
  });

  return null;
}

/* ============================================================
   Resolve user_id from booking:
   1) metadata.userId / metadata.memberId (if valid)
   2) email lookup in users table
============================================================ */
async function resolveUserIdFromBooking(norm) {
  let userId = null;

  // 1) metadata userId/memberId
  if (norm.user_id) {
    try {
      const idNum = Number(norm.user_id);
      if (Number.isFinite(idNum) && idNum > 0) {
        const r = await pool.query(
          "SELECT id FROM users WHERE id = $1 LIMIT 1",
          [idNum]
        );
        if (r.rows.length > 0) {
          userId = r.rows[0].id;
        }
      }
    } catch (e) {
      console.warn("[Cal webhook] Failed to use metadata userId:", norm.user_id);
    }
  }

  // 2) email lookup if still null
  if (!userId && norm.attendee_email) {
    const email = norm.attendee_email.trim().toLowerCase();
    if (email) {
      const r2 = await pool.query(
        "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [email]
      );
      if (r2.rows.length > 0) {
        userId = r2.rows[0].id;
      }
    }
  }

  return userId;
}

/* ============================================================
   BOOKING_CREATED
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

  // seat count
  const seatCount =
    Array.isArray(payload?.attendees) && payload.attendees.length > 0
      ? payload.attendees.length
      : norm.seat_count || 1;

  // 🔍 map to users.user_id
  const userId = await resolveUserIdFromBooking({
    ...norm,
    attendee_email: attendeeEmail,
  });

  await pool.query(
    `
    INSERT INTO bookings (
      program_id,
      user_id,
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
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACCEPTED',$9,NOW())
    ON CONFLICT (cal_booking_id)
    DO UPDATE SET
      program_id     = EXCLUDED.program_id,
      user_id        = EXCLUDED.user_id,
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
      userId, // may be null if no user matched – that's fine
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
    "user_id=",
    userId,
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
