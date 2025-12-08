import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/facilitator/programs?email=fftest@gmail.com
 *
 * 1) Fetch all active programs where TRIM(LOWER(instructor)) = LOWER(email)
 * 2) Fetch all bookings for those programs
 * 3) Attach bookings + participant count per program
 */
router.get("/programs", async (req, res) => {
  try {
    const email = (req.query.email || "").trim();

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email query parameter is required" });
    }

    console.log("[Facilitator] requested email =", email);

    // 1) Programs for this facilitator (robust match)
    const progResult = await pool.query(
      `
      SELECT
        id,
        title,
        category,
        date,
        time,
        location
      FROM programs
      WHERE TRIM(LOWER(instructor)) = LOWER($1)
        AND is_active = TRUE
      ORDER BY date NULLS LAST, time NULLS LAST, title
      `,
      [email]
    );

    console.log(
      "[Facilitator] programs found for",
      email,
      "=",
      progResult.rowCount
    );

    const programs = progResult.rows;

    if (programs.length === 0) {
      return res.json({ success: true, programs: [] });
    }

    // 2) All bookings for those programs
    const programIds = programs.map((p) => p.id);

    const bookingsResult = await pool.query(
      `
      SELECT
        id,
        program_id,
        attendee_name,
        attendee_email,
        status
      FROM bookings
      WHERE program_id = ANY($1::int[])
      ORDER BY id
      `,
      [programIds]
    );

    const bookings = bookingsResult.rows;

    // 3) Attach bookings + participant counts
    const byProgram = new Map();

    for (const p of programs) {
      byProgram.set(p.id, {
        ...p,
        participants_count: 0,
        bookings: [],
      });
    }

    for (const b of bookings) {
      const holder = byProgram.get(b.program_id);
      if (!holder) continue;

      holder.bookings.push({
        id: b.id,
        name: b.attendee_name,
        email: b.attendee_email,
        status: b.status,
      });

      holder.participants_count += 1;
    }

    const finalPrograms = Array.from(byProgram.values());

    return res.json({
      success: true,
      programs: finalPrograms,
    });
  } catch (err) {
    console.error("[Facilitator] error loading programs:", err);
    return res.status(500).json({
      success: false,
      message: "Server error loading facilitator programs",
    });
  }
});

export default router;
