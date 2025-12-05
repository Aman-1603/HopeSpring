// backend/lib/calClient.js
import axios from "axios";

const CAL_BASE = "https://api.cal.com/v2";

// Default version for most endpoints.
// Schedules + event types are fine with 2024-06-11.
// Booking confirm/decline will override to 2024-08-13.
const DEFAULT_CAL_VERSION = "2024-06-11";

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
    "cal-api-version": DEFAULT_CAL_VERSION,
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
  if (err?.response?.data) {
    try {
      console.error(
        "💥 [Cal RAW ERROR DATA] ",
        JSON.stringify(err.response.data, null, 2)
      );
    } catch {
      console.error("💥 [Cal RAW ERROR DATA] (non-JSON)", err.response.data);
    }
  }

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
    const body =
      payload === null || payload === undefined ? undefined : payload;

    const res = await cal.post(path, body, config);
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

/**
 * Create a schedule for the authenticated user.
 * Docs expect 2024-06-11 for /v2/schedules.
 */
export async function createSchedule(input) {
  const {
    name,
    timeZone = "America/New_York",
    availability,
    overrides,
    isDefault = false,
    ...rest
  } = input || {};

  if (!name) throw new Error("createSchedule: name is required");

  const payload = {
    name,
    timeZone,
    isDefault,
  };

  if (availability !== undefined) payload.availability = availability;
  if (overrides !== undefined) payload.overrides = overrides;

  Object.assign(payload, rest);

  return calPost("/schedules", payload, {
    headers: {
      "cal-api-version": "2024-06-11",
    },
  });
}

/**
 * Update a schedule in Cal.
 */
export async function updateSchedule(scheduleId, input) {
  if (!scheduleId) throw new Error("updateSchedule: scheduleId is required");
  const payload = { ...(input || {}) };
  return calPatch(`/schedules/${scheduleId}`, payload, {
    headers: {
      "cal-api-version": "2024-06-11",
    },
  });
}

/* ============================================
   EVENT TYPES
============================================ */

/**
 * Create an event type in Cal (v2).
 * Handles:
 *  - length / lengthInMinutes mapping
 *  - seats object (with showAttendeeInfo)
 *  - legacy seat fields
 *  - default locations
 *  - bookingFields + requiresConfirmation
 */
