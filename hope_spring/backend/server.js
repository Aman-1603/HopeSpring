// server.js - KEEPING WILDCARD CORS
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import programRoutes from "./routes/programRoutes.js";

dotenv.config();

const app = express();

/* ------------------------------------------
    CRITICAL: CORS FIX (Wildcard is safest for Codespaces)
-------------------------------------------*/
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(express.json());

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
    PROGRAM ROUTES
-------------------------------------------*/
app.use("/api/programs", programRoutes);

/* ------------------------------------------
    START SERVER
-------------------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at PORT ${PORT}`);
});