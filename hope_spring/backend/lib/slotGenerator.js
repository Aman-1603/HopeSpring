// backend/lib/slotGenerator.js
import { DateTime } from "luxon";

/**
 * Generate concrete slots from overrides (preferred) or weekly availability (fallback).
 *
 * overrides format: [{ date:"YYYY-MM-DD", startTime:"HH:mm", endTime:"HH:mm" }, ...]
 * availability format: [{ days:["Tuesday"], startTime:"11:30", endTime:"12:30" }, ...]
 */
export function generateSlots({
  start,
  end,
  timeZone,
  availability = [],
  overrides = [],
  lengthInMinutes,
  slotInterval = lengthInMinutes,
  minNoticeMinutes = 0,
}) {
  const startDt = toDateTime(start, timeZone).startOf("day");
  const endDt = toDateTime(end, timeZone).startOf("day");
  const nowCutoff = DateTime.now()
    .setZone(timeZone)
    .plus({ minutes: minNoticeMinutes });

  // 1) If overrides exist, generate ONLY from overrides
  if (overrides && overrides.length) {
    return generateFromOverrides({
      overrides,
      startDt,
      endDt,
      timeZone,
      lengthInMinutes,
      slotInterval,
      nowCutoff,
    });
  }

  // 2) Fallback to weekly availability
  if (!availability || !availability.length) return [];

  return generateFromWeeklyAvailability({
    availability,
    startDt,
    endDt,
    timeZone,
    lengthInMinutes,
    slotInterval,
    nowCutoff,
  });
}

/* ---------------- Overrides-based slots ---------------- */

function generateFromOverrides({
  overrides,
  startDt,
  endDt,
  timeZone,
  lengthInMinutes,
  slotInterval,
  nowCutoff,
}) {
  const slots = [];

  for (const o of overrides) {
    if (!o?.date || !o?.startTime) continue;

    const day = DateTime.fromISO(String(o.date), { zone: timeZone }).startOf("day");
    if (day < startDt || day > endDt) continue;

    const winStart = applyHHMM(day, o.startTime);
    const winEnd = applyHHMM(day, o.endTime || addMins(o.startTime, lengthInMinutes));

    // tile slots inside window
    for (
      let s = winStart;
      s.plus({ minutes: lengthInMinutes }) <= winEnd;
      s = s.plus({ minutes: slotInterval })
    ) {
      if (s < nowCutoff) continue;
      const e = s.plus({ minutes: lengthInMinutes });

      slots.push({
        start: s.toUTC().toISO(),
        end: e.toUTC().toISO(),
        startTz: s.toISO(),
        endTz: e.toISO(),
      });
    }
  }

  // sort for stability
  slots.sort((a, b) => (a.start < b.start ? -1 : 1));
  return slots;
}

/* ---------------- Weekly-availability slots (fallback) ---------------- */

function generateFromWeeklyAvailability({
  availability,
  startDt,
  endDt,
  timeZone,
  lengthInMinutes,
  slotInterval,
  nowCutoff,
}) {
  // Build map weekday -> windows
  const windowsByWeekday = new Map();
  for (const rule of availability) {
    for (const dayName of rule.days || []) {
      const weekday = weekdayFromName(dayName); // 1=Mon ... 7=Sun
      if (!weekday) continue;
      if (!windowsByWeekday.has(weekday)) windowsByWeekday.set(weekday, []);
      windowsByWeekday.get(weekday).push({
        startTime: rule.startTime,
        endTime: rule.endTime,
      });
    }
  }

  const slots = [];
  for (let cursor = startDt; cursor <= endDt; cursor = cursor.plus({ days: 1 })) {
    const windows = windowsByWeekday.get(cursor.weekday);
    if (!windows) continue;

    for (const w of windows) {
      const winStart = applyHHMM(cursor, w.startTime);
      const winEnd = applyHHMM(cursor, w.endTime);

      for (
        let s = winStart;
        s.plus({ minutes: lengthInMinutes }) <= winEnd;
        s = s.plus({ minutes: slotInterval })
      ) {
        if (s < nowCutoff) continue;
        const e = s.plus({ minutes: lengthInMinutes });

        slots.push({
          start: s.toUTC().toISO(),
          end: e.toUTC().toISO(),
          startTz: s.toISO(),
          endTz: e.toISO(),
        });
      }
    }
  }

  return slots;
}

/* ---------------- Helpers ---------------- */

function toDateTime(d, tz) {
  if (d instanceof Date) return DateTime.fromJSDate(d, { zone: tz });
  if (typeof d === "string" && d.length === 10) {
    return DateTime.fromISO(d, { zone: tz });
  }
  return DateTime.fromISO(String(d), { zone: tz });
}

function applyHHMM(dayDt, hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return dayDt.set({ hour: h, minute: m, second: 0, millisecond: 0 });
}

function weekdayFromName(name) {
  const map = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  return map[String(name || "").toLowerCase()];
}

function addMins(hhmm, minsToAdd) {
  const [h, m] = String(hhmm).split(":").map(Number);
  const total = h * 60 + m + minsToAdd;
  const nh = Math.floor((total % 1440) / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}
