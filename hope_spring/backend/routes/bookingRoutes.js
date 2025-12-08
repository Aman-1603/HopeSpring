// backend/routes/bookingRoutes.js
import express from "express";
import { pool } from "../db.js";
import { confirmBooking, declineBooking, cancelBooking } from "../lib/calClient.js";


const router = express.Router();

/* ------------------------------------------
   Normalizer for Cal booking payloads

   IMPORTANT: Our model is now:
     - 1 DB row in `bookings` = 1 participant = 1 seat
   So seat_count is always 1 for new rows. We keep the field
   only for legacy compatibility / analytics if needed.
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
    location,
    videoCallData, // <-- Zoom lives here as well
  } = calPayload;

  const first = attendees[0] || {};



  // With the composite (cal_booking_id, attendee_email) model,
  // each row is one person. seat_count is therefore always 1.
  const seat_count = 1;

  // Zoom join URL:
  // - v2 payload.videoCallData.url
  // - or metadata.videoCallUrl (from apps / workflows)
  const zoom_url =
    (videoCallData && videoCallData.url) ||
    (metadata && metadata.videoCallUrl) ||
    null;

  return {
    cal_booking_id: uid || id || bookingId || null,
    event_start: startTime || start || null,
    event_end: endTime || end || null,

    attendee_name: first.name || null,
    attendee_email: first.email || null,

    user_id: metadata.userId || metadata.memberId || null,
    seat_count,
    status: status || "ACCEPTED",

    // extra fields we may want later:
    location: location || null,
    zoom_url, // <-- used by calWebhookRoutes to persist into bookings.zoom_url

    raw: calPayload,
  };
}

/* ============================================================
   GET /api/bookings
   Admin: list ALL bookings
   (server.js already enforces requireAuth, here we enforce role)
============================================================ */
router.get("/", async (req, res) => {
  try {
    // req.user is set by requireAuth in server.js
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin only" });
    }

    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title    AS program_title,
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
   GET /api/bookings/pending
   Admin: list ONLY pending / requested bookings
============================================================ */
router.get("/pending", async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin only" });
    }

    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title    AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      WHERE LOWER(b.status) IN ('pending','requested')
      ORDER BY b.created_at ASC
      `
    );

    return res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("❌ Fetch pending bookings failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   GET /api/bookings/user/:userId
   Member: their bookings
   - normal user: can ONLY view their own bookings
   - admin: can view any userId

   NOTE:
   Auth is enforced at router mount level in server.js
   (e.g. app.use("/api/bookings", requireAuth, bookingRoutes))
============================================================ */
router.get("/user/:userId", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const requestedId = Number(req.params.userId);
    if (!requestedId || !Number.isFinite(requestedId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const isAdmin = req.user.role === "admin";
    const isSelf = requestedId === req.user.id;

    if (!isAdmin && !isSelf) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title    AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      WHERE b.user_id = $1
      ORDER BY b.event_start DESC NULLS LAST, b.created_at DESC
      `,
      [requestedId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("❌ Fetch user bookings failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   POST /api/bookings/:id/approve
   Admin: approve a pending booking.
   - Looks up booking by local id
   - Calls Cal v2 /bookings/{uid}/confirm
   - Marks status = 'ACCEPTED' (webhook will also update)
============================================================ */
router.post("/:id/approve", async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin only" });
    }

    const id = Number(req.params.id);
    if (!id || !Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const bRes = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (bRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const booking = bRes.rows[0];
    const status = (booking.status || "").toLowerCase();

    if (!["pending", "requested"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Booking is not pending (current status: ${booking.status})`,
      });
    }

    if (!booking.cal_booking_id) {
      return res.status(400).json({
        success: false,
        message: "This booking has no Cal uid; cannot confirm via API",
      });
    }

    // 1) Confirm in Cal (v2 POST /bookings/{uid}/confirm)
    await confirmBooking(booking.cal_booking_id);

    // 2) Update local status immediately; webhook BOOKING_CREATED will also update
    await pool.query(
      `
      UPDATE bookings
      SET status = 'ACCEPTED'
      WHERE id = $1
      `,
      [id]
    );

    return res.json({ success: true, message: "Booking approved" });
  } catch (err) {
    console.error("❌ Approve booking failed:", err);
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Failed to approve booking";
    return res.status(500).json({ success: false, message: msg });
  }
});

/* ============================================================
   POST /api/bookings/:id/reject
   Admin: reject a pending booking.
   - Looks up booking by local id
   - Calls Cal v2 /bookings/{uid}/decline
   - Marks status = 'REJECTED'
============================================================ */
router.post("/:id/reject", async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin only" });
    }

    const id = Number(req.params.id);
    if (!id || !Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const { reason } = req.body || {};

    const bRes = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (bRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const booking = bRes.rows[0];
    const status = (booking.status || "").toLowerCase();

    if (!["pending", "requested"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Booking is not pending (current status: ${booking.status})`,
      });
    }

    if (!booking.cal_booking_id) {
      return res.status(400).json({
        success: false,
        message: "This booking has no Cal uid; cannot decline via API",
      });
    }

    // 1) Decline in Cal (v2 POST /bookings/{uid}/decline)
    await declineBooking(booking.cal_booking_id, reason || null);

    // 2) Update local status; webhook BOOKING_REJECTED will also update
    await pool.query(
      `
      UPDATE bookings
      SET status = 'REJECTED'
      WHERE id = $1
      `,
      [id]
    );

    return res.json({ success: true, message: "Booking rejected" });
  } catch (err) {
    console.error("❌ Reject booking failed:", err);
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err.message ||
      "Failed to reject booking";
    return res.status(500).json({ success: false, message: msg });
  }
});

/* ============================================================
   POST /api/bookings/programs/:id/sync
   (placeholder)
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
     bookedCount      (# of rows = # participants for future active bookings)
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

    // New model: 1 booking row = 1 participant = 1 seat
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

/* ============================================================
   GET /api/bookings/programs/:id/slot-usage
   Slot-level seat usage for a program.

   Returns:
     {
       programId,
       capacityPerSlot,       // from programs.max_capacity (can be null)
       slots: [
         {
           eventStart: ISO string,
           bookedCount: number
         },
         ...
       ]
     }

   Notes:
     - Only counts future (or undated) bookings with active status
     - If a slot has no bookings yet, it won't appear here
       → frontend treats missing = 0 booked
============================================================ */
router.get("/programs/:id/slot-usage", async (req, res) => {
  try {
    const programId = Number(req.params.id);
    if (!programId || !Number.isFinite(programId)) {
      return res.status(400).json({ error: "Invalid program id" });
    }

    // 1) Load program to get capacity per slot
    const progRes = await pool.query(
      `
      SELECT id, max_capacity
      FROM programs
      WHERE id = $1
      `,
      [programId]
    );

    if (progRes.rows.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }

    const prog = progRes.rows[0];
    const capacityPerSlot =
      prog.max_capacity != null ? Number(prog.max_capacity) : null;

    const nowIso = new Date().toISOString();

    // 2) Aggregate bookings by event_start
    const rowsRes = await pool.query(
      `
      SELECT
        event_start,
        COUNT(*) AS booked_cnt
      FROM bookings
      WHERE program_id = $1
        AND event_start IS NOT NULL
        AND (event_start >= $2)
        AND LOWER(status) IN ('accepted','confirmed','booked')
      GROUP BY event_start
      ORDER BY event_start
      `,
      [programId, nowIso]
    );

    const slots = (rowsRes.rows || []).map((row) => ({
      eventStart: row.event_start, // timestamptz → ISO when JSON stringified
      bookedCount: Number(row.booked_cnt || 0),
    }));

    return res.json({
      programId,
      capacityPerSlot,
      slots,
    });
  } catch (err) {
    console.error("❌ Error loading slot usage:", err);
    return res.status(500).json({ error: "Failed to load slot usage" });
  }
});

/* ============================================================
   GET /api/bookings/past
   Returns past sessions for the currently logged-in user
============================================================ */
router.get("/past", async (req, res) => {
  try {
    // requireAuth (in server.js) should already have set req.user
    const userId = req.user?.id;

    if (!userId || !Number.isFinite(Number(userId))) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const nowIso = new Date().toISOString();

    const result = await pool.query(
      `
      SELECT
        b.*,
        p.title   AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      WHERE b.user_id = $1
        AND b.event_start IS NOT NULL
        AND b.event_start < $2
        AND (
          LOWER(b.status) IN ('accepted','confirmed','booked','attended','completed')
          OR b.status IS NULL
        )
      ORDER BY b.event_start DESC NULLS LAST, b.created_at DESC
      `,
      [userId, nowIso]
    );

    return res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (err) {
    console.error("❌ Fetch past bookings failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

/* ============================================================
   CANCEL A BOOKING (USER)
   PATCH /api/bookings/:bookingId/cancel
   - Only owner can cancel
   - Cancels in Cal (if cal_booking_id present)
   - Sets local status = 'CANCELLED'
============================================================ */
router.patch("/:bookingId/cancel", async (req, res) => {
  try {
    // requireAuth is enforced at mount level in server.js
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const bookingId = Number(req.params.bookingId);
    if (!bookingId || !Number.isFinite(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking id" });
    }

    // 1. Fetch booking (including cal_booking_id)
    const selectSql = `
      SELECT
        id,
        user_id,
        status,
        program_id,
        cal_booking_id
      FROM bookings
      WHERE id = $1
    `;
    const { rows } = await pool.query(selectSql, [bookingId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const booking = rows[0];

    // 2. Ownership check
    if (booking.user_id !== user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to cancel this booking" });
    }

    // 3. Only cancel if it's actually taking a seat
    //    (matches your summary / slot-usage logic)
    const statusLower = (booking.status || "").toLowerCase();
    const activeSeatStatuses = ["accepted", "confirmed", "booked"];

    if (!activeSeatStatuses.includes(statusLower)) {
      return res.status(400).json({
        success: false,
        message: `Booking is not cancellable (current status: ${booking.status})`,
      });
    }

    // 4. Cancel in Cal if we have a Cal uid
    if (booking.cal_booking_id) {
      try {
        await cancelBooking(
          booking.cal_booking_id,
          "User requested cancellation via HopeSpring portal"
        );
      } catch (err) {
        console.error(
          "❌ Failed to cancel in Cal, aborting local cancel",
          err.response?.data || err.message
        );
        return res.status(502).json({
          success: false,
          message:
            "Failed to cancel booking in scheduling system. Please try again later.",
        });
      }
    }

    // 5. Update local status -> CANCELLED
    const updateSql = `
      UPDATE bookings
      SET status = 'CANCELLED'
      WHERE id = $1
    `;
    await pool.query(updateSql, [bookingId]);

    // Seat is free now because all your seat logic only counts
    // LOWER(status) IN ('accepted','confirmed','booked')

    return res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error("❌ Cancel booking failed:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



export default router;
