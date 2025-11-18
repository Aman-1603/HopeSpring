import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* --------------------- GET ALL ANNOUNCEMENTS ---------------------- */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM announcements ORDER BY created_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* --------------------- ADD ANNOUNCEMENT ---------------------------- */
router.post("/", async (req, res) => {
  try {
    const { title, description, link, expiryDate, published, image } = req.body;

    const result = await pool.query(
      `INSERT INTO announcements 
       (title, description, link, expiry_date, published, image)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, description, link, expiryDate, published, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding announcement:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------- DELETE ANNOUNCEMENT ----------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM announcements WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    console.error("❌ Error deleting announcement:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
