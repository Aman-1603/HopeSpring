// backend/lib/calClient.js
import axios from "axios";

const CAL_BASE = "https://api.cal.com/v2";
const CAL_VERSION = "2024-06-14";

/* ============================================
   ENV + BASE CLIENT
============================================ */

function requireEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val.trim();
}

const CAL_API_KEY = requireEnv("CAL_API_KEY");

export const cal = axios.create({
  baseURL: CAL_BASE,
  headers: {
    Authorization: CAL_API_KEY.startsWith("Bearer ")
      ? CAL_API_KEY
      : `Bearer ${CAL_API_KEY}`,
    "Content-Type": "application/json",
    "cal-api-version": CAL_VERSION,
  },
  timeout: 20000,
});

/* ============================================
   LOW-LEVEL HELPERS
============================================ */

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

function toApiMsg(err) {
  const d = err?.response?.data;
  if (!d) return err.message || "Unknown Cal error";
  if (typeof d === "string") return d;
  if (d.message) {
    return typeof d.message === "string"
      ? d.message
      : JSON.stringify(d.message);
  }
  if (d.error?.message) return d.error.message;
  try {
    return JSON.stringify(d);
  } catch {
    return err.message || "Unknown Cal error";
  }
}

async function calGet(path, config) {
  try {
    const res = await cal.get(path, config);
    return unwrap(res);
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal GET failed:", path, msg);
    throw new Error(msg);
  }
}

async function calPost(path, payload, config) {
  try {
    const res = await cal.post(path, payload, config);
    return unwrap(res);
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal POST failed:", path, msg, payload);
    throw new Error(msg);
  }
}

async function calPatch(path, payload, config) {
  try {
    const res = await cal.patch(path, payload, config);
    return unwrap(res);
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal PATCH failed:", path, msg, payload);
    throw new Error(msg);
  }
}

/* ============================================
   SCHEDULES
============================================ */


export async function createSchedule(input) {
  const {
    name,
    timeZone = "America/New_York",
    availability = [],
    ...rest
  } = input || {};

  if (!name) throw new Error("createSchedule: name is required");

  const payload = {
    name,
    timeZone,
    availability,
    ...rest,
  };

  return calPost("/schedules", payload);
}

/**
 * Update a schedule in Cal.
 */
export async function updateSchedule(scheduleId, input) {
  if (!scheduleId) throw new Error("updateSchedule: scheduleId is required");
  const payload = { ...(input || {}) };
  return calPatch(`/schedules/${scheduleId}`, payload);
}

/* ============================================
   EVENT TYPES
============================================ */


export async function createEventType(input) {
  if (!input) throw new Error("createEventType: input is required");

  const {
    title,
    slug,
    lengthInMinutes = 60,
    description,
    scheduleId,
    locations,
    seats,
    bookingWindow,
    ...rest
  } = input;

  if (!title) throw new Error("createEventType: title is required");
  if (!scheduleId) throw new Error("createEventType: scheduleId is required");

  const payload = {
    title,
    slug,
    lengthInMinutes,
    description,
    scheduleId,
    locations,
    seats,
    bookingWindow,
    ...rest,
  };

  return calPost("/event-types", payload);
}

/**
 * Update an existing event type.
 */
export async function updateEventType(eventTypeId, input) {
  if (!eventTypeId) throw new Error("updateEventType: eventTypeId is required");

  const {
    title,
    slug,
    lengthInMinutes,
    description,
    scheduleId,
    locations,
    seats,
    bookingWindow,
    ...rest
  } = input || {};

  const payload = {};

  if (title !== undefined) payload.title = title;
  if (slug !== undefined) payload.slug = slug;
  if (lengthInMinutes !== undefined) payload.lengthInMinutes = lengthInMinutes;
  if (description !== undefined) payload.description = description;
  if (scheduleId !== undefined) payload.scheduleId = scheduleId;
  if (locations !== undefined) payload.locations = locations;
  if (seats !== undefined) payload.seats = seats;
  if (bookingWindow !== undefined) payload.bookingWindow = bookingWindow;

  Object.assign(payload, rest);

  return calPatch(`/event-types/${eventTypeId}`, payload);
}

/* ============================================
   BOOKINGS
============================================ */


export async function createBooking({
  eventTypeId,
  startTime,
  endTime,
  name,
  email,
  timeZone = "America/New_York",
  metadata = {},
}) {
  if (!eventTypeId) throw new Error("createBooking: eventTypeId is required");
  if (!startTime) throw new Error("createBooking: startTime is required");
  if (!email) throw new Error("createBooking: attendee email is required");

  const payload = {
    eventTypeId,
    start: startTime,
    end: endTime || null,
    timeZone,
    attendees: [
      {
        name: name || null,
        email,
      },
    ],
    metadata,
  };

  return calPost("/bookings", payload);
}

/* ============================================
   DEBUG / FETCH HELPERS
============================================ */

export async function getSchedule(scheduleId) {
  if (!scheduleId) throw new Error("getSchedule: scheduleId is required");
  return calGet(`/schedules/${scheduleId}`);
}

export async function getEventType(eventTypeId) {
  if (!eventTypeId) throw new Error("getEventType: eventTypeId is required");
  return calGet(`/event-types/${eventTypeId}`);
}
