// backend/routes/boutiqueRoutes.js
import express from "express";
import { pool } from "../db.js";
import {
  sendBoutiqueRequestSubmittedEmail,
  sendBoutiqueStatusUpdateEmail,
} from "../lib/emailClient.js";

const router = express.Router();

/* ------------------------------------------
   Helpers
   NOTE: /api/boutique is already behind requireAuth
   in server.js, so req.user should always be set.
-------------------------------------------*/

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden (admin only)" });
  }
  next();
}

/* ------------------------------------------
   POST /api/boutique/requests
   Member: create a new boutique request
-------------------------------------------*/

router.post("/requests", async (req, res) => {
  try {
    const memberId = req.user?.id || null;

    const {
      forWhom,
      requesterName,
      requesterEmail,
      requesterPhone,
      recipientName,
      relationship,
      wantsWig,
      wantsHeadcover,
      wantsCamisole,
      otherItems,
      deliveryMethod,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      inLocalDeliveryArea,
      preferredContactMethod,
      notes,
    } = req.body || {};

    // Basic validation
    if (!requesterName || !requesterEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required." });
    }

    if (!deliveryMethod || !["home_delivery", "clinic_pickup"].includes(deliveryMethod)) {
      return res.status(400).json({
        success: false,
        message: "deliveryMethod must be 'home_delivery' or 'clinic_pickup'.",
      });
    }

    if (!forWhom || !["self", "family", "friend", "other"].includes(forWhom)) {
      return res.status(400).json({
        success: false,
        message: "forWhom must be one of: self, family, friend, other.",
      });
    }

    const anyItemRequested =
      !!wantsWig || !!wantsHeadcover || !!wantsCamisole || !!(otherItems && otherItems.trim());

    if (!anyItemRequested) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one item or describe what you need.",
      });
    }

    if (deliveryMethod === "home_delivery" && !addressLine1) {
      return res.status(400).json({
        success: false,
        message: "Address line 1 is required for home delivery.",
      });
    }

    // Insert into boutique_requests (schema we designed)
    const result = await pool.query(
      `
      INSERT INTO boutique_requests (
        member_id,
        for_whom,
        requester_name,
        requester_email,
        requester_phone,
        recipient_name,
        relationship,
        wants_wig,
        wants_headcover,
        wants_camisole,
        other_items,
        delivery_method,
        address_line1,
        address_line2,
        city,
        province,
        postal_code,
        in_local_delivery_area,
        preferred_contact_method,
        notes,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,
        $12,$13,$14,$15,$16,$17,$18,$19,$20,
        'new', NOW(), NOW()
      )
      RETURNING *
      `,
      [
        memberId,
        forWhom,
        requesterName,
        requesterEmail,
        requesterPhone || null,
        forWhom === "self" ? null : (recipientName || null),
        forWhom === "self" ? null : (relationship || null),
        !!wantsWig,
        !!wantsHeadcover,
        !!wantsCamisole,
        otherItems || null,
        deliveryMethod,
        deliveryMethod === "home_delivery" ? addressLine1 : null,
        deliveryMethod === "home_delivery" ? addressLine2 || null : null,
        deliveryMethod === "home_delivery" ? city || null : null,
        deliveryMethod === "home_delivery" ? province || null : null,
        deliveryMethod === "home_delivery" ? postalCode || null : null,
        deliveryMethod === "home_delivery" ? !!inLocalDeliveryArea : false,
        preferredContactMethod || "no_preference",
        notes || null,
      ]
    );

    const saved = result.rows[0];

    // Fire-and-forget email
    if (saved) {
      sendBoutiqueRequestSubmittedEmail(saved).catch((err) => {
        console.error("❌ Failed to send boutique submission email:", err);
      });
    }

    return res.status(201).json({ success: true, request: saved });
  } catch (err) {
    console.error("❌ Create boutique request failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit request" });
  }
});

/* ------------------------------------------
   GET /api/boutique/requests
   Admin: full list
-------------------------------------------*/

router.get("/requests", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM boutique_requests
      ORDER BY created_at DESC
      `
    );

    return res.json({ success: true, requests: result.rows });
  } catch (err) {
    console.error("❌ Fetch boutique requests failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load requests" });
  }
});

/* ------------------------------------------
   GET /api/boutique/requests/stats
   Admin: summary counts
-------------------------------------------*/

router.get("/requests/stats", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE status = 'new')         AS new_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
        COUNT(*) FILTER (WHERE status = 'completed')   AS completed_count,
        COUNT(*) FILTER (WHERE status = 'cancelled')   AS cancelled_count,
        COUNT(*)                                       AS total_count
      FROM boutique_requests
      `
    );

    return res.json({ success: true, stats: result.rows[0] });
  } catch (err) {
    console.error("❌ Fetch boutique stats failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load stats" });
  }
});

/* ------------------------------------------
   PATCH /api/boutique/requests/:id/status
   Admin: update status + notify user
-------------------------------------------*/

router.patch("/requests/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    const allowed = ["new", "in_progress", "completed", "cancelled"];
    const next = (status || "").toLowerCase();

    if (!id || !Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    if (!allowed.includes(next)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const result = await pool.query(
      `
      UPDATE boutique_requests
      SET status = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id, next]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    const updated = result.rows[0];

    // Fire-and-forget status email
    sendBoutiqueStatusUpdateEmail(updated).catch((err) => {
      console.error("❌ Failed to send boutique status email:", err);
    });

    return res.json({ success: true, request: updated });
  } catch (err) {
    console.error("❌ Update boutique request status failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
});

/* ------------------------------------------
   GET /api/boutique/requests/my
   Member: see own requests
-------------------------------------------*/

router.get("/requests/my", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const memberId = req.user.id;
    const result = await pool.query(
      `
      SELECT *
      FROM boutique_requests
      WHERE member_id = $1
      ORDER BY created_at DESC
      `,
      [memberId]
    );

    return res.json({ success: true, requests: result.rows });
  } catch (err) {
    console.error("❌ Fetch my boutique requests failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load your requests" });
  }
});

export default router;
