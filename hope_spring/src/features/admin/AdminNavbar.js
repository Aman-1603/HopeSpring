import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // adjust path if different

const AdminNavbar = ({ toggleSidebar }) => {
  const { user } = useAuth();   // 👈 Get logged-in user from AuthContext

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* mobile hamburger */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* search bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7c6cf2]/40"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* USER */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center bg-[#7c6cf2] text-white rounded-full text-sm font-semibold">
              {user?.fullName?.charAt(0) || "A"}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">
                {user?.fullName || "Admin User"}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "admin"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
