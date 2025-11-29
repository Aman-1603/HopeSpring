// backend/lib/calClient.js
import axios from "axios";

const CAL_BASE = "https://api.cal.com/v2";
const CAL_VERSION = "2024-06-14";

/* ============================================
   Load API key lazily (dotenv loads before use)
============================================ */
function getApiKey() {
  const key = process.env.CAL_API_KEY;
  if (!key) throw new Error("Missing env var: CAL_API_KEY");
  return key.trim();
}

function makeCal() {
  const key = getApiKey();
  const authHeader = key.startsWith("Bearer ") ? key : `Bearer ${key}`;

  return axios.create({
    baseURL: CAL_BASE,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      "cal-api-version": CAL_VERSION,
    },
    timeout: 20000,
  });
}

/* ============================================
   RAW CLIENT PROXY (lazy)
============================================ */
export const cal = {
  get: (path, config) => makeCal().get(path, config),
  post: (path, data, config) => makeCal().post(path, data, config),
  patch: (path, data, config) => makeCal().patch(path, data, config),
  delete: (path, config) => makeCal().delete(path, config),
};

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

function toApiMsg(err) {
  const d = err?.response?.data;
  if (!d) return err.message || "Unknown Cal error";
  if (typeof d === "string") return d;
  if (d.message)
    return typeof d.message === "string"
      ? d.message
      : JSON.stringify(d.message);
  if (d.error?.message) return d.error.message;
  return JSON.stringify(d);
}

async function calGet(path) {
  try {
    return unwrap(await makeCal().get(path));
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal GET failed:", path, msg);
    throw new Error(msg);
  }
}

async function calPost(path, payload) {
  try {
    return unwrap(await makeCal().post(path, payload));
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal POST failed:", path, msg, payload);
    throw new Error(msg);
  }
}

async function calPatch(path, payload) {
  try {
    return unwrap(await makeCal().patch(path, payload));
  } catch (err) {
    const msg = toApiMsg(err);
    console.error("❌ Cal PATCH failed:", path, msg, payload);
    throw new Error(msg);
  }
}

/* ============================================
   SCHEDULES
============================================ */
export async function createSchedule({
  name,
  timeZone = "America/New_York",
  availability = [],
  overrides = [],
  isDefault = false,
}) {
  const payload = { name, timeZone, availability, overrides, isDefault };
  return calPost("/schedules", payload);
}

export async function updateSchedule(scheduleId, patch = {}) {
  if (!scheduleId) throw new Error("updateSchedule: scheduleId required");

  const payload = {};

  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.timeZone !== undefined) payload.timeZone = patch.timeZone;

  if (patch.availability !== undefined && Array.isArray(patch.availability)) {
    payload.availability = patch.availability;
  }

  if (patch.overrides !== undefined && Array.isArray(patch.overrides)) {
    payload.overrides = patch.overrides;
  }

  if (patch.isDefault !== undefined && typeof patch.isDefault === "boolean") {
    payload.isDefault = patch.isDefault;
  }

  return calPatch(`/schedules/${scheduleId}`, payload);
}

/* ============================================
   EVENT TYPES
============================================ */
/**
 * We forward *any* extra fields (like seatsPerTimeSlot,
 * seatsShowAttendees, seatsShowAvailabilityCount, etc.)
 * straight through to Cal.
 */
export async function createEventType(input) {
  const {
    title,
    slug,
    description = "",
    lengthInMinutes = 60,
    host,
    metadata = {},
    scheduleId,
    bookingWindow,
    ...rest // <- seatsPerTimeSlot, seatsShowAttendees, etc.
  } = input;

  const payload = {
    title,
    slug,
    description,
    lengthInMinutes,
    metadata,
    ...rest,
  };

  if (host !== undefined) payload.host = host;
  if (scheduleId !== undefined) payload.scheduleId = scheduleId;
  if (bookingWindow !== undefined) payload.bookingWindow = bookingWindow;

  return calPost("/event-types", payload);
}

export async function updateEventType(eventTypeId, patch = {}) {
  if (!eventTypeId) throw new Error("updateEventType: eventTypeId required");

  const {
    title,
    slug,
    description,
    lengthInMinutes,
    host,
    scheduleId,
    metadata,
    bookingWindow,
    ...rest // again: seatsPerTimeSlot, seatsShowAttendees, etc.
  } = patch;

  const payload = { ...rest };

  if (title !== undefined) payload.title = title;
  if (slug !== undefined) payload.slug = slug;
  if (description !== undefined) payload.description = description;
  if (lengthInMinutes !== undefined)
    payload.lengthInMinutes = lengthInMinutes;
  if (host !== undefined) payload.host = host;
  if (scheduleId !== undefined) payload.scheduleId = scheduleId;
  if (metadata !== undefined) payload.metadata = metadata;
  if (bookingWindow !== undefined) payload.bookingWindow = bookingWindow;

  return calPatch(`/event-types/${eventTypeId}`, payload);
}

/* ============================================
   DEBUG HELPERS
============================================ */
export async function getSchedule(scheduleId) {
  return calGet(`/schedules/${scheduleId}`);
}

export async function getEventType(eventTypeId) {
  return calGet(`/event-types/${eventTypeId}`);
}
