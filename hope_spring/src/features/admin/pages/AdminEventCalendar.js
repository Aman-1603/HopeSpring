// src/AdminSection/EventCalendar/AdminEventCalendar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Plus,
  X,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminLayout from "../AdminLayout";

// ---------- date-fns localizer ----------
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// API route (programs + occurrences)
const API_BASE = "/api/calendar-events";

// ---------- category → color map (HopeSpring style) ----------
const CATEGORY_COLORS = {
  support_group: "#60a5fa", // soft blue
  "gentle exercise": "#22c55e", // green
  meditation: "#f472b6", // pink
  yoga: "#a78bfa", // purple
  art: "#fbbf24", // yellow
};

// fallback color
const DEFAULT_COLOR = "#94a3b8"; // slate gray

// ---------- status helper ----------
const getStatus = (event) => {
  const now = new Date();
  if (now < event.start) return "upcoming";
  if (now > event.end) return "completed";
  return "ongoing";
};

// ---------- HopeSpring toolbar ----------
const CustomToolbar = (toolbar) => {
  const label = toolbar.label;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{label}</h2>
        <p className="text-xs text-slate-500">
          Navigate through months and weeks to see all program sessions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* nav buttons */}
        <div className="flex items-center rounded-full bg-slate-50 border border-slate-200 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toolbar.onNavigate("TODAY")}
            className="px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => toolbar.onNavigate("PREV")}
            className="px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 border-l border-slate-200 flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="button"
            onClick={() => toolbar.onNavigate("NEXT")}
            className="px-2.5 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 border-l border-slate-200 flex items-center gap-1 transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* view buttons */}
        <div className="flex rounded-full bg-slate-50 border border-slate-200 shadow-sm overflow-hidden">
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

// ---------- custom event component with hover tooltip ----------
const CustomEvent = ({ event }) => {
  const [hover, setHover] = useState(false);

  const categoryKey = (event.category || "").toLowerCase();
  const color =
    CATEGORY_COLORS[categoryKey] ||
    CATEGORY_COLORS[categoryKey.replace(/\s+/g, " ")] ||
    DEFAULT_COLOR;

  const status = getStatus(event);
  const statusLabel =
    status === "upcoming"
      ? "Upcoming"
      : status === "ongoing"
      ? "Happening now"
      : "Completed";

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* pill event display */}
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

      {/* hover tooltip */}
      {hover && (
        <div className="absolute z-50 left-0 mt-1 w-64 rounded-xl bg-white shadow-xl border border-slate-200 p-3 text-xs text-slate-700 animate-fade-in pointer-events-none">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                {event.title}
              </p>
              {event.category && (
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  {event.category}
                </p>
              )}
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                backgroundColor: `${color}20`,
                color: "#0f172a",
              }}
            >
              {statusLabel}
            </span>
          </div>

          <div className="flex items-start gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 mt-[2px]" />
            <div>
              <div>{format(event.start, "PP")}</div>
              <div>
                {format(event.start, "p")} – {format(event.end, "p")}
              </div>
            </div>
          </div>

          {event.location && (
            <p className="text-[11px] text-slate-500 mb-1">
              Location: {event.location}
            </p>
          )}

          {event.instructor && (
            <p className="text-[11px] text-slate-500 mb-1">
              Facilitator: {event.instructor}
            </p>
          )}

          {event.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const AdminEventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(null);

  // ---------- load data from backend ----------
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await axios.get(API_BASE);

        const mapped = res.data.map((e) => ({
          id: e.occurrence_id,
          program_id: e.program_id,
          title: e.title,
          description: e.description,
          category: e.category,
          instructor: e.instructor,
          location: e.location,
          start: new Date(e.starts_at),
          end: new Date(e.ends_at || e.starts_at),
        }));

        setEvents(mapped);
      } catch (err) {
        console.error("❌ Error loading calendar events:", err);
      }
    };

    loadEvents();
  }, []);

  // ---------- color styling ----------
  const eventStyleGetter = (event) => {
    const categoryKey = (event.category || "").toLowerCase();
    const color =
      CATEGORY_COLORS[categoryKey] ||
      CATEGORY_COLORS[categoryKey.replace(/\s+/g, " ")] ||
      DEFAULT_COLOR;

    return {
      style: {
        backgroundColor: "transparent", // we style inside CustomEvent
        border: "none",
        color: "#0f172a",
        boxShadow: "none",
        padding: 0,
      },
    };
  };

  // ---------- select event → open detail modal ----------
  const handleSelectEvent = (event) => {
    setShowDetailModal(event);
  };

  // ---------- delete one occurrence ----------
  const handleDelete = async (occId) => {
    if (!window.confirm("Delete this session from the calendar?")) return;

    try {
      await axios.delete(`/api/programs/occurrence/${occId}`);
      setEvents((prev) => prev.filter((e) => e.id !== occId));
      setShowDetailModal(null);
    } catch (err) {
      console.error("❌ Error deleting occurrence:", err);
      alert("Failed to delete session");
    }
  };

  // ---------- legend for categories ----------
  const legendItems = [
    { label: "Support Groups", color: CATEGORY_COLORS["support_group"] },
    { label: "Gentle Exercise", color: CATEGORY_COLORS["gentle exercise"] },
    { label: "Meditation", color: CATEGORY_COLORS["meditation"] },
    { label: "Yoga", color: CATEGORY_COLORS["yoga"] },
    { label: "Art / Creativity", color: CATEGORY_COLORS["art"] },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f8f4ff] via-[#f3f9ff] to-[#eef5ff] px-6 py-8">
        {/* header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Program Calendar
            </h1>
            <p className="text-sm text-slate-500">
              All scheduled program sessions (support groups, gentle exercise,
              art, and more) in one view.
            </p>
          </div>

          {/* little badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-indigo-100 shadow-sm">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-slate-600">
              Click an event for full details, or hover to preview.
            </span>
          </div>
        </div>

        {/* legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs">
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
          <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 620 }}

  views={["month", "week", "day"]}
  defaultView="month"
  onNavigate={() => {}}     // 🔥 REQUIRED
  onView={() => {}}         // 🔥 REQUIRED

  components={{
    toolbar: CustomToolbar,
    event: CustomEvent,
  }}
  eventPropGetter={eventStyleGetter}
  popup
  onSelectEvent={handleSelectEvent}
/>

        </div>

        {/* detail modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 relative">
              <button
                onClick={() => setShowDetailModal(null)}
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
                    {showDetailModal.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {getStatus(showDetailModal) === "upcoming" &&
                      "Upcoming session"}
                    {getStatus(showDetailModal) === "ongoing" &&
                      "Happening now"}
                    {getStatus(showDetailModal) === "completed" &&
                      "Completed session"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-700 mb-3">
                <Clock className="w-4 h-4 mt-[3px] text-slate-400" />
                <div>
                  <div>{format(showDetailModal.start, "PPPP")}</div>
                  <div>
                    {format(showDetailModal.start, "p")} –{" "}
                    {format(showDetailModal.end, "p")}
                  </div>
                </div>
              </div>

              {showDetailModal.location && (
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-medium">Location:</span>{" "}
                  {showDetailModal.location}
                </p>
              )}

              {showDetailModal.instructor && (
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-medium">Facilitator:</span>{" "}
                  {showDetailModal.instructor}
                </p>
              )}

              {showDetailModal.description && (
                <p className="text-sm text-slate-600 mb-4">
                  {showDetailModal.description}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
   usne               onClick={() => setShowDetailModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm text-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(showDetailModal.id)}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm hover:bg-red-100 border border-red-100"
                >
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEventCalendar;
