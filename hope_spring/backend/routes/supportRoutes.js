import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* CREATE TICKET */
router.post("/create-ticket", async (req, res) => {
  try {
    const { user_id, subject, first_message } = req.body;

    const ticket = await pool.query(
      `INSERT INTO support_tickets (user_id, subject, latest_message)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user_id, subject, first_message]
    );

    const ticket_id = ticket.rows[0].id;

    await pool.query(
      `INSERT INTO support_messages (ticket_id, sender_type, sender_id, message)
       VALUES ($1, 'user', $2, $3)`,
      [ticket_id, user_id, first_message]
    );

    res.json({ ticket_id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* SEND MESSAGE */
router.post("/send-message", async (req, res) => {
  try {
    const { ticket_id, sender_type, sender_id, message } = req.body;

    await pool.query(
      `INSERT INTO support_messages (ticket_id, sender_type, sender_id, message)
       VALUES ($1, $2, $3, $4)`,
      [ticket_id, sender_type, sender_id, message]
    );

    await pool.query(
      `UPDATE support_tickets SET latest_message=$1 WHERE id=$2`,
      [message, ticket_id]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER TICKET + MESSAGES */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const ticket = await pool.query(
      `SELECT * FROM support_tickets WHERE user_id=$1 ORDER BY id DESC LIMIT 1`,
      [user_id]
    );

    if (ticket.rows.length === 0) {
      return res.json({ ticket: null, messages: [] });
    }

    const t = ticket.rows[0];

    const messages = await pool.query(
      `SELECT sender_type AS sender, message AS text, created_at
       FROM support_messages
       WHERE ticket_id=$1
       ORDER BY created_at ASC`,
      [t.id]
    );

    res.json({ ticket: t, messages: messages.rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
