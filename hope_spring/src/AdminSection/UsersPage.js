import React, { useState } from "react";
import { Search, Plus, Download, Users, UserCheck, UserX, Calendar } from "lucide-react";

const UsersPage = () => {
  const [search, setSearch] = useState("");

  // Temporary mock data — will later come from your backend API
  const users = [
    { name: "Aman Ansari", email: "aman@hopespring.com", role: "Admin", joined: "2025-10-01", status: "Active" },
    { name: "Kamendra Singh", email: "kamendra@hopespring.com", role: "Member", joined: "2025-10-12", status: "Active" },
    { name: "Sushil Sharma", email: "sushil@hopespring.com", role: "Volunteer", joined: "2025-09-22", status: "Active" },
    { name: "Mary Jones", email: "mary@hopespring.com", role: "Staff", joined: "2025-08-15", status: "Inactive" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] p-6 md:p-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c6cf2] to-[#a88ff0] bg-clip-text text-transparent">
          Total Registered Users
        </h1>
        <p className="text-gray-600 mt-1">Overview of all users currently registered in the HopeSpring system.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold mt-1">1,247</h2>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <h2 className="text-2xl font-bold mt-1 text-green-600">1,038</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-xl">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Inactive Users</p>
            <h2 className="text-2xl font-bold mt-1 text-red-500">209</h2>
          </div>
          <div className="p-3 bg-red-100 rounded-xl">
            <UserX className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">New Signups (30 days)</p>
            <h2 className="text-2xl font-bold mt-1 text-[#67c6c6]">54</h2>
          </div>
          <div className="p-3 bg-teal-100 rounded-xl">
            <Calendar className="w-6 h-6 text-[#67c6c6]" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a88ff0]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center bg-[#67c6c6] text-white px-4 py-2 rounded-lg hover:bg-[#5ab7b7] transition">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </button>
          <button className="flex items-center bg-[#9b87f5] text-white px-4 py-2 rounded-lg hover:bg-[#8c7cf0] transition">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-[#f7f5fb] text-gray-600 text-sm uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.joined}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;