import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ------------------------------ GET PROGRAMS ------------------------------ */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM programs ORDER BY date ASC, time ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching programs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------ ADD PROGRAM ------------------------------ */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxCapacity,
      instructor,
      status,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO programs 
       (title, description, category, date, time, location, max_capacity, instructor, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        title,
        description,
        category,
        date,
        time,
        location,
        maxCapacity,
        instructor,
        status || "upcoming",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding program:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ----------------------------- EDIT PROGRAM ----------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxCapacity,
      instructor,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE programs SET
          title=$1, description=$2, category=$3,
          date=$4, time=$5, location=$6,
          max_capacity=$7, instructor=$8, status=$9
       WHERE id=$10 RETURNING *`,
      [
        title,
        description,
        category,
        date,
        time,
        location,
        maxCapacity,
        instructor,
        status,
        req.params.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating program:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------- DELETE PROGRAM ---------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM programs WHERE id=$1", [req.params.id]);
    res.json({ message: "Program deleted" });
  } catch (err) {
    console.error("❌ Error deleting program:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------------ CATEGORIES ------------------------------ */
router.get("/categories/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING *`,
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ existing: true, name });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/categories/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    await pool.query("DELETE FROM categories WHERE name=$1", [name]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;