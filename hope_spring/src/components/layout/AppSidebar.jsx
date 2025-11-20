// AppSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const AppSidebar = ({
  isOpen,
  setIsOpen,
  title = "HopeSpring",
  subtitle,
  navItems = [],
  onLogout,
}) => {
  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    else alert("Logout clicked!");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-[#7c6cf2] to-[#9b87f5] text-white border-r border-white/10 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Title */}
          <div className="p-6 border-b border-white/20 flex items-center gap-3">
            {/* Add logo here if needed */}
            <div>
              <h1 className="text-lg font-bold">{title}</h1>
              {subtitle && (
                <p className="text-xs text-white/70">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white text-[#7c6cf2] font-semibold shadow-md"
                      : "hover:bg-[#8b7ef5] hover:text-white/90 text-white/80"
                  }`
                }
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-white/10 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
