// UserLayout.js
import React, { useState } from "react";
import AppSidebar from "../../components/layout/AppSidebar";
import { User, History, ShoppingBag, House } from "lucide-react";

const userNavItems = [
  { name: "Home", path: "/user/dashboard", icon: House, exact: true },
  { name: "Profile", path: "/user/profile", icon: User },
  { name: "Past Sessions", path: "/user/past-sessions", icon: History },
  { name: "My Orders", path: "/user/orders", icon: ShoppingBag },
];

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    alert("User logout clicked!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        title="HopeSpring"
        subtitle="Member Area"
        navItems={userNavItems}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* If you add a UserNavbar later, place it here */}
        {/* <UserNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} /> */}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
