import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users, Calendar, Mail, User2 } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function AdminBookingUI() {
  const [openProgram, setOpenProgram] = useState(null);

  // Temporary data
  const programs = [
    {
      id: 1,
      name: "Yoga & Wellness",
      type: "Health Program",
      facilitator: "Sarah Thompson",
      bookingsCount: 12,
      start: "2025-01-12T10:00:00",
      end: "2025-01-12T11:00:00",

      bookings: [
        {
          id: 101,
          attendee_name: "Alice Johnson",
          email: "alice@example.com",
          status: "confirmed",
          event_start: "2025-01-12T10:00:00",
          event_end: "2025-01-12T11:00:00",
          created_at: "2025-01-10T14:21:00",
        },
        {
          id: 102,
          attendee_name: "Mark Peterson",
          email: "mark@example.com",
          status: "pending",
          event_start: "2025-01-12T10:00:00",
          event_end: "2025-01-12T11:00:00",
          created_at: "2025-01-09T11:50:00",
        },
      ],
    },
    {
      id: 2,
      name: "Nutrition Counselling",
      type: "1-on-1 Session",
      facilitator: "Dr. Emily Carter",
      bookingsCount: 4,
      start: "2025-01-15T13:00:00",
      end: "2025-01-15T13:45:00",

      bookings: [
        {
          id: 201,
          attendee_name: "Sasha Morgan",
          email: "sasha@example.com",
          status: "confirmed",
          event_start: "2025-01-15T13:00:00",
          event_end: "2025-01-15T13:45:00",
          created_at: "2025-01-11T12:30:00",
        },
      ],
    },
  ];

  return (
    <AdminLayout>
    <div className="p-6">

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        Program Bookings
      </h1>

      <div className="space-y-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* Program Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenProgram(openProgram === program.id ? null : program.id)
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

                {/* Date/Time */}
                <div className="flex items-center gap-2 text-green-600">
                  <Calendar size={18} />
                  <span>
                    {new Date(program.start).toLocaleDateString()}{" "}
                    ({new Date(program.start).toLocaleTimeString()})
                  </span>
                </div>

                {/* Expand Icon */}
                {openProgram === program.id ? (
                  <ChevronUp size={22} className="text-gray-500" />
                ) : (
                  <ChevronDown size={22} className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Expanded Booking Table */}
            {openProgram === program.id && (
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
                          {new Date(b.event_start).toLocaleString()}
                        </td>

                        <td className="p-3">
                          {new Date(b.event_end).toLocaleString()}
                        </td>

                        <td className="p-3">
                          {new Date(b.created_at).toLocaleString()}
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
