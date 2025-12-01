// AdminLayout.js
import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AppSidebar from "../../components/layout/AppSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  CheckSquare,
  Megaphone,
  CalendarDays,
  BarChart3,
  MessageSquare,
  Settings,
  ListChecks
} from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Programs", path: "/admin/add-programs", icon: Calendar },
  { name: "Donations", path: "/admin/donations", icon: DollarSign },
  { name: "Attendance", path: "/admin/attendance", icon: CheckSquare },
  { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
  { name: "Event Calendar", path: "/admin/EventCalendar", icon: CalendarDays },
  { name: "Bookings", path: "/admin/FetchBooking", icon: BarChart3 },
  { name: "Communication", path: "/admin/AdminSupport", icon: MessageSquare },
  { name: "Waitlist", path: "/admin/waitlist", icon: ListChecks },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {logout} = useAuth();
  const navigate = useNavigate();
  const HandleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        title="HopeSpring"
        subtitle="Admin Panel"
        navItems={adminNavItems}
        onLogout={HandleLogout}
      />
      <div className="flex-1 flex flex-col">
        <AdminNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
