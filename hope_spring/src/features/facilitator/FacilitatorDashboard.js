import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  LogOut,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
} from "lucide-react";

export default function FacilitatorDashboard() {
  const [openProgram, setOpenProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        // *** HARD-CODE FACILITATOR EMAIL FOR NOW ***
        const email = "fttest@gmail.com"; // <-- your facilitator email

        const res = await axios.get("/api/facilitator/programs", {
          params: { email }, // -> /api/facilitator/programs?email=fftest@gmail.com
        });

        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to load programs");
        }

        setPrograms(res.data.programs || []);
      } catch (err) {
        console.error("Error loading facilitator programs:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your programs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const totalParticipants = programs.reduce(
    (sum, p) => sum + Number(p.participants_count || 0),
    0
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 p-6 relative">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-10">
          HopeSpring
        </h2>

        <nav className="space-y-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={CalendarDays} label="My Sessions" />
          <SidebarItem icon={BookOpen} label="Programs" />
          <SidebarItem icon={Users} label="Participants" />
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <SidebarItem icon={LogOut} label="Logout" danger />
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Facilitator Dashboard
        </h1>

        <p className="text-gray-600 mb-10">
          Welcome back. Here you can manage your upcoming classes, view participants, and track attendance.
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-500">Loading your programs...</div>
        ) : programs.length === 0 ? (
          <div className="text-gray-500">
            You don’t have any assigned programs yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <StatCard
                label="Total Programs"
                value={programs.length}
                color="purple"
              />
              <StatCard
                label="Total Participants"
                value={totalParticipants}
                color="blue"
              />
              <StatCard
                label="Upcoming Sessions"
                value={programs.length}
                color="green"
              />
            </div>

            <div className="space-y-6">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setOpenProgram(openProgram === p.id ? null : p.id)
                    }
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {p.title}
                      </h2>
                      <p className="text-sm text-gray-500">{p.category}</p>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={16} className="text-purple-500" />
                          {p.date
                            ? `${p.date} ${p.time ? `at ${p.time}` : ""}`
                            : "Date TBD"}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={16} className="text-blue-500" />
                          {p.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Users size={16} className="text-green-600" />
                          {p.participants_count} participants
                        </span>
                      </div>
                    </div>

                    {openProgram === p.id ? (
                      <ChevronUp size={24} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-500" />
                    )}
                  </div>

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
                          {(p.bookings || []).length === 0 ? (
                            <tr>
                              <td
                                className="p-3 text-sm text-gray-500"
                                colSpan={3}
                              >
                                No participants yet for this program.
                              </td>
                            </tr>
                          ) : (
                            p.bookings.map((b) => (
                              <tr
                                key={b.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="p-3 font-medium text-gray-800">
                                  {b.name}
                                </td>
                                <td className="p-3 flex items-center gap-2">
                                  <Mail size={16} className="text-gray-400" />
                                  {b.email}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs ${
                                      b.status === "confirmed" ||
                                      b.status === "ACCEPTED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* Reusable components unchanged */
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
