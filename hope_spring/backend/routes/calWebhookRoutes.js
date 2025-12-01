// backend/routes/calWebhookRoutes.js

import express from "express";
import { pool } from "../db.js";

const router = express.Router();



router.post("/", async (req, res) => {
  let rawBody = req.body;

  try {
    const json =
      rawBody instanceof Buffer ? JSON.parse(rawBody.toString("utf8")) : rawBody;

    const trigger = json?.triggerEvent;
    const payload = json?.payload;

    if (!trigger || !payload) {
      console.warn("Webhook received without trigger/payload:", json);
      return res.status(200).end();
    }

    console.log(`webhook: ${trigger}`);

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
        console.log("Ignored webhook trigger:", trigger);
        break;
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(" Webhook error:", err);
    return res.status(200).json({ ok: false });
  }
});

/* ============================================================
   HELPERS — LOAD PROGRAM BY eventTypeId or slug
============================================================ */

async function findProgramForWebhook(payload) {
  const eventTypeId =
    payload?.eventTypeId ||
    payload?.event_type_id ||
    payload?.event_type ||
    null;

  if (eventTypeId) {
    const r1 = await pool.query(
      `SELECT id FROM programs WHERE cal_event_type_id = $1 LIMIT 1`,
      [eventTypeId]
    );
    if (r1.rows.length > 0) return r1.rows[0].id;
  }

  // fallback to slug-based
  const slug =
    payload?.type ||
    payload?.slug ||
    payload?.eventType ||
    payload?.event_type ||
    null;

  if (slug) {
    const r2 = await pool.query(
      `SELECT id FROM programs WHERE cal_slug = $1 LIMIT 1`,
      [slug]
    );
    if (r2.rows.length > 0) return r2.rows[0].id;
  }

  console.warn("Could not map webhook payload to a program:", {
    eventTypeId,
    slug,
  });

  return null;
}

/* ============================================================
   BOOKING_CREATED
============================================================ */

async function handleBookingCreated(payload) {
  const uid = payload?.uid;
  if (!uid) return;

  const programId = await findProgramForWebhook(payload);
  if (!programId) {
    console.warn("BOOKING_CREATED: program not found, skipping:", uid);
    return;
  }

  const attendees = payload.attendees || [];
  const first = attendees[0] || {};
  const name = first.name || null;
  const email = first.email || null;

  const start = payload.startTime || null;
  const end = payload.endTime || null;

  await pool.query(
    `
    INSERT INTO bookings (
      program_id,
      cal_booking_id,
      event_start,
      event_end,
      attendee_name,
      attendee_email,
      status,
      raw,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,'ACCEPTED',$7,NOW())
    ON CONFLICT (cal_booking_id)
    DO UPDATE SET
      program_id = EXCLUDED.program_id,
      event_start = EXCLUDED.event_start,
      event_end = EXCLUDED.event_end,
      attendee_name = EXCLUDED.attendee_name,
      attendee_email = EXCLUDED.attendee_email,
      status = 'ACCEPTED',
      raw = EXCLUDED.raw
    `,
    [programId, uid, start, end, name, email, payload]
  );

  console.log("BOOKING_CREATED synced:", uid);
}

/* ============================================================
   BOOKING_CANCELLED
============================================================ */

async function handleBookingCancelled(payload) {
  const uid = payload?.uid;
  if (!uid) return;

  await pool.query(
    `
    UPDATE bookings
    SET status = 'CANCELLED',
        raw = $2
    WHERE cal_booking_id = $1
    `,
    [uid, payload]
  );

  console.log("BOOKING_CANCELLED synced:", uid);
}

/* ============================================================
   BOOKING_REJECTED
============================================================ */

async function handleBookingRejected(payload) {
  const uid = payload?.uid;
  if (!uid) return;

  await pool.query(
    `
    UPDATE bookings
    SET status = 'REJECTED',
        raw = $2
    WHERE cal_booking_id = $1
    `,
    [uid, payload]
  );

  console.log("BOOKING_REJECTED synced:", uid);
}

export default router;