export async function createEventType(input) {
  if (!input) throw new Error("createEventType: input is required");

  const {
    title,
    slug,
    // some code might pass length directly, some uses lengthInMinutes
    length, // optional direct field
    lengthInMinutes = 60,
    description,
    scheduleId,
    locations,
    bookingWindow,
    metadata,

    // booking / form behaviour
    bookingFields,
    requiresConfirmation,

    // preferred v2 seats shape
    seats,

    // legacy fields your routes might still send
    seatsPerTimeSlot,
    seatsShowAttendees,
    seatsShowAvailabilityCount,

    ...rest
  } = input;

  if (!title) throw new Error("createEventType: title is required");
  if (!scheduleId) throw new Error("createEventType: scheduleId is required");

  // ---- length mapping ----
  // Cal expects "length". We accept length or lengthInMinutes and map to length.
  const finalLength =
    length !== undefined && length !== null ? Number(length) : Number(lengthInMinutes);
  if (!finalLength || Number.isNaN(finalLength) || finalLength < 1) {
    throw new Error(
      `createEventType: invalid length/lengthInMinutes (${length}, ${lengthInMinutes})`
    );
  }

  // ---- Seats ----
  let seatsPayload = seats || undefined;

  const hasLegacySeatsFields =
    seatsPerTimeSlot !== undefined ||
    seatsShowAttendees !== undefined ||
    seatsShowAvailabilityCount !== undefined;

  if (!seatsPayload && hasLegacySeatsFields) {
    seatsPayload = {};
    if (seatsPerTimeSlot !== undefined) {
      seatsPayload.seatsPerTimeSlot = seatsPerTimeSlot;
    }
    if (seatsShowAttendees !== undefined) {
      seatsPayload.showAttendees = seatsShowAttendees;
    }
    if (seatsShowAvailabilityCount !== undefined) {
      seatsPayload.showAvailabilityCount = seatsShowAvailabilityCount;
    }
  }

  // Cal wants showAttendeeInfo present when seats are enabled.
  if (seatsPayload && seatsPayload.showAttendeeInfo === undefined) {
    seatsPayload.showAttendeeInfo = false;
  }

  // ---- Locations ----
  const finalLocations =
    locations && Array.isArray(locations) && locations.length > 0
      ? locations
      : [
          {
            type: "integration",
            integration: "cal-video",
          },
        ];

  // ---- Booking fields / confirmation ----
  const finalBookingFields = Array.isArray(bookingFields)
    ? bookingFields
    : [];
  const finalRequiresConfirmation =
    requiresConfirmation !== undefined ? !!requiresConfirmation : false;

  const payload = {
    title,
    slug,
    length: finalLength, // 👈 THIS is what Cal validates
    description,
    scheduleId,
    locations: finalLocations,
    bookingWindow,
    metadata: metadata || {},
    bookingFields: finalBookingFields,
    requiresConfirmation: finalRequiresConfirmation,
    ...(seatsPayload ? { seats: seatsPayload } : {}),
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
    length, // Cal's field
    lengthInMinutes, // if someone still passes this for updates
    description,
    scheduleId,
    locations,
    bookingWindow,
    metadata,
    seats,
    bookingFields,
    requiresConfirmation,
    ...rest
  } = input || {};

  const payload = {};

  if (title !== undefined) payload.title = title;
  if (slug !== undefined) payload.slug = slug;

  if (length !== undefined || lengthInMinutes !== undefined) {
    const finalLength =
      length !== undefined && length !== null
        ? Number(length)
        : Number(lengthInMinutes);
    if (!Number.isNaN(finalLength) && finalLength >= 1) {
      payload.length = finalLength;
    }
  }

  if (description !== undefined) payload.description = description;
  if (scheduleId !== undefined) payload.scheduleId = scheduleId;
  if (locations !== undefined) payload.locations = locations;
  if (bookingWindow !== undefined) payload.bookingWindow = bookingWindow;
  if (metadata !== undefined) payload.metadata = metadata;
  if (seats !== undefined) payload.seats = seats;
  if (bookingFields !== undefined) payload.bookingFields = bookingFields;
  if (requiresConfirmation !== undefined) {
    payload.requiresConfirmation = !!requiresConfirmation;
  }

  Object.assign(payload, rest);

  return calPatch(`/event-types/${eventTypeId}`, payload);
}

/* ============================================
   BOOKINGS (normal create)
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
   BOOKINGS — ADMIN ACTIONS (v2)
   Need 2024-08-13
============================================ */

export async function confirmBooking(bookingUid) {
  if (!bookingUid) throw new Error("confirmBooking: bookingUid is required");

  return calPost(`/bookings/${bookingUid}/confirm`, undefined, {
    headers: {
      "cal-api-version": "2024-08-13",
    },
  });
}

export async function declineBooking(bookingUid, reason = null) {
  if (!bookingUid) throw new Error("declineBooking: bookingUid is required");

  const payload = {};
  if (reason) payload.reason = reason;
  const body = Object.keys(payload).length ? payload : undefined;

  return calPost(`/bookings/${bookingUid}/decline`, body, {
    headers: {
      "cal-api-version": "2024-08-13",
    },
  });
}

/* ============================================
   DEBUG / FETCH HELPERS
============================================ */

export async function getSchedule(scheduleId) {
  if (!scheduleId) throw new Error("getSchedule: scheduleId is required");
  return calGet(`/schedules/${scheduleId}`, {
    headers: {
      "cal-api-version": "2024-06-11",
    },
  });
}

export async function getEventType(eventTypeId) {
  if (!eventTypeId) throw new Error("getEventType: eventTypeId is required");
  return calGet(`/event-types/${eventTypeId}`);
}
