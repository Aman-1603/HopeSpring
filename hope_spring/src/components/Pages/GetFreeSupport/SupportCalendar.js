// src/components/Pages/GetFreeSupport/SupportCalendar.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  getDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarDays, Clock, X } from "lucide-react";

// ---------- date-fns localizer ----------
const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Backend endpoint that returns Cal-backed slots
const API_BASE = "/api/programs/calendar";

// ---------- colours ----------
const CATEGORY_COLORS = {
  support_group: "#60a5fa", // blue
  "gentle exercise": "#22c55e", // green
  meditation: "#f472b6", // pink
  yoga: "#a78bfa", // purple
  art: "#fbbf24", // yellow
};

const DEFAULT_COLOR = "#94a3b8";

// ---------- status ----------
const getStatus = (event) => {
  const now = new Date();
  if (now < event.start) return "upcoming";
  if (now > event.end) return "completed";
  return "ongoing";
};

// ---------- toolbar ----------
const SupportToolbar = (toolbar) => {
  const label = toolbar.label;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{label}</h2>
        <p className="text-xs text-slate-500">
          Choose a day to see what programs are available and click a session to
          view details.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => toolbar.onNavigate("TODAY")}
          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => toolbar.onNavigate("PREV")}
          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => toolbar.onNavigate("NEXT")}
          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
        >
          Next
        </button>

        <div className="flex rounded-full bg-slate-50 border border-slate-200 overflow-hidden ml-1">
          {["month", "week", "day"].map((viewKey) => {
            const active = toolbar.view === viewKey;
            return (
              <button
                key={viewKey}
                type="button"
                onClick={() => toolbar.onView(viewKey)}
                className={`px-3 py-1.5 text-xs sm:text-sm transition ${
                  active
                    ? "bg-white text-indigo-600 shadow-inner"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {viewKey.charAt(0).toUpperCase() + viewKey.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- small event pill ----------
const SupportEvent = ({ event }) => {
  const categoryKey = (event.category || "").toLowerCase();
  const color =
    CATEGORY_COLORS[categoryKey] ||
    CATEGORY_COLORS[categoryKey.replace(/\s+/g, " ")] ||
    DEFAULT_COLOR;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-900 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}60)`,
        border: `1px solid ${color}`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{event.title}</span>
    </div>
  );
};

// ---------- helper to normalise labels ----------
function normalizeTag(str) {
  return (str || "").toLowerCase().replace(/[\s_-]+/g, "");
}

// ---------- route helper (more robust) ----------
function getProgramRoute(slot) {
  const rawCat = slot.category || "";
  const rawSub = slot.subcategory || "";
  const rawName = slot.programName || slot.title || "";

  const catNorm = normalizeTag(rawCat);
  const subNorm = normalizeTag(rawSub);
  const nameNorm = normalizeTag(rawName);

  // ---- Support groups ----
  if (
    catNorm.includes("supportgroup") ||
    nameNorm.includes("supportgroup") ||
    nameNorm.includes("supportgroups")
  ) {
    return "/support/programs/support-groups";
  }

  // ---- Gentle exercise & subtypes (meditation, yoga, tai chi, qi gong) ----
  const isGentleExercise = catNorm.includes("gentleexercise");

  // Meditation
  if (subNorm.includes("meditation") || nameNorm.includes("meditation")) {
    return "/support/programs/gentle-exercise/meditation";
  }

  // Yoga
  if (subNorm.includes("yoga") || nameNorm.includes("yoga")) {
    return "/support/programs/gentle-exercise/yoga";
  }

  // Tai Chi
  if (subNorm.includes("taichi") || nameNorm.includes("taichi")) {
    return "/support/programs/gentle-exercise/tai-chi";
  }

  // Qi Gong
  if (subNorm.includes("qigong") || nameNorm.includes("qigong")) {
    return "/support/programs/gentle-exercise/qi-gong";
  }

  // If it's clearly gentle exercise but we can't tell which → send to meditation as default
  if (isGentleExercise) {
    return "/support/programs/gentle-exercise/meditation";
  }

  // ---- Cancer care counselling ----
  if (
    nameNorm.includes("cancercarecounselling") ||
    subNorm.includes("counselling") ||
    subNorm.includes("counseling") ||
    nameNorm.includes("counselling") ||
    nameNorm.includes("counseling")
  ) {
    return "/book/cancer-care-counselling";
  }

  // ---- Art / creativity ----
  const isArtCat =
    catNorm.includes("art") || catNorm.includes("artscreativity");

  if (
    nameNorm.includes("joyfulartpractice") ||
    subNorm.includes("joyfulartpractice")
  ) {
    return "/support/programs/arts-creativity/joyful-art-practice";
  }

  if (
    nameNorm.includes("joyfulartskill") ||
    nameNorm.includes("joyfularttechnique") ||
    subNorm.includes("joyfulartskills") ||
    subNorm.includes("joyfularttechniques")
  ) {
    return "/support/programs/arts-creativity/joyful-art-skills";
  }

  if (isArtCat) {
    return "/support/programs/arts-creativity/joyful-art-practice";
  }

  // ---- Relaxation (massage, reiki, therapeutic touch) ----
  const isRelax = catNorm.includes("relaxation");

  if (nameNorm.includes("massage")) {
    return "/support/programs/relaxation/massage-therapy";
  }
  if (nameNorm.includes("reiki")) {
    return "/support/programs/relaxation/reiki";
  }
  if (nameNorm.includes("therapeutictouch") || nameNorm.includes("ttouch")) {
    return "/support/programs/relaxation/therapeutic-touch";
  }

  if (isRelax) {
    return "/support/programs/relaxation/massage-therapy";
  }

  // ---- Fallback – general programs landing ----
  return "/support/programs";
}

const SupportCalendar = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEventsForRange = useCallback(async (range) => {
    if (!range) return;

    let startDate;
    let endDate;

    if (Array.isArray(range) && range.length > 0) {
      startDate = range[0];
      endDate = range[range.length - 1];
    } else if (range.start && range.end) {
      startDate = range.start;
      endDate = range.end;
    } else {
      return;
    }

    const pad = (n) => String(n).padStart(2, "0");
    const toYMD = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const from = toYMD(startDate);
    const to = toYMD(endDate);

    try {
      setLoading(true);
      const res = await axios.get(API_BASE, { params: { from, to } });

      if (!res.data?.success) {
        setEvents([]);
        return;
      }

      const slots = res.data.slots || [];

      const mapped = slots.map((s) => {
        const start = new Date(s.start);
        const end = new Date(s.end);

        const capacity =
          typeof s.capacity === "number" ? s.capacity : null;
        const participants =
          typeof s.participants === "number" ? s.participants : null;

        const isFull =
          typeof s.isFull === "boolean"
            ? s.isFull
            : capacity != null && participants != null
            ? participants >= capacity
            : false;

        return {
          id: `${s.programId}-${s.start}`,
          program_id: s.programId,
          programName: s.programName,
          title: s.programName,
          category: s.category || "",
          subcategory: s.subcategory || "",
          location: s.location || "",
          instructor: s.instructor || "",
          description: s.description || "",
          start,
          end,
          capacity,
          participants,
          isFull,
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error("❌ Error loading support calendar:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch whenever view/date changes
  useEffect(() => {
    let startDate;
    let endDate;

    if (view === "month") {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      startDate = startOfWeek(monthStart);
      endDate = endOfWeek(monthEnd);
    } else if (view === "week") {
      startDate = startOfWeek(date);
      endDate = endOfWeek(date);
    } else {
      startDate = startOfDay(date);
      endDate = endOfDay(date);
    }

    fetchEventsForRange({ start: startDate, end: endDate });
  }, [view, date, fetchEventsForRange]);

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "transparent",
      border: "none",
      color: "#0f172a",
      boxShadow: "none",
      padding: 0,
    },
  });

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const redirectToProgramPage = () => {
    if (!selectedEvent) return;
    const path = getProgramRoute(selectedEvent);
    const startISO = selectedEvent.start.toISOString();
    navigate(`${path}?fromCalendar=1&start=${encodeURIComponent(startISO)}`);
  };

  const legendItems = [
    { label: "Support Groups", color: CATEGORY_COLORS["support_group"] },
    { label: "Gentle Exercise", color: CATEGORY_COLORS["gentle exercise"] },
    { label: "Meditation", color: CATEGORY_COLORS["meditation"] },
    { label: "Yoga", color: CATEGORY_COLORS["yoga"] },
    { label: "Art / Creativity", color: CATEGORY_COLORS["art"] },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f8f4ff] via-[#f3f9ff] to-[#eef5ff] px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            View Calendar &amp; Register
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse upcoming HopeSpring programs and click a session to view
            details and registration options.
          </p>
        </div>

        {/* legend */}
        <div className="mb-4 flex flex-wrap justify-center gap-3 text-xs">
          {legendItems.map(
            (item) =>
              item.color && (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.label}</span>
                </div>
              )
          )}
        </div>

        {/* calendar */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#e2e8f0] px-4 sm:px-6 py-4">
          {loading && (
            <div className="text-xs text-slate-400 mb-2">
              Loading sessions for this view…
            </div>
          )}

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 620 }}
            views={["month", "week", "day"]}
            view={view}
            onView={(v) => setView(v)}
            date={date}
            onNavigate={(d) => setDate(d)}
            components={{
              toolbar: SupportToolbar,
              event: SupportEvent,
            }}
            eventPropGetter={eventStyleGetter}
            popup
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-7 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-5 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-50 rounded-full p-2">
                  <CalendarDays className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {getStatus(selectedEvent) === "upcoming" &&
                      "Upcoming session"}
                    {getStatus(selectedEvent) === "ongoing" &&
                      "Happening now"}
                    {getStatus(selectedEvent) === "completed" &&
                      "Completed session"}
                  </p>
                  {selectedEvent.capacity != null && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Seats: {selectedEvent.participants ?? 0}/
                      {selectedEvent.capacity}{" "}
                      {selectedEvent.isFull && (
                        <span className="font-semibold text-red-500 ml-1">
                          (Full)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-700 mb-3">
                <Clock className="w-4 h-4 mt-[3px] text-slate-400" />
                <div>
                  <div>{format(selectedEvent.start, "PPPP")}</div>
                  <div>
                    {format(selectedEvent.start, "p")} –{" "}
                    {format(selectedEvent.end, "p")}
                  </div>
                </div>
              </div>

              {selectedEvent.isFull && (
                <p className="text-xs sm:text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                  This session is currently full. You can still{" "}
                  <span className="font-semibold">join the waitlist</span>. On
                  the next page, you’ll see full details and how to add your
                  name.
                </p>
              )}

              {selectedEvent.location && (
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-medium">Location:</span>{" "}
                  {selectedEvent.location}
                </p>
              )}

              {selectedEvent.instructor && (
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-medium">Facilitator:</span>{" "}
                  {selectedEvent.instructor}
                </p>
              )}

              {selectedEvent.description && (
                <p className="text-sm text-slate-600 mb-4">
                  {selectedEvent.description}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm text-slate-700"
                >
                  Close
                </button>

                <button
                  onClick={redirectToProgramPage}
                  className={`px-4 py-2 rounded-xl text-sm text-white ${
                    selectedEvent.isFull
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {selectedEvent.isFull ? "Join Waitlist" : "Register"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportCalendar;
