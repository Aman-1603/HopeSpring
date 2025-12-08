// hope_spring/backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

import programRoutes from "./routes/programRoutes.js";
import announcementRoutes from "./routes/announcements.js";
import calRoutes from "./routes/calRoutes.js";
import userRoutes from "../backend/routes/userRoutes.js";
import calendarEventRoutes from "../backend/routes/calendarEvents.js";
import donateRoutes from "../backend/routes/donateRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import calWebhookRoutes from "./routes/calWebhookRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import adminSupportRoutes from "./routes/adminSupportRoutes.js";
import waitlistRoutes from "./routes/waitlistRoutes.js";
import adminBookingsRoute from "./routes/adminBookings.js";
import boutiqueRoutes from "./routes/boutiqueRoutes.js";
import adminDonationRoutes  from "./routes/adminDonationRoutes.js"
import adminAllBookings  from "./routes/adminAllBookings.js"


dotenv.config();

const app = express();

/* ------------------------------------------
   CORS
-------------------------------------------*/
app.use(
  cors({
    origin: "*", // tighten later
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ------------------------------------------
   RAW BODY FOR CAL WEBHOOK
-------------------------------------------*/
app.use(
  "/api/cal/webhook",
  express.raw({ type: "application/json" }),
  calWebhookRoutes
);

/* ------------------------------------------
   NORMAL JSON PARSER
-------------------------------------------*/
app.use(express.json());

/* ------------------------------------------
   REQUEST LOGGER
-------------------------------------------*/
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
   USER-AUTH MIDDLEWARE (NON-ADMIN)
-------------------------------------------*/
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token" });
    }

    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

/* ------------------------------------------
   ADMIN-ONLY MIDDLEWARE
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
   ADMIN BOOKINGS
-------------------------------------------*/
app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.id,
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
   NORMAL ROUTES
-------------------------------------------*/
app.use("/api/users", userRoutes);
app.use("/api/calendar-events", calendarEventRoutes);
app.use("/api/donate", donateRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin/support", adminSupportRoutes);
app.use("/api/admin/bookings", adminBookingsRoute);
app.use("/api/programs", programRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/boutique", requireAuth, boutiqueRoutes);
app.use("/api/admin/donations", adminDonationRoutes);


//fetch all booked program in the admin
app.use("/api/admin/all-bookings", adminAllBookings);


/* ------------------------------------------
   🚨 BOOKINGS REQUIRE LOGIN
-------------------------------------------*/
app.use("/api/bookings", requireAuth, bookingRoutes);

/* ------------------------------------------
   CAL ROUTES
-------------------------------------------*/
app.use("/api/cal", calRoutes);

/* ------------------------------------------
   WAITLIST
-------------------------------------------*/
app.use("/api/waitlist", waitlistRoutes);

/* ------------------------------------------
   START SERVER
-------------------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at PORT ${PORT}`);
});
