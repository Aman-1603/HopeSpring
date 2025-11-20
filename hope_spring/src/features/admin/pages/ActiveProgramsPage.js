import React from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import AdminLayout from "../AdminLayout";

const programs = [
  { id: 1, name: "Yoga for Wellness", category: "Health", date: "Nov 15, 2025", participants: 42, status: "Ongoing" },
  { id: 2, name: "Mindfulness Workshop", category: "Mental Health", date: "Dec 02, 2025", participants: 30, status: "Upcoming" },
  { id: 3, name: "Art Therapy Session", category: "Creative Healing", date: "Oct 20, 2025", participants: 25, status: "Completed" },
  { id: 4, name: "Nutrition for Survivors", category: "Wellbeing", date: "Nov 05, 2025", participants: 38, status: "Ongoing" },
];

const ActiveProgramsPage = () => {
  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c6cf2] to-[#9b87f5] bg-clip-text text-transparent">
          Active Programs
        </h1>
        <p className="text-gray-500 mt-1">Manage and monitor all running programs.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Total Programs</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">{programs.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Upcoming</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {programs.filter((p) => p.status === "Upcoming").length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Ongoing</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {programs.filter((p) => p.status === "Ongoing").length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {programs.filter((p) => p.status === "Completed").length}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Program List</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-[#67c6c6] to-[#5ab7b7] text-white rounded-lg font-medium hover:opacity-90 flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Program
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#f3f0fa] text-gray-700 text-sm">
                <th className="p-3 rounded-tl-lg">Program Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Participants</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{p.name}</td>
                  <td className="p-3 text-gray-600">{p.category}</td>
                  <td className="p-3 text-gray-600">{p.date}</td>
                  <td className="p-3 text-gray-600">{p.participants}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.status === "Ongoing"
                          ? "bg-green-100 text-green-700"
                          : p.status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default ActiveProgramsPage;
