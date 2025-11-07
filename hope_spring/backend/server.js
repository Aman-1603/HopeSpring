// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

dotenv.config();
const app = express();

// allow CRA dev servers and Codespaces preview
const ORIGINS = ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(express.json());

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- handlers ---
async function handleRegister(req, res) {
  const { name, email, password, role } = req.body || {};
  try {
    const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name?.trim() || null, email?.trim(), hashed, role || "member"]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body || {};
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ success: false, message: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Support both /api/* and /api/auth/* paths
app.post(["/api/register", "/api/auth/register"], handleRegister);
app.post(["/api/login", "/api/auth/login"], handleLogin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
