import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* -------- GET ALL USERS -------- */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error loading users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
