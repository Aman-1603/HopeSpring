import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AdminLayout from "../AdminLayout";

// Static attendance temp data
const attendanceData = [
  { program: "Yoga", rate: 85 },
  { program: "Meditation", rate: 78 },
  { program: "Support Group", rate: 92 },
  { program: "Art Therapy", rate: 70 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);

  const [donationTotal, setDonationTotal] = useState(0);
  const [donationData, setDonationData] = useState([]);

  // ============================
  // FETCH USERS
  // ============================
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUserCount(data.length);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ============================
  // FETCH PROGRAMS
  // ============================
  const loadPrograms = async () => {
    try {
      const res = await fetch("/api/programs");
      const data = await res.json();
      setProgramCount(data.length);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  // ============================
  // FETCH DONATIONS (Dynamic Graph)
  // ============================
  const loadDonations = async () => {
    try {
      const res = await fetch("/api/admin/donations");
      const data = await res.json();

      if (!data.success) return;

      // Total donations
      const total = data.donations.reduce(
        (sum, d) => sum + d.amount_cents,
        0
      );
      setDonationTotal((total / 100).toFixed(2));

      // Graph → amount/day (Same as AdminDonations)
      const formatted = data.donations.map((d) => ({
        date: new Date(d.created_at).toLocaleDateString(),
        amount: d.amount_cents / 100,
      }));

      setDonationData(formatted);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  // ============================
  // LOAD ALL
  // ============================
  useEffect(() => {
    loadUsers();
    loadPrograms();
    loadDonations();
  }, []);

  // ============================
  // STATS CARDS
  // ============================
  const stats = [
    { title: "Total Users", value: userCount, icon: Users },
    { title: "Active Programs", value: programCount, icon: Calendar },
    { title: "Total Donations", value: `$${donationTotal}`, icon: DollarSign },
    { title: "Avg. Attendance", value: "81%", icon: TrendingUp },
  ];

  const handleClick = (title) => {
    if (title === "Total Users") navigate("/admin/users");
    if (title === "Active Programs") navigate("/admin/programs");
    if (title === "Total Donations") navigate("/admin/donations");
  };

  return (
    <AdminLayout>

      <div className="space-y-10 bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] min-h-screen p-6">

        {/* -------------------------------- HEADER ------------------------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's what’s happening.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white">
              <Calendar className="w-4 h-4" />
              Add Program
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300">
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>
        </div>

        {/* -------------------------------- STATS GRID ------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              onClick={() => handleClick(s.title)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {s.value}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-[#f3f0fa]">
                  <s.icon className="w-6 h-6 text-[#7c6cf2]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* -------------------------------- CHARTS GRID ------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* --------- DYNAMIC DONATION GRAPH (MATCHING AdminDonations.jsx) --------- */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Donation Trend
            </h3>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------------------------- STATIC ATTENDANCE GRAPH ---------------------------- */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Program Attendance Rate
            </h3>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                  <XAxis dataKey="program" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#67c6c6"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </AdminLayout>
  );
}
