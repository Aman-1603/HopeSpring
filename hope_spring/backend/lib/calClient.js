// backend/lib/calClient.js
import axios from "axios";

const CAL_BASE = "https://api.cal.com/v2";

function requireEnv(name) {
  if (!process.env[name]) throw new Error(`Missing env var: ${name}`);
  return process.env[name];
}

export const cal = axios.create({
  baseURL: CAL_BASE,
  headers: {
    Authorization: `Bearer ${requireEnv("CAL_API_KEY")}`,
    "Content-Type": "application/json",
    "cal-api-version": "2024-06-14",
  },
  timeout: 15000,
});

function unwrap(res) {
  return res?.data?.data || res?.data || null;
}

/**
 * Create a Cal Schedule with date overrides only.
 * NOTE: Cal schedule payload shape may evolve; this matches current docs:
 * - schedules support availability + date overrides. :contentReference[oaicite:1]{index=1}
 */
export async function createSchedule({
  name,
  timeZone = "America/New_York",
  availability = [],  // weekly rules (empty means no default availability)
  overrides = [],     // per-date availability blocks
}) {
  if (!name) throw new Error("createSchedule requires name");

  const payload = {
    name,
    timeZone,
    availability,
    overrides,
  };

  try {
    const res = await cal.post("/schedules", payload);
    return unwrap(res);
  } catch (err) {
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      JSON.stringify(err?.response?.data || {});
    throw new Error(`Cal createSchedule failed: ${apiMsg}`);
  }
}

/**
 * Create a Cal Event Type for a program
 */
export async function createEventType({
  title,
  slug,
  description = "",
  lengthInMinutes = 60,
  host,          // Cal username
  metadata = {},
  scheduleId,    // link to schedule so slots appear only on overrides
}) {
  if (!title || !slug) {
    throw new Error("createEventType requires title and slug");
  }

  const payload = {
    title,
    slug,
    description,
    lengthInMinutes,
    metadata,
  };

  if (host) payload.hosts = [{ username: host }];
  if (scheduleId) payload.scheduleId = scheduleId;

  try {
    const res = await cal.post("/event-types", payload);
    return unwrap(res);
  } catch (err) {
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      JSON.stringify(err?.response?.data || {});

    if (
      err?.response?.status === 409 ||
      /slug/i.test(apiMsg) ||
      /already exists/i.test(apiMsg)
    ) {
      throw new Error(
        `Cal slug conflict for "${slug}". Change slug or delete existing event type. Details: ${apiMsg}`
      );
    }

    throw new Error(`Cal createEventType failed: ${apiMsg}`);
  }
}
