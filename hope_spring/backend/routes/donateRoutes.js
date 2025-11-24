// backend/routes/donateRoutes.js
import express from "express";
import Stripe from "stripe";
import { pool } from "../db.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/* =============================
   POST /api/donate/create-session
   Body: { amount: number (cents), category?: string }
============================= */
router.post("/create-session", async (req, res) => {
  try {
    const { amount, category } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const currency = "cad";

    // 1) Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Donation to HopeSpring",
            },
            unit_amount: amount, // already in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/donate?canceled=1`,
      metadata: {
        category: category || "General Support",
      },
    });

    // 2) Save initial donation row
    await pool.query(
      `
      INSERT INTO donations (stripe_session_id, amount_cents, currency, category, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (stripe_session_id) DO NOTHING
      `,
      [session.id, amount, currency, category || "General Support", "created"]
    );

    // 3) Send Checkout URL back to frontend
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating Stripe session:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
