import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Users, Calendar, Mail, User2 } from "lucide-react";
import AdminLayout from "../AdminLayout";

const API = process.env.REACT_APP_API_URL;

const groupByProgram = (rows) => {
  const map = new Map();

  rows.forEach((row) => {
    const pid = row.program_id || "no-program";

    if (!map.has(pid)) {
      map.set(pid, {
        programId: pid,
        name: row.program_title || "Untitled Program",
        type: row.program_type || row.cal_event_type_id || "Program",
        facilitator: row.facilitator_name || "Not assigned",
        start: row.event_start,
        end: row.event_end,
        bookingsCount: 0,
        bookings: [],
      });
    }

    const group = map.get(pid);
    group.bookingsCount += 1;
    group.bookings.push({
      id: row.id,
      attendee_name: row.attendee_name,
      email: row.attendee_email,
      status: row.status,
      event_start: row.event_start,
      event_end: row.event_end,
      created_at: row.created_at,
    });
  });

  return Array.from(map.values());
};

export default function AdminBookingFetch() {
  const [programs, setPrograms] = useState([]);
  const [openProgram, setOpenProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("token"); // 👈 GET TOKEN

    const res = await axios.get(`${API}/api/admin/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 SEND TOKEN
      },
    });

    const rows = res.data.bookings || [];
    const grouped = groupByProgram(rows);
    setPrograms(grouped);

  } catch (err) {
    console.error("Booking fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <AdminLayout>
    <div className="p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        Program Bookings
      </h1>

      {programs.length === 0 && (
        <p className="text-gray-500">No bookings found yet.</p>
      )}

      <div className="space-y-6">
        {programs.map((program) => (
          <div
            key={program.programId}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Program Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenProgram(
                  openProgram === program.programId ? null : program.programId
                )
              }
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {program.name}
                </h2>

                {/* Program type + Facilitator */}
                <div className="flex items-center gap-6 mt-1 text-gray-500 text-sm">
                  <span>{program.type}</span>
                  <span className="flex items-center gap-1">
                    <User2 size={16} className="text-purple-500" />
                    Facilitator:{" "}
                    <span className="text-gray-700 font-medium">
                      {program.facilitator}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {/* Total Bookings */}
                <div className="flex items-center gap-2 text-blue-600">
                  <Users size={18} />
                  <span className="text-lg font-medium">
                    {program.bookingsCount} Bookings
                  </span>
                </div>

                {/* Date/Time (first event) */}
                {program.start && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Calendar size={18} />
                    <span>
                      {new Date(program.start).toLocaleDateString()}{" "}
                      ({new Date(program.start).toLocaleTimeString()})
                    </span>
                  </div>
                )}

                {/* Expand Icon */}
                {openProgram === program.programId ? (
                  <ChevronUp size={22} className="text-gray-500" />
                ) : (
                  <ChevronDown size={22} className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Expanded Booking Table */}
            {openProgram === program.programId && (
              <div className="mt-5 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm border-b">
                    <tr>
                      <th className="p-3">Attendee</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">End</th>
                      <th className="p-3">Booked On</th>
                    </tr>
                  </thead>

                  <tbody>
                    {program.bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {b.attendee_name}
                        </td>

                        <td className="p-3 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          {b.email}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              b.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td className="p-3">
                          {b.event_start &&
                            new Date(b.event_start).toLocaleString()}
                        </td>

                        <td className="p-3">
                          {b.event_end &&
                            new Date(b.event_end).toLocaleString()}
                        </td>

                        <td className="p-3">
                          {b.created_at &&
                            new Date(b.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
