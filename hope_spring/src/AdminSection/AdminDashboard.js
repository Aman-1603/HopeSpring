import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, DollarSign, TrendingUp, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data
const donationData = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 5000 },
  { month: "Apr", amount: 4500 },
  { month: "May", amount: 6000 },
  { month: "Jun", amount: 5500 },
];

const attendanceData = [
  { program: "Yoga", rate: 85 },
  { program: "Meditation", rate: 78 },
  { program: "Support Group", rate: 92 },
  { program: "Art Therapy", rate: 70 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Users", value: "1,247", icon: Users, change: "+12%" },
    { title: "Active Programs", value: "24", icon: Calendar, change: "+3" },
    { title: "Total Donations", value: "$28,500", icon: DollarSign, change: "+18%" },
    { title: "Avg. Attendance", value: "81%", icon: TrendingUp, change: "+5%" },
  ];

  const quickActions = [
    { label: "Add Program", icon: Calendar },
    { label: "Add Event", icon: Calendar },
    { label: "New Announcement", icon: Plus },
  ];

  // ✅ Correct navigation logic
  const handleCardClick = (title) => {
    if (title === "Total Users") navigate("/admin/users");
    else if (title === "Active Programs") navigate("/admin/programs");
    else if (title === "Total Donations") navigate("/admin/donations");
    else if (title === "Avg. Attendance") navigate("/admin/attendance");
  };

  return (
    <div className="p-6 space-y-10 bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c6cf2] to-[#9b87f5] bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(stat.title)}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-[#7c6cf2] mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#f3f0fa]">
                <stat.icon className="w-6 h-6 text-[#7c6cf2]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Donation Trend</h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#7c6cf2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Program Attendance Rate
            </h2>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="program" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rate" fill="#67c6c6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-[#67c6c6] to-[#5ab7b7] text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
