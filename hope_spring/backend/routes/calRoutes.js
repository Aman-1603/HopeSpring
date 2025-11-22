// backend/routes/calRoutes.js
import express from "express";
import { pool } from "../db.js";
import { createEventType } from "../lib/calClient.js";

const router = express.Router();

// POST /api/cal/event-types/:programId
router.post("/event-types/:programId", async (req, res) => {
  try {
    const { programId } = req.params;

    const pRes = await pool.query(
      `SELECT id, title, description, cal_slug, cal_event_type_id, cal_user
       FROM programs WHERE id=$1`,
      [programId]
    );

    const program = pRes.rows[0];
    if (!program) return res.status(404).json({ error: "Program not found" });

    // already linked
    if (program.cal_event_type_id && program.cal_slug && program.cal_user) {
      return res.json({
        ok: true,
        message: "Already linked",
        cal_event_type_id: program.cal_event_type_id,
        cal_slug: program.cal_slug,
        cal_user: program.cal_user,
      });
    }

    // decide host username (NEVER allow null)
    const hostUser =
      process.env.CAL_USERNAME ||
      program.cal_user ||
      null;

    if (!hostUser) {
      return res.status(400).json({
        error:
          "Missing CAL_USERNAME in backend env. Add it so programs can be linked.",
      });
    }

    const baseSlug =
      (program.cal_slug ||
        program.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")) +
      "-" +
      program.id;

    const created = await createEventType({
      title: program.title,
      slug: baseSlug,
      description: program.description,
      lengthInMinutes: 60,
      host: hostUser, // ✅ attach owner
      metadata: { programId: program.id },
    });

    const calId = created.id || created.eventTypeId || created.data?.id;
    const calSlug = created.slug || baseSlug;

    await pool.query(
      `UPDATE programs
       SET cal_event_type_id=$1, cal_slug=$2, cal_user=$3
       WHERE id=$4`,
      [calId, calSlug, hostUser, program.id]
    );

    res.json({
      ok: true,
      cal_event_type_id: calId,
      cal_slug: calSlug,
      cal_user: hostUser,
    });
  } catch (err) {
    console.error("❌ Cal event type creation failed:", err?.response?.data || err);
    res.status(500).json({ error: "Cal integration failed" });
  }
});

export default router;
