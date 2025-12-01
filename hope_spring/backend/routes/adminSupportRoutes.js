import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* 1) GET ALL ACTIVE SUPPORT TICKETS (LEFT SIDEBAR LIST) */
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await pool.query(`
      SELECT t.id, t.user_id, t.subject, t.latest_message, u.name, u.email
      FROM support_tickets t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);

    res.json(tickets.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 2) GET ALL MESSAGES OF A SPECIFIC TICKET */
router.get("/messages/:ticket_id", async (req, res) => {
  const { ticket_id } = req.params;

  try {
    const messages = await pool.query(
      `SELECT sender_type AS sender, message AS text, created_at
       FROM support_messages
       WHERE ticket_id=$1
       ORDER BY created_at ASC`,
      [ticket_id]
    );

    res.json(messages.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 3) ADMIN SEND MESSAGE */
router.post("/send-message", async (req, res) => {
  try {
    const { ticket_id, admin_id, message } = req.body;

    // save message
    await pool.query(
      `INSERT INTO support_messages (ticket_id, sender_type, sender_id, message)
       VALUES ($1, 'admin', $2, $3)`,
      [ticket_id, admin_id, message]
    );

    // update latest message
    await pool.query(
      `UPDATE support_tickets SET latest_message=$1 WHERE id=$2`,
      [message, ticket_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
