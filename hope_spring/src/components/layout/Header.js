// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../shared/LanguageDropdown";
import axios from "axios";
import { Bell, User as UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { set } from "date-fns";
/* -------------------------------- MENU DATA -------------------------------- */
const MENU = [
  {
    key: "getStarted",
    label: "Get Started",
    children: [
      {
        label: "I am living with cancer or I am a survivor",
        to: "/get-started/living-with-cancer",
      },
      {
        label: "I am a caregiver, supporter, or family member",
        to: "/get-started/caregiver-family",
      },
      {
        label: "I am a healthcare provider or community partner",
        to: "/get-started/provider-partner",
      },
      {
        label: "I want to give or volunteer",
        to: "/get-started/give-or-volunteer",
      },
    ],
  },
  {
    key: "getFreeSupport",
    label: "Get Free Support",
    children: [
      { label: "View Calendar & Register", to: "/support/calendar" },
      {
        label: "Programs",
        children: [
          { label: "Support Groups", to: "/support/programs/support-groups" },
          {
            label: "Gentle Exercise",
            children: [
              {
                label: "Meditation",
                to: "/support/programs/gentle-exercise/meditation",
              },
              { label: "Yoga", to: "/support/programs/gentle-exercise/yoga" },
              {
                label: "Tai Chi",
                to: "/support/programs/gentle-exercise/tai-chi",
              },
              {
                label: "Qi Gong",
                to: "/support/programs/gentle-exercise/qi-gong",
              },
            ],
          },
          {
            label: "Children/Youth/Families",
            to: "/support/programs/children-youth-families",
          },
          {
            label: "Coping",
            children: [
              {
                label: "Chemo brain",
                to: "/support/programs/coping/chemo-brain",
              },
            ],
          },
          {
            label: "Arts and Creativity",
            children: [
              {
                label: "Joyful Art Practice",
                to: "/support/programs/arts-creativity/joyful-art-practice",
              },
              {
                label: "Joyful Art Skills & Techniques",
                to: "/support/programs/arts-creativity/joyful-art-skills",
              },
            ],
          },
          {
            label: "Relaxation",
            children: [
              {
                label: "Massage Therapy",
                to: "/support/programs/relaxation/massage-therapy",
              },
              {
                label: "Therapeutic Touch",
                to: "/support/programs/relaxation/therapeutic-touch",
              },
              { label: "Reiki", to: "/support/programs/relaxation/reiki" },
            ],
          },
        ],
      },
      {
        label: "Book a Service",
        children: [
          {
            label: "Cancer Care Counselling",
            to: "/book/cancer-care-counselling",
          },
          {
            label: "Wigs, Camisoles, Headcovers",
            to: "/book/wigs-camisoles-headcovers",
          },
        ],
      },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    key: "getInvolved",
    label: "Get Involved",
    children: [
      { label: "Donate", to: "/donate" },
      { label: "Become a Member", to: "/become-a-member" },
      { label: "Volunteer", to: "/volunteer" },
      {
        label: "Fundraise",
        children: [
          { label: "Fundraising", to: "/fundraise" },
          { label: "Lifeafterme", to: "/fundraise/lifeafterme" },
        ],
      },
      { label: "Legacy Giving", to: "/legacy-giving" },
    ],
  },
  { key: "getInspired", label: "Get Inspired", to: "/get-inspired" },
  {
    key: "about",
    label: "About",
    children: [
      { label: "Contact Us", to: "/contact-us" },
      { label: "About", to: "/about" },
      { label: "Our Team", to: "/our-team" },
      { label: "Board of Directors", to: "/board-of-directors" },
      { label: "Donors & Partners", to: "/donors-and-partners" },
      { label: "Reports", to: "/reports" },
    ],
  },
];

/* ---------------------------- Active route helper --------------------------- */
function hasActiveDescendant(item, pathname) {
  if (item.to && pathname.startsWith(item.to)) return true;
  if (!item.children) return false;
  return item.children.some((c) => hasActiveDescendant(c, pathname));
}

/* --------------------------------- HEADER --------------------------------- */
export default function Header() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("hs_token");
    logout();
    setProfileOpen(false);
    navigate("/login");
  };
  /* -------------------- NOTIFICATIONS (Announcements) -------------------- */
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const res = await axios.get("/api/announcements");
        setNotifications(res.data.filter((a) => a.published));
      } catch (err) {
        console.warn("⚠ Backend offline — showing empty announcements");
        setNotifications([]);
      }
    };
    loadAnnouncements();
  }, []);

  /* --------------------------- PROFILE DROPDOWN --------------------------- */
  const profileRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* --------------------------- Escape key closes menu --------------------------- */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --------------------- Close mobile when clicking outside -------------------- */
  useEffect(() => {
    const onClick = (e) => {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      {/* --------------------------- TOP UTILITY BAR --------------------------- */}
      <div className="hidden md:block border-b border-gray-200 bg-white/90">
        <div className="mx-auto max-w-6xl h-9 px-4 flex items-center justify-between">
          <div className="flex-1 text-xs text-gray-700 marquee">
            <div className="marquee-inner">{t("topBar.announcement")}</div>
          </div>
          <LanguageDropdown />
        </div>
      </div>

      {/* ------------------------------- MAIN ROW ------------------------------ */}
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="block w-[210px] md:w-[240px] h-12">
          <img
            src="/images/logo2.png"
            alt="HopeSpring Logo"
            className="w-full h-full object-contain"
          />
        </Link>

        {/* ------------------------------ DESKTOP NAV ----------------------------- */}
        <nav className="hidden md:flex items-center justify-between flex-1">
          {/* LEFT SIDE — Donate + Menu */}
          <div className="flex items-center gap-6">
            {/* DONATE BUTTON */}
            <NavLink
              to="/donate"
              className="rounded-xl bg-[#0e2340] text-white px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-110"
            >
              {t("menu.common.donate")}
            </NavLink>

            {/* MENU */}
            <ul className="flex items-center gap-2 text-[15px] text-[#0b1c33]">
              {MENU.map((item, i) => {
                const active = hasActiveDescendant(item, pathname);
                const label = item.key ? t(`menu.top.${item.key}`) : item.label;

                return (
                  <li key={i} className="relative group">
                    {item.children ? (
                      <button
                        className={`flex items-center gap-1 px-3 py-2 hover:text-black ${
                          active ? "text-black font-semibold" : ""
                        }`}
                      >
                        {label}
                        <svg
                          className={`h-3.5 w-3.5 transition-transform ${
                            active ? "rotate-180" : "group-hover:rotate-180"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    ) : (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `px-3 py-2 hover:text-black ${
                            isActive
                              ? "text-black font-semibold underline underline-offset-4"
                              : ""
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    )}

                    {item.children && (
                      <div
                        className="absolute left-0 top-full pt-2 opacity-0 translate-y-1 pointer-events-none
                                   group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                   transition"
                      >
                        <DesktopMenuPanel items={item.children} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT SIDE — Notifications + Auth */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif((prev) => !prev)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-xl z-50 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Announcements
                  </h3>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No announcements at this time.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {n.title}
                          </p>
                          {n.summary && (
                            <p className="text-xs text-gray-600 mt-1">
                              {n.summary}
                            </p>
                          )}
                          {n.link && (
                            <a
                              href={n.link}
                              className="text-indigo-600 text-xs mt-1 inline-block"
                            >
                              View →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth: Login / Profile */}
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-full text-sm font-semibold
                           bg-blue-600 text-white shadow-sm
                           hover:bg-blue-700 hover:shadow-md
                           active:scale-[0.98] transition"
              >
                Log in
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  {/* Initial or icon */}
                  {user.firstName || user.name || user.email ? (
                    <span className="text-sm font-semibold text-[#0e2340]">
                      {(user.firstName ||
                        user.name ||
                        user.email)[0].toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 py-2 text-sm">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/user/dashboard");
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/user/profile");
                      }}
                    >
                      My Profile
                    </button>
                    <div className="border-t my-1" />
                    <button
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ------------------------------ MOBILE MENU BUTTON ----------------------------- */}
        <button
          className="md:hidden inline-flex items-center gap-2 rounded-lg border px-3 py-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {/* ------------------------------- MOBILE MENU ------------------------------ */}
      <div
        ref={navRef}
        className={`md:hidden bg-white overflow-hidden transition ${
          mobileOpen ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <div
          ref={navRef}
          className={`md:hidden bg-white overflow-hidden transition ${
            mobileOpen ? "max-h-[80vh]" : "max-h-0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
            {/* Language + Donate in one row */}
            <div className="flex items-center justify-between gap-3">
              <LanguageDropdown />

              <NavLink
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center
                 rounded-full bg-[#0e2340] text-white
                 px-4 py-2 text-xs font-semibold
                 whitespace-nowrap shadow-sm
                 hover:brightness-110 active:scale-[0.98] transition"
              >
                {t("menu.common.donate")}
              </NavLink>
            </div>

            {/* Mobile menu tree */}
            <MobileMenu items={MENU} />

            {/* 🔹 Mobile auth section */}
            <div className="mt-4 pt-3 border-t flex flex-col gap-2">
              {!user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                  className="w-full px-4 py-2.5 rounded-full text-sm font-semibold
                           bg-blue-600 text-white shadow-sm
                           hover:bg-blue-700 hover:shadow-md
                           active:scale-[0.98] transition"
                >
                  Log in
                </button>
              ) : (
                <>
                  {/* Profile mini header */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      {user.firstName || user.name || user.email ? (
                        <span className="text-sm font-semibold text-[#0e2340]">
                          {(user.firstName ||
                            user.name ||
                            user.email)[0].toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="w-5 h-5 text-gray-700" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        {user.firstName || user.name || "Member"}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Profile actions */}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/user/dashboard");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/user/profile");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- DESKTOP SUBMENUS ------------------------------- */
function DesktopMenuPanel({ items }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <ul className="relative min-w-[240px] rounded-xl border bg-white shadow-lg p-2">
      {items.map((it, idx) => {
        const hasChildren = it.children;
        const isOpen = openIdx === idx;

        return (
          <li
            key={idx}
            className="relative"
            onMouseEnter={() => hasChildren && setOpenIdx(idx)}
            onMouseLeave={() => hasChildren && setOpenIdx(null)}
          >
            {hasChildren ? (
              <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50">
                {it.label}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            ) : (
              <NavLink
                to={it.to}
                className="block px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                {it.label}
              </NavLink>
            )}

            {hasChildren && isOpen && (
              <div className="absolute left-full top-0 pl-2 z-[60]">
                <DesktopMenuPanel items={it.children} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------- MOBILE MENU ------------------------------- */
function MobileMenu({ items, level = 0 }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <ul className="space-y-1 mt-3">
      {items.map((it, idx) => {
        const open = openIndex === idx;
        const hasChildren = it.children;

        return (
          <li key={idx} className="border rounded-lg">
            <div className="flex justify-between items-center">
              {!hasChildren ? (
                <NavLink to={it.to} className="flex-1 px-3 py-2.5">
                  {it.label}
                </NavLink>
              ) : (
                <button
                  className="flex-1 text-left px-3 py-2.5"
                  onClick={() => setOpenIndex(open ? null : idx)}
                >
                  {it.label}
                </button>
              )}

              {hasChildren && (
                <button
                  className="px-3 py-2.5"
                  onClick={() => setOpenIndex(open ? null : idx)}
                >
                  <svg
                    className={`transition ${open ? "rotate-180" : ""}`}
                    width="18"
                    height="18"
                    fill="none"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              )}
            </div>

            {hasChildren && open && (
              <div className="p-2">
                <MobileMenu items={it.children} level={level + 1} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
