import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  MapPin,
  Mail,
  Video,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

import AdminLayout from "../AdminLayout";

const API = process.env.REACT_APP_API_URL;

/* -----------------------------------------------------------
   GROUP ALL BOOKINGS BY USER (ONE USER = ONE ROW)
------------------------------------------------------------ */
const groupByUser = (rows) => {
  const map = new Map();

  rows.forEach((b) => {
    const email = b.attendee_email || "unknown";

    if (!map.has(email)) {
      map.set(email, {
        attendee_name: b.attendee_name,
        attendee_email: b.attendee_email,
        user_id: b.user_id,
        programs: [], // all bookings for that user
      });
    }

    map.get(email).programs.push({
      id: b.id,
      program_title: b.program_title,
      program_category: b.program_category,
      event_start: b.event_start,
      event_end: b.event_end,
      status: b.status,
      location: b.location,
      zoom_url: b.zoom_url,
      cal_booking_id: b.cal_booking_id,
    });
  });

  return Array.from(map.values());
};

/* -----------------------------------------------------------
   PICK A "MAIN" STATUS FOR TABLE VIEW (for quick glance)
------------------------------------------------------------ */
const deriveUserStatus = (programs = []) => {
  const statuses = programs.map((p) => p.status?.toLowerCase());

  if (statuses.some((s) => ["accepted", "confirmed", "booked"].includes(s))) {
    return "accepted";
  }
  if (statuses.some((s) => ["pending", "requested"].includes(s))) {
    return "pending";
  }
  if (statuses.some((s) => s === "rejected")) {
    return "rejected";
  }
  return "mixed";
};

export default function AdminFetchBookings() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(null); // index of expanded user
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "table"

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/all-bookings`);

      if (res.data.success) {
        const grouped = groupByUser(res.data.bookings);
        setUsers(grouped);
        setFiltered(grouped);
      }
    } catch (err) {
      console.error("❌ Error loading bookings:", err);
    }
  };

  /* ---------------- FILTER + SEARCH ---------------- */
  useEffect(() => {
    let data = [...users];

    // Filter by status: keep the user only if ANY booking matches
    if (filter !== "all") {
      data = data.filter((u) =>
        u.programs.some((p) => p.status?.toLowerCase() === filter)
      );
    }

    // Search (user or program)
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      data = data.filter(
        (u) =>
          u.attendee_name?.toLowerCase().includes(s) ||
          u.attendee_email?.toLowerCase().includes(s) ||
          u.programs.some((p) =>
            p.program_title?.toLowerCase().includes(s)
          )
      );
    }

    setFiltered(data);
    setOpen(null); // close any open row when filters change
  }, [filter, search, users]);

  const statusColor = (s) => {
    s = s?.toLowerCase();
    if (["accepted", "confirmed", "booked"].includes(s))
      return "bg-green-100 text-green-700";
    if (["pending", "requested"].includes(s))
      return "bg-yellow-100 text-yellow-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "mixed") return "bg-blue-100 text-blue-700";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* TITLE + VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            All Program Bookings (Grouped by User)
          </h1>

          {/* View toggle */}
          <div className="inline-flex rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                viewMode === "cards"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={16} />
              Card View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition border-l border-gray-200 ${
                viewMode === "table"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TableIcon size={16} />
              Table View
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Search box */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search user or program..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status buttons */}
          <div className="flex flex-wrap gap-3">
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition 
                ${
                  filter === f
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No bookings found.
          </div>
        )}

        {/* ===================== CARD VIEW (EXISTING) ===================== */}
        {viewMode === "cards" && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((u, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md"
              >
                {/* MAIN USER ROW */}
                <div
                  className="p-5 flex justify-between items-center cursor-pointer"
                  onClick={() => setOpen(open === idx ? null : idx)}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <User size={18} /> {u.attendee_name || "Unknown User"}
                    </h3>

                    <p className="text-gray-500 text-sm">{u.attendee_email}</p>

                    <p className="text-purple-600 font-medium text-sm mt-1">
                      {u.programs.length} program(s) booked
                    </p>
                  </div>

                  <div className="text-right">
                    {open === idx ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* EXPANDED PROGRAM LIST */}
                {open === idx && (
                  <div className="bg-gray-50 px-5 py-6 border-t space-y-4 animate-fadeIn">
                    {u.programs.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <h4 className="font-semibold text-gray-800">
                          {p.program_title}
                        </h4>

                        <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                          <Calendar size={16} />
                          {p.event_start
                            ? new Date(p.event_start).toLocaleString()
                            : "No time"}
                        </p>

                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                          <MapPin size={14} />
                          {p.location || "No location"}
                        </p>

                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>

                        {p.zoom_url && (
                          <a
                            href={p.zoom_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 underline text-sm mt-2"
                          >
                            <Video size={16} /> Join Zoom
                          </a>
                        )}

                        <p className="text-xs text-gray-400 mt-3">
                          Booking ID: {p.id} • CalUID:{" "}
                          {p.cal_booking_id || "none"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===================== TABLE VIEW (NEW) ===================== */}
        {viewMode === "table" && filtered.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-500 border-b">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Programs</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Latest Booking</th>
                    <th className="px-4 py-3 text-right">Expand</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, idx) => {
                    const allPrograms = u.programs || [];
                    const status = deriveUserStatus(allPrograms);

                    // Latest booking
                    const sorted = [...allPrograms].sort((a, b) => {
                      const da = a.event_start ? new Date(a.event_start) : 0;
                      const db = b.event_start ? new Date(b.event_start) : 0;
                      return db - da;
                    });
                    const latest = sorted[0];

                    return (
                      <React.Fragment key={idx}>
                        <tr className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-purple-500" />
                              {u.attendee_name || "Unknown User"}
                            </div>
                          </td>
                          <td className="px-4 py-3">{u.attendee_email}</td>
                          <td className="px-4 py-3">
                            {allPrograms.length} program(s)
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                status
                              )}`}
                            >
                              {status === "mixed"
                                ? "Mixed"
                                : status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {latest?.event_start
                              ? new Date(
                                  latest.event_start
                                ).toLocaleString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                setOpen(open === idx ? null : idx)
                              }
                              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800"
                            >
                              {open === idx ? (
                                <>
                                  Hide <ChevronUp size={16} />
                                </>
                              ) : (
                                <>
                                  Details <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded row with programs */}
                        {open === idx && (
                          <tr className="bg-gray-50 border-b">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                {allPrograms.map((p) => (
                                  <div
                                    key={p.id}
                                    className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                                  >
                                    <h4 className="font-semibold text-gray-800">
                                      {p.program_title}
                                    </h4>

                                    <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                      <Calendar size={16} />
                                      {p.event_start
                                        ? new Date(
                                            p.event_start
                                          ).toLocaleString()
                                        : "No time"}
                                    </p>

                                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                                      <MapPin size={14} />
                                      {p.location || "No location"}
                                    </p>

                                    <span
                                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                        p.status
                                      )}`}
                                    >
                                      {p.status}
                                    </span>

                                    {p.zoom_url && (
                                      <a
                                        href={p.zoom_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 underline text-sm mt-2"
                                      >
                                        <Video size={16} /> Join Zoom
                                      </a>
                                    )}

                                    <p className="text-xs text-gray-400 mt-3">
                                      Booking ID: {p.id} • CalUID:{" "}
                                      {p.cal_booking_id || "none"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
