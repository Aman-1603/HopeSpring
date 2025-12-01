import React, { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Users, MapPin, Mail } from "lucide-react";

export default function FacilitatorDashboard() {
  const [openProgram, setOpenProgram] = useState(null);

  // Static demo data for UI Preview
  const programs = [
    {
      id: 1,
      title: "Yoga & Healing Session",
      category: "Wellness",
      date: "2025-01-12",
      time: "10:00 AM",
      location: "HopeSpring Center - Room A",
      participants: 12,
      instructor: "Sarah Thompson",

      bookings: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "confirmed" },
        { id: 2, name: "Mark Peterson", email: "mark@example.com", status: "confirmed" },
      ],
    },
    {
      id: 2,
      title: "Nutrition Counselling",
      category: "1-on-1",
      date: "2025-01-15",
      time: "01:00 PM",
      location: "HopeSpring Center - Room C",
      participants: 4,
      instructor: "Sarah Thompson",

      bookings: [
        { id: 3, name: "Sasha Morgan", email: "sasha@example.com", status: "pending" },
      ],
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        Facilitator Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Welcome back, Sarah. Below are your assigned programs and participant details.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-700">Total Programs</h3>
          <p className="text-3xl mt-2 text-purple-600">{programs.length}</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-700">Total Participants</h3>
          <p className="text-3xl mt-2 text-blue-600">
            {programs.reduce((sum, p) => sum + p.participants, 0)}
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-700">Upcoming Sessions</h3>
          <p className="text-3xl mt-2 text-green-600">
            {programs.filter(p => new Date(p.date) > new Date()).length}
          </p>
        </div>
      </div>

      {/* Program List */}
      <div className="space-y-6">
        {programs.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpenProgram(openProgram === p.id ? null : p.id)}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{p.title}</h2>
                <p className="text-gray-500">{p.category}</p>

                <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-purple-500" />
                    {p.date} at {p.time}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} className="text-blue-500" />
                    {p.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users size={16} className="text-green-500" />
                    {p.participants} participants
                  </span>
                </div>
              </div>

              {openProgram === p.id ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </div>

            {/* Expandable Booking Table */}
            {openProgram === p.id && (
              <div className="mt-5 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm border-b">
                    <tr>
                      <th className="p-3">Participant</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {p.bookings.map((b) => (
                      <tr key={b.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">{b.name}</td>

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
  );
}
