import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import {
  Users,
  Activity,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AttendanceDashboard() {
  const [summary, setSummary] = useState({
    totalAttendance: 0,
    uniqueUsers: 0,
    programsAttended: 0,
  });

  const [topPrograms, setTopPrograms] = useState([]);
  const [attendanceOverTime, setAttendanceOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const res = await fetch("/api/admin/attendance/summary");
      const data = await res.json();

      if (data.success) {
        setSummary({
          totalAttendance: data.totalAttendance,
          uniqueUsers: data.uniqueUsers,
          programsAttended: data.programsAttended,
        });

        setTopPrograms(data.topPrograms || []);
        setAttendanceOverTime(data.attendanceOverTime || []);
      }
    } catch (err) {
      console.error("Attendance summary error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading attendance data...</p>;

  return (
    <AdminLayout>
      <div className="space-y-10 bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] min-h-screen p-6">

        {/* ---------------- HEADER ---------------- */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Attendance Dashboard
        </h1>

        {/* ---------------- SUMMARY CARDS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card 
            icon={<Users className="w-6 h-6 text-purple-500" />} 
            label="Total Attendance"
            value={summary.totalAttendance}
          />

          <Card 
            icon={<Activity className="w-6 h-6 text-indigo-500" />} 
            label="Unique Users"
            value={summary.uniqueUsers}
          />

          <Card 
            icon={<BookOpen className="w-6 h-6 text-blue-500" />} 
            label="Programs Attended"
            value={summary.programsAttended}
          />

        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LINE CHART — Attendance Over Time */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Attendance Over Time
            </h3>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceOverTime}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR CHART — Top Programs */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Top Programs by Attendance
            </h3>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPrograms}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                  <XAxis dataKey="title" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#67c6c6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ---------------- TABLE ---------------- */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Program Attendance List
          </h2>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Program</th>
                  <th className="p-3 text-left">Attendance</th>
                  <th className="p-3 text-left">Details</th>
                </tr>
              </thead>

              <tbody>
                {topPrograms.map((p, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.count}</td>
                    <td className="p-3">
                      <button className="text-primary flex items-center gap-1">
                        View <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {topPrograms.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No attendance data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

/* ---------------- Reusable Card Component ---------------- */
function Card({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col gap-2">
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
