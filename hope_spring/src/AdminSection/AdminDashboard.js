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
import AdminLayout from "./NavSection/AdminLayout"; // <-- wrap dashboard inside layout

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

  const handleCardClick = (title) => {
    if (title === "Total Users") navigate("/admin/users");
    else if (title === "Active Programs") navigate("/admin/programs");
    else if (title === "Total Donations") navigate("/admin/donations");
    else if (title === "Avg. Attendance") navigate("/admin/attendance");
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here’s what’s happening today.
          </p>
        </div>

        {/* Add Program + Announcement buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white hover:opacity-90 transition-all">
            <Calendar className="w-4 h-4" />
            Add Program
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all">
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border p-6 bg-white hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-indigo-500 mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-100">
                <stat.icon className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend */}
        <div className="rounded-2xl border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Donation Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Program Attendance */}
        <div className="rounded-2xl border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">
            Program Attendance Rate
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="program" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="rate" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
