import React, { useState } from "react";
import { 
  LayoutDashboard, CalendarDays, BookOpen, Users, LogOut, 
  ChevronDown, ChevronUp, Mail, MapPin 
} from "lucide-react";

export default function FacilitatorDashboard() {
  const [openProgram, setOpenProgram] = useState(null);

  // Static UI example data
  const programs = [
    {
      id: 1,
      title: "Yoga & Healing Session",
      category: "Wellness",
      date: "2025-01-12",
      time: "10:00 AM",
      location: "HopeSpring Center - Room A",
      participants: 12,
      bookings: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "confirmed" },
        { id: 2, name: "Mark Peterson", email: "mark@example.com", status: "confirmed" }
      ]
    },
    {
      id: 2,
      title: "Nutrition Counselling",
      category: "1-on-1 Session",
      date: "2025-01-15",
      time: "01:00 PM",
      location: "HopeSpring Center - Room C",
      participants: 4,
      bookings: [
        { id: 3, name: "Sasha Morgan", email: "sasha@example.com", status: "pending" }
      ]
    }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* ------------------ SIDEBAR ------------------ */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 p-6">

        {/* BRAND */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-10">
          HopeSpring
        </h2>

        {/* NAV ITEMS */}
        <nav className="space-y-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={CalendarDays} label="My Sessions" />
          <SidebarItem icon={BookOpen} label="Programs" />
          <SidebarItem icon={Users} label="Participants" />
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-8 left-6">
          <SidebarItem icon={LogOut} label="Logout" danger />
        </div>

      </aside>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Facilitator Dashboard
        </h1>

        <p className="text-gray-600 mb-10">
          Welcome back. Here you can manage your upcoming classes, view participants, and track attendance.
        </p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Programs" value={programs.length} color="purple" />
          <StatCard label="Total Participants" value={programs.reduce((sum,p)=>sum+p.participants,0)} color="blue" />
          <StatCard label="Upcoming Sessions" value={programs.length} color="green" />
        </div>

        {/* PROGRAM LIST */}
        <div className="space-y-6">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setOpenProgram(openProgram === p.id ? null : p.id)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{p.title}</h2>
                  <p className="text-sm text-gray-500">{p.category}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={16} className="text-purple-500" />
                      {p.date} at {p.time}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={16} className="text-blue-500" />
                      {p.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users size={16} className="text-green-600" />
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

              {/* Expandable table */}
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

      </main>
    </div>
  );
}

/* --- Reusable Components --- */

function SidebarItem({ icon: Icon, label, active, danger }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
      ${
        active
          ? "bg-purple-100 text-purple-600 font-semibold"
          : danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    purple: "text-purple-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-gray-700 text-lg font-semibold">{label}</h3>
      <p className={`text-4xl mt-3 ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
