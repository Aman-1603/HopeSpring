// hope_spring/backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import programRoutes from "./routes/programRoutes.js";
import announcementRoutes from "./routes/announcements.js";

dotenv.config();

const app = express();

/* ------------------------------------------
   CORS
-------------------------------------------*/
app.use(
  cors({
    origin: "*", // you can tighten this later
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* 🔍 Global request logger */
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

/* ------------------------------------------
   HEALTH CHECK
-------------------------------------------*/
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/* ------------------------------------------
   AUTH ROUTES (REGISTER + LOGIN)
-------------------------------------------*/

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await pool.query("SELECT 1 FROM users WHERE email=$1", [
      email,
    ]);

    if (exists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role`,
      [name, email, hashed, role || "member"]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (query.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = query.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------------------
   Cal.com Webhook → Bookings
-------------------------------------------*/

app.post("/api/cal/webhook", async (req, res) => {
  try {
    console.log("🔥 Incoming Cal webhook");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const payload = req.body;

    const trigger =
      payload.triggerEvent ||
      payload.trigger ||
      payload.type ||
      "UNKNOWN_TRIGGER";

    const event =
      payload.data ||
      payload.payload ||
      payload.event ||
      payload.booking ||
      payload;

    console.log("Trigger:", trigger);

    const calBookingId = event.id || event.uid || event.bookingId || null;

    const attendee = (event.attendees && event.attendees[0]) || {};
    const attendeeName = attendee.name || event.name || "Unknown";
    const attendeeEmail = attendee.email || event.email || "unknown@example.com";

    const eventStart = event.startTime || event.start || null;
    const eventEnd = event.endTime || event.end || null;

    console.log("calBookingId:", calBookingId);
    console.log("attendee:", attendeeName, attendeeEmail);
    console.log("eventStart:", eventStart, "eventEnd:", eventEnd);

    // TEMP: basic insert without program mapping logic
    const insertBooking = `
      INSERT INTO bookings (
        program_id,
        user_id,
        cal_booking_id,
        attendee_name,
        attendee_email,
        status,
        event_start,
        event_end,
        created_at
      )
      VALUES (NULL, NULL, $1, $2, $3, 'confirmed', $4, $5, NOW())
      ON CONFLICT (cal_booking_id) DO NOTHING
      RETURNING *;
    `;

    const params = [
      calBookingId,
      attendeeName,
      attendeeEmail,
      eventStart ? new Date(eventStart) : null,
      eventEnd ? new Date(eventEnd) : null,
    ];

    const result = await pool.query(insertBooking, params);
    console.log("✅ Booking insert result:", result.rows);

    return res.json({ success: true });
  } catch (err) {
    console.error("💥 Cal webhook error:", err);
    return res.json({ success: false });
  }
});

/* ------------------------------------------
   Admin Auth Middleware
-------------------------------------------*/
function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden (admin only)" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

/* ------------------------------------------
   Admin: List bookings
-------------------------------------------*/
app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.id,
        b.cal_booking_id,
        b.attendee_name,
        b.attendee_email,
        b.status,
        b.event_start,
        b.event_end,
        b.created_at,
        p.id AS program_id,
        p.title AS program_title,
        p.category AS program_category
      FROM bookings b
      LEFT JOIN programs p ON p.id = b.program_id
      ORDER BY b.event_start DESC NULLS LAST, b.created_at DESC
      `
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
});

/* ------------------------------------------
   Program + Announcement Routes
-------------------------------------------*/
app.use("/api/programs", programRoutes);
app.use("/api/announcements", announcementRoutes);

/* ------------------------------------------
   Start Server
-------------------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at PORT ${PORT}`);
});
