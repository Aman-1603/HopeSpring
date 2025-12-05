import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ================================
   GET /api/admin/donations
   Returns all donations sorted by date
================================ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        stripe_session_id,
        amount_cents,
        currency,
        category,
        donor_email,
        status,
        created_at
      FROM donations
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      donations: result.rows,
    });

  } catch (err) {
    console.error("❌ Error fetching admin donations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
