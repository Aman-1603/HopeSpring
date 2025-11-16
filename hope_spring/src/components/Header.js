// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "./LanguageDropdown";

/** ---------- MENU DATA ---------- */
const MENU = [
  {
    key: "getStarted",
    label: "Get Started",
    children: [
      { label: "I am living with cancer or I am a survivor", to: "/get-started/living-with-cancer" },
      { label: "I am a caregiver, supporter, or family member", to: "/get-started/caregiver-family" },
      { label: "I am a healthcare provider or community partner", to: "/get-started/provider-partner" },
      { label: "I want to give or volunteer", to: "/get-started/give-or-volunteer" }
    ]
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
              { label: "Meditation", to: "/support/programs/gentle-exercise/meditation" },
              { label: "Yoga", to: "/support/programs/gentle-exercise/yoga" },
              { label: "Tai Chi", to: "/support/programs/gentle-exercise/tai-chi" },
              { label: "Qi Gong", to: "/support/programs/gentle-exercise/qi-gong" }
            ]
          },
          { label: "Children/Youth/Families", to: "/support/programs/children-youth-families" },
          {
            label: "Coping",
            children: [{ label: "Chemo brain", to: "/support/programs/coping/chemo-brain" }]
          },
          {
            label: "Arts and Creativity",
            children: [
              { label: "Joyful Art Practice", to: "/support/programs/arts-creativity/joyful-art-practice" },
              { label: "Joyful Art Skills & Techniques", to: "/support/programs/arts-creativity/joyful-art-skills" }
            ]
          },
          {
            label: "Relaxation",
            children: [
              { label: "Massage Therapy", to: "/support/programs/relaxation/massage-therapy" },
              { label: "Therapeutic Touch", to: "/support/programs/relaxation/therapeutic-touch" },
              { label: "Reiki", to: "/support/programs/relaxation/reiki" }
            ]
          }
        ]
      },
      {
        label: "Book a Service",
        children: [
          { label: "Cancer Care Counselling", to: "/book/cancer-care-counselling" },
          { label: "Wigs, Camisoles, Headcovers", to: "/book/wigs-camisoles-headcovers" }
        ]
      },
      { label: "Resources", to: "/resources" }
    ]
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
          { label: "Lifeafterme", to: "/fundraise/lifeafterme" }
        ]
      },
      { label: "Legacy Giving", to: "/legacy-giving" }
    ]
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
      { label: "Reports", to: "/reports" }
    ]
  }
];

/** active helper */
function hasActiveDescendant(item, pathname) {
  if (item.to && pathname.startsWith(item.to)) return true;
  if (!item.children) return false;
  return item.children.some((c) => hasActiveDescendant(c, pathname));
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 isolate bg-white/80 backdrop-blur border-b border-gray-200">
      {/* Top utility bar (desktop only): left = marquee area, right = language */}
{/* Top utility bar (desktop only): left = marquee, right = language */}
<div className="hidden md:block border-b border-gray-200 bg-white/90">
  <div className="mx-auto max-w-6xl h-9 px-4 flex items-center justify-between gap-4">
    {/* Left: scrolling announcement */}
    <div className="flex-1 text-xs text-gray-700 marquee">
      <div className="marquee-inner">
        {t("topBar.announcement")}
      </div>
    </div>

    {/* Right: language selector */}
    <LanguageDropdown />
  </div>
</div>


      {/* Main header row */}
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="HopeSpring Home"
          className="block w-[210px] md:w-[240px] lg:w-[260px] h-12 md:h-14"
        >
          <img src="/images/logo2.png" alt="HopeSpring" className="w-full h-full object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/donate"
            className="mr-3 rounded-xl bg-[#0e2340] text-white px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-110"
          >
            {t("menu.common.donate")}
          </NavLink>

          <ul className="flex items-center gap-2 text-[15px] text-[#0b1c33]">
            {MENU.map((item, i) => {
              const active = hasActiveDescendant(item, pathname);
              const label = item.key ? t(`menu.top.${item.key}`) : item.label;

              return (
                <li key={i} className="relative group">
                  {item.children ? (
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-3 py-2 hover:text-black ${
                        active ? "text-black font-semibold" : ""
                      }`}
                      aria-haspopup="true"
                      aria-expanded={active}
                    >
                      {label}
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${
                          active ? "rotate-180" : "group-hover:rotate-180"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                  ) : (
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        `px-3 py-2 hover:text-black ${
                          isActive ? "text-black font-semibold underline underline-offset-4" : ""
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  )}

                  {/* level-1 dropdown (open on hover) */}
                  {item.children && (
                    <div
                      className="absolute left-0 top-full z-[60] pt-2
                                 opacity-0 translate-y-1 pointer-events-none
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
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          aria-label="Menu Toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {t("menu.common.menu")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        ref={navRef}
        className={`md:hidden border-top border-gray-200 bg-white transition-[max-height] overflow-hidden ${
          mobileOpen ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <LanguageDropdown />
            <NavLink
              to="/donate"
              className="inline-block rounded-xl bg-[#0e2340] text-white px-4 py-2 text-sm font-semibold shadow-sm"
            >
              {t("menu.common.donate")}
            </NavLink>
          </div>
          <MobileMenu items={MENU} />
        </div>
      </div>
    </header>
  );
}

/* ---------- Desktop dropdown panel ---------- */
function DesktopMenuPanel({ items }) {
  const [openIdx, setOpenIdx] = React.useState(null);

  return (
    <ul className="relative min-w-[240px] rounded-xl border border-gray-200 bg-white shadow-lg p-2 overflow-visible">
      {items.map((it, idx) => {
        const hasChildren = !!it.children;
        const isOpen = openIdx === idx;

        return (
          <li
            key={idx}
            className="relative"
            onMouseEnter={() => hasChildren && setOpenIdx(idx)}
            onMouseLeave={() => hasChildren && setOpenIdx((v) => (v === idx ? null : v))}
          >
            {hasChildren ? (
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span>{it.label}</span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            ) : (
              <NavLink
                to={it.to}
                end
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg hover:bg-gray-50 ${
                    isActive ? "bg-gray-100 font-semibold text-[#0b1c33]" : ""
                  }`
                }
                onMouseEnter={() => setOpenIdx(null)}
              >
                {it.label}
              </NavLink>
            )}

            {hasChildren && isOpen && (
              <div className="absolute left-full top-0 z-[60] pl-2">
                <DesktopMenuPanel items={it.children} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Mobile accordion ---------- */
function MobileMenu({ items, level = 0 }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <ul className="space-y-1">
      {items.map((it, idx) => {
        const hasChildren = !!it.children;
        const isOpen = openIndex === idx;
        return (
          <li key={`${level}-${idx}`} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              {!hasChildren ? (
                <NavLink
                  to={it.to}
                  end
                  className={({ isActive }) => `flex-1 px-3 py-2.5 ${isActive ? "font-semibold text-[#0b1c33]" : ""}`}
                >
                  {it.label}
                </NavLink>
              ) : (
                <button
                  className="flex-1 text-left px-3 py-2.5"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  {it.label}
                </button>
              )}
              {hasChildren && (
                <button
                  className="px-3 py-2.5"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-label="Toggle submenu"
                >
                  <svg
                    className={`transition ${isOpen ? "rotate-180" : ""}`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              )}
            </div>
            {hasChildren && (
              <div className={`overflow-hidden transition-[max-height] ${isOpen ? "max-h-96" : "max-h-0"}`}>
                <div className="p-2">
                  <MobileMenu items={it.children} level={level + 1} />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
