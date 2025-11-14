import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Plus, X, CalendarDays, Clock } from "lucide-react";
import AdminLayout from "./NavSection/AdminLayout";

// === date-fns localizer setup ===
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

// ---- Some nice demo events so it doesn't look empty ----
const initialEvents = [
  {
    id: 1,
    title: "Yoga for Wellness",
    description: "Gentle yoga session focused on relaxation and breathing.",
    start: new Date(2025, 10, 17, 10, 0), // Nov 17 2025, 10:00
    end: new Date(2025, 10, 17, 11, 0),
  },
  {
    id: 2,
    title: "Meditation & Mindfulness",
    description: "Guided meditation for stress relief and mindfulness.",
    start: new Date(2025, 10, 19, 18, 0),
    end: new Date(2025, 10, 19, 19, 0),
  },
  {
    id: 3,
    title: "Caregiver Support Circle",
    description: "Sharing circle for caregivers to connect and support each other.",
    start: new Date(2025, 10, 21, 15, 0),
    end: new Date(2025, 10, 21, 16, 30),
  },
];

// Helper to decide event status (for colors)
const getStatus = (event) => {
  const now = new Date();
  if (now < event.start) return "upcoming";
  if (now > event.end) return "completed";
  return "ongoing";
};

// ---- Custom toolbar to match HopeSpring style ----
const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");

  const setView = (view) => toolbar.onView(view);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {toolbar.label}
        </h2>
        <p className="text-xs text-gray-500">
          Tap a day to view events, or click “Add Event” to schedule a new one.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-2xl bg-[#f4f2ff] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1 text-xs sm:text-sm text-gray-700 hover:bg-[#e6e2ff]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goToBack}
            className="px-3 py-1 text-xs sm:text-sm text-gray-700 hover:bg-[#e6e2ff]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="px-3 py-1 text-xs sm:text-sm text-gray-700 hover:bg-[#e6e2ff]"
          >
            Next
          </button>
        </div>

        <div className="flex rounded-2xl bg-[#f4f2ff] overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setView("month")}
            className={`px-3 py-1 text-xs sm:text-sm ${
              toolbar.view === "month"
                ? "bg-white text-[#7b5cff]"
                : "text-gray-700 hover:bg-[#e6e2ff]"
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setView("week")}
            className={`px-3 py-1 text-xs sm:text-sm ${
              toolbar.view === "week"
                ? "bg-white text-[#7b5cff]"
                : "text-gray-700 hover:bg-[#e6e2ff]"
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setView("day")}
            className={`px-3 py-1 text-xs sm:text-sm ${
              toolbar.view === "day"
                ? "bg-white text-[#7b5cff]"
                : "text-gray-700 hover:bg-[#e6e2ff]"
            }`}
          >
            Day
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminEventCalendar = () => {
  const [events, setEvents] = useState(initialEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null); // event or null

  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });

  // Tailwind styling for events
  const eventStyleGetter = (event) => {
    const status = getStatus(event);
    let backgroundColor = "#A88FF0"; // upcoming default
    if (status === "ongoing") backgroundColor = "#FACC15"; // yellow
    if (status === "completed") backgroundColor = "#4ADE80"; // green

    return {
      style: {
        backgroundColor,
        borderRadius: "9999px",
        border: "none",
        paddingInline: "8px",
        paddingBlock: "2px",
        color: "#1f2933",
        fontSize: "0.75rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      },
    };
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      title: formData.title,
      description: formData.description,
      start: new Date(formData.start),
      end: new Date(formData.end),
    };
    setEvents([...events, newEvent]);
    setFormData({ title: "", start: "", end: "", description: "" });
    setShowAddModal(false);
  };

  const handleSelectEvent = (event) => {
    setShowDetailModal(event);
  };

  const closeDetailModal = () => setShowDetailModal(null);

  return (
    <AdminLayout>
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8f4ff] to-[#eef5ff] px-6 py-8">
      {/* Page title row with Add Event */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Event Calendar
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all upcoming, ongoing and completed events in one place.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white px-4 sm:px-5 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Event</span>
        </button>
      </div>

      {/* Calendar container */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#ece7ff] px-4 sm:px-6 py-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          components={{ toolbar: CustomToolbar }}
          eventPropGetter={eventStyleGetter}
          popup
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Add New Event
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Create a new community or wellness event for HopeSpring members.
            </p>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a855f7] outline-none"
                  placeholder="e.g., Yoga for Wellness"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                    className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a855f7] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                    className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a855f7] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a855f7] outline-none"
                  placeholder="Short note about what this event offers..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-7 relative">
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#f4f2ff] rounded-full p-2">
                <CalendarDays className="w-5 h-5 text-[#7b5cff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {showDetailModal.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {getStatus(showDetailModal) === "upcoming" && "Upcoming event"}
                  {getStatus(showDetailModal) === "ongoing" && "Happening now"}
                  {getStatus(showDetailModal) === "completed" &&
                    "Completed event"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-700 mb-3">
              <Clock className="w-4 h-4 mt-[3px] text-gray-500" />
              <div>
                <div>
                  {format(showDetailModal.start, "PPpp")} –{" "}
                  {format(showDetailModal.end, "PPpp")}
                </div>
              </div>
            </div>

            {showDetailModal.description && (
              <p className="text-sm text-gray-600 mb-4">
                {showDetailModal.description}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Close
              </button>
              {/* These buttons are UI only for now – backend can be wired later */}
              <button className="px-4 py-2 rounded-xl bg-[#fee2e2] text-[#b91c1c] text-sm hover:bg-[#fecaca]">
                Delete
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
