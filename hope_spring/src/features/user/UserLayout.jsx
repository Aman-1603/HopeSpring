// UserLayout.js
import React, { useState } from "react";
import AppSidebar from "../../components/layout/AppSidebar";
import { User, History, ShoppingBag, House, Outdent } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";


const userNavItems = [
  { name: "Home", path: "/user/dashboard", icon: House, exact: true },
  { name: "Profile", path: "/user/profile", icon: User },
  { name: "Past Sessions", path: "/user/past-sessions", icon: History },
  { name: "My Orders", path: "/user/orders", icon: ShoppingBag },
];

const UserLayout = ({ children }) => {
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
        subtitle="Member Area"
        navItems={userNavItems}
        onLogout={HandleLogout}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
