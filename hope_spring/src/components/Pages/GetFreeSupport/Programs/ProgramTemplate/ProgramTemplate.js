// src/components/Pages/GetFreeSupport/Programs/ProgramTemplate/ProgramTemplate.js
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";

const PROGRAMS_API = "/api/programs";
const CAL_SLOTS_API = "/api/cal/programs";
const WAITLIST_API = "/api/waitlist";
const BOOKINGS_API = "/api/bookings/programs";

const normalize = (v) =>
  (v || "").trim().toLowerCase().replace(/\s+/g, "_");

const isZoomLocation = (loc) =>
  (loc || "").toLowerCase().includes("zoom");

/* ---------- small UI atoms ---------- */

const HeroPill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-white/90 backdrop-blur">
    {children}
  </span>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-3 py-1">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 6l-11 11-5-5" stroke="currentColor" strokeWidth="2" />
    </svg>
    {children}
  </span>
);

const DatePill = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-[12px] font-semibold px-3 py-1">
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ kicker, title, desc }) => (
  <div className="space-y-2">
    {kicker && (
      <p className="uppercase tracking-wide text-[12px] text-gray-500">
        {kicker}
      </p>
    )}
    <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c33]">{title}</h2>
    {desc && <p className="text-gray-600 max-w-2xl">{desc}</p>}
  </div>
);

/* ---------- helpers ---------- */

const fmtMonthDay = (isoOrYmd) => {
  try {
    const val =
      isoOrYmd && isoOrYmd.length === 10 ? `${isoOrYmd}T00:00:00` : isoOrYmd;
    const d = new Date(val);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoOrYmd;
  }
};

/* ---------- Program card (waitlist-aware, date-aware) ---------- */

const ProgramCard = ({
  p,
  linked,
  onRegister,
  calDates = [],
  isFull = false,
  onJoinWaitlist,
  fullDates = [],
  mode = "default", // "default" | "counselling"
}) => {
  const isCounselling = mode === "counselling";

  const occs = p.occurrences || [];

  const hasCalDates = calDates && calDates.length > 0;
  const showCalDates = hasCalDates ? calDates.slice(0, 4) : [];
  const showOccs = !hasCalDates ? occs.slice(0, 4) : [];

  const moreCount = hasCalDates
    ? calDates.length - showCalDates.length
    : occs.length - showOccs.length;

  // Dates that are fully booked (YYYY-MM-DD)
  const uniqueFullDates = Array.from(new Set(fullDates || []));

  const fullDatesLabel =
    uniqueFullDates.length > 0
      ? uniqueFullDates.map((d) => fmtMonthDay(d)).join(", ")
      : "";

  const zoomLoc = isZoomLocation(p.location);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {p.day_label && <Badge>{p.day_label}</Badge>}
        {p.time_label && <Badge>{p.time_label}</Badge>}
      </div>

      <h3 className="font-semibold text-lg text-[#0b1c33]">{p.title}</h3>

      {p.instructor && (
        <p className="text-sm text-gray-500 mb-2">with {p.instructor}</p>
      )}

      <p className="text-gray-700 text-[15px] leading-relaxed">
        {p.description?.split("||")[0]}
        {p.description?.includes("||") && (
          <span className="block font-semibold mt-1">
            {p.description.split("||")[1]}
          </span>
        )}
      </p>

      {/* For counselling: do NOT show date pills – Cal handles availability */}
      {!isCounselling && (hasCalDates || occs.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hasCalDates
            ? showCalDates.map((d) => (
                <DatePill key={d}>{fmtMonthDay(d)}</DatePill>
              ))
            : showOccs.map((o) => (
                <DatePill key={o.id}>{fmtMonthDay(o.starts_at)}</DatePill>
              ))}
          {moreCount > 0 && <DatePill>+ {moreCount} more</DatePill>}
        </div>
      )}

      {/* Full-date text – only relevant for group programs, not counselling */}
      {!isCounselling && uniqueFullDates.length > 0 && (
        <p className="mt-2 text-xs text-amber-700">
          {fullDatesLabel} {uniqueFullDates.length === 1 ? "is" : "are"} full.
          You can join the waitlist for those dates.
        </p>
      )}

      {/* Location row – now clearly shows Online vs In-person */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-700">
          {zoomLoc ? "Online (Zoom)" : p.location || "Location TBA"}
        </span>
      </div>

      {/* CTA logic */}
      {!linked ? (
        <button
          type="button"
          disabled
          className="mt-4 inline-block rounded-lg bg-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold cursor-not-allowed"
        >
          Not yet open
        </button>
      ) : isCounselling ? (
        // Counselling: always "Request Counselling Time", no waitlist/full logic
        <button
          type="button"
          onClick={() => onRegister && onRegister(p)}
          className="mt-4 inline-block rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
        >
          Request Counselling Time
        </button>
      ) : isFull ? (
        // All dates full → only waitlist
        <button
          type="button"
          onClick={() => onJoinWaitlist && onJoinWaitlist(p)}
          className="mt-4 inline-block rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700"
        >
          Join waitlist
        </button>
      ) : (
        // Some dates still open → Register + optional waitlist for full dates
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRegister && onRegister(p)}
            className="inline-block rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
          >
            Register here
          </button>
          {uniqueFullDates.length > 0 && (
            <button
              type="button"
              onClick={() => onJoinWaitlist && onJoinWaitlist(p)}
              className="inline-block rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700"
            >
              Join waitlist for full dates
            </button>
          )}
        </div>
      )}
    </article>
  );
};

/* ---------- Cal booking modal ---------- */

const CalBookingModal = ({
  open,
  onClose,
  calUser,
  calSlug,
  name,
  email,
  userId,
  programTitle,
}) => {
  if (!open || !calUser || !calSlug) return null;

  const user = String(calUser).trim();
  const slug = String(calSlug).trim();

  const params = new URLSearchParams();
  params.set("embed", "1");
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (userId) params.set("metadata[userId]", String(userId));

  const src = `https://app.cal.com/${user}/${slug}?${params.toString()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative w-[95vw] h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm w-10 h-10 hover:bg-slate-50"
          aria-label="Close booking"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-700">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <iframe
          title={`Book a ${programTitle || "session"}`}
          src={src}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

/* ---------- MAIN TEMPLATE ---------- */

export default function ProgramTemplate({ config }) {
  const location = useLocation();
  const { user, token } = useAuth();

  const {
    categoryName = "Gentle Exercise",
    subcategoryName = "Meditation",

    heroImage,
    heroAlt,
    heroTag = "Program",
    heroTitle = subcategoryName,
    heroSubtitle = "",
    heroCtaLabel = "View & register",

    introTitle = `How can ${subcategoryName} help me?`,
    introBody = "",

    benefitsImage,
    benefitsAlt,
    benefits = [],

    facilitators = [],
    partnerPrograms = [],
    faqItems = [],
    relatedPrograms = [],
    faqImage,
    faqAlt,
  } = config || {};

  const normalizedCategoryName = normalize(categoryName);
  const isCounsellingCategory = normalizedCategoryName === "counselling";

  const loggedInUser = user || null;
  const authToken = token || null;

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [slotInfoByProgram, setSlotInfoByProgram] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [summaryByProgram, setSummaryByProgram] = useState({});
  const [slotUsageByProgram, setSlotUsageByProgram] = useState({});

  const redirectToLogin = () => {
    const redirect = encodeURIComponent(location.pathname);
    window.location.href = `/login?redirect=${redirect}`;
  };

  /* ---- load programs for this category/subcategory ---- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingPrograms(true);
        const res = await axios.get(PROGRAMS_API);
        const all = res.data || [];

        const pageCat = normalize(categoryName);
        const pageSub = normalize(subcategoryName);

        // 1) filter by category + subcategory
        const filtered = all.filter((p) => {
          const cat = normalize(p.category);
          const sub = normalize(p.subcategory);
          if (cat !== pageCat) return false;
          if (!pageSub) return true;
          return sub === pageSub;
        });

        // 2) PUBLIC VISIBILITY FILTER:
        //    - only active programs
        //    - only "upcoming" status
        const visible = filtered.filter(
          (p) => p.is_active !== false && p.status === "upcoming"
        );

        const withOccs = await Promise.all(
          visible.map(async (p) => {
            try {
              const oRes = await axios.get(
                `${PROGRAMS_API}/${p.id}/occurrences`
              );
              return { ...p, occurrences: oRes.data || [] };
            } catch {
              return { ...p, occurrences: [] };
            }
          })
        );

        setPrograms(withOccs);
        setProgramsError(null);
      } catch (err) {
        console.error("Error loading programs:", err);
        setProgramsError("Unable to load programs right now.");
      } finally {
        setLoadingPrograms(false);
      }
    };
    load();
  }, [categoryName, subcategoryName]);

  /* ---- load Cal slots for each program ---- */
  useEffect(() => {
    if (!programs || programs.length === 0) return;

    let cancelled = false;

    async function loadSlots() {
      setSlotsLoading(true);
      try {
        const results = await Promise.all(
          programs.map(async (p) => {
            if (!p.cal_event_type_id) {
              return [p.id, { dates: [], slots: [] }];
            }
            try {
              const res = await axios.get(`${CAL_SLOTS_API}/${p.id}/slots`);
              const data = res.data || {};
              return [
                p.id,
                { dates: data.dates || [], slots: data.slots || [] },
              ];
            } catch (err) {
              console.error("slots fetch failed for program", p.id, err);
              return [p.id, { dates: [], slots: [] }];
            }
          })
        );

        if (cancelled) return;

        const map = {};
        for (const [id, info] of results) {
          map[id] = info;
        }
        setSlotInfoByProgram(map);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [programs]);

  /* ---- load bookings summary for each program (protected API) ---- */
  useEffect(() => {
    if (!programs || programs.length === 0) return;

    if (isCounsellingCategory) {
      setSummaryByProgram({});
      return;
    }

    if (!authToken) {
      setSummaryByProgram({});
      return;
    }

    let cancelled = false;

    async function loadSummaries() {
      try {
        const results = await Promise.all(
          programs.map(async (p) => {
            try {
              const res = await axios.get(`${BOOKINGS_API}/${p.id}/summary`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });
              return [p.id, res.data];
            } catch (err) {
              console.error("summary fetch failed for program", p.id, err);
              return [p.id, null];
            }
          })
        );

        if (cancelled) return;

        const map = {};
        for (const [id, summary] of results) {
          map[id] = summary;
        }
        setSummaryByProgram(map);
      } catch (err) {
        console.error("Error loading summaries:", err);
      }
    }

    loadSummaries();
    return () => {
      cancelled = true;
    };
  }, [programs, authToken, isCounsellingCategory]);

  /* ---- load slot-usage (per-date capacity) for each program ---- */
  useEffect(() => {
    if (!programs || programs.length === 0) return;

    if (isCounsellingCategory) {
      setSlotUsageByProgram({});
      return;
    }

    if (!authToken) {
      setSlotUsageByProgram({});
      return;
    }

    let cancelled = false;

    async function loadSlotUsage() {
      try {
        const results = await Promise.all(
          programs.map(async (p) => {
            try {
              const res = await axios.get(
                `${BOOKINGS_API}/${p.id}/slot-usage`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              return [p.id, res.data];
            } catch (err) {
              console.error("slot-usage fetch failed for program", p.id, err);
              return [p.id, null];
            }
          })
        );

        if (cancelled) return;

        const map = {};
        for (const [id, usage] of results) {
          map[id] = usage;
        }
        setSlotUsageByProgram(map);
      } catch (err) {
        console.error("Error loading slot usage:", err);
      }
    }

    loadSlotUsage();
    return () => {
      cancelled = true;
    };
  }, [programs, authToken, isCounsellingCategory]);

  /* ---- derive full dates per program from slot-usage ---- */
  const getFullDatesForProgram = (programId) => {
    if (isCounsellingCategory) return [];

    const usage = slotUsageByProgram[programId];
    if (!usage || !Array.isArray(usage.slots)) return [];

    const perSlotCap =
      usage.capacityPerSlot != null ? Number(usage.capacityPerSlot) : null;
    if (perSlotCap == null || perSlotCap <= 0) return [];

    const dates = [];
    for (const s of usage.slots) {
      const startIso = s.eventStart || s.startTime || s.start || null;
      const booked = Number(
        s.bookedCount ?? s.count ?? s.seats ?? s.seatCount ?? 0
      );
      if (startIso && booked >= perSlotCap) {
        dates.push(startIso.substring(0, 10)); // YYYY-MM-DD
      }
    }
    return dates;
  };

  const leftPrograms = useMemo(
    () => programs.filter((p) => (p.column_index || 1) === 1),
    [programs]
  );
  const rightPrograms = useMemo(
    () => programs.filter((p) => p.column_index === 2),
    [programs]
  );

  const openBookingFor = (p) => {
    if (!loggedInUser || !authToken) {
      redirectToLogin();
      return;
    }

    const linked = !!(p?.cal_user && p?.cal_slug && p?.cal_event_type_id);
    if (!linked) return;
    setSelectedProgram(p);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedProgram(null);
  };

  const joinWaitlistFor = async (p) => {
    try {
      if (!p?.id) return;

      if (!loggedInUser || !authToken) {
        redirectToLogin();
        return;
      }

      const body = {
        programId: p.id,
        memberId: loggedInUser?.id || null,
        name: loggedInUser?.fullName || loggedInUser?.name || null,
        email: loggedInUser?.email || null,
      };

      const res = await axios.post(`${WAITLIST_API}/join`, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = res.data || {};

      if (data.alreadyBooked) {
        window.alert("You already have a booking for this program.");
      } else if (data.existing) {
        window.alert("You are already on the waitlist for this program.");
      } else {
        window.alert("You have been added to the waitlist for this program.");
      }
    } catch (err) {
      console.error("Waitlist join failed:", err);
      window.alert("Sorry, we could not add you to the waitlist right now.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="program-title"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt={heroAlt || heroTitle}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <HeroPill>{heroTag}</HeroPill>
            <h1
              id="program-title"
              className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-3 max-w-xl text-white/90">{heroSubtitle}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {heroCtaLabel}
              </a>
              <Link
                to="/programs"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-white/90 text-gray-900 hover:bg-white"
              >
                Explore other programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl gap-10 px-4 py-12 sm:grid sm:grid-cols-2">
        <h2 className="text-2xl font-semibold">{introTitle}</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">{introBody}</p>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <Card className="p-6 md:p-8">
            <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
              {benefitsImage && (
                <img
                  src={benefitsImage}
                  alt={benefitsAlt || "Program illustration"}
                  className="h-64 w-full rounded-xl object-cover md:h-full"
                />
              )}
              <div>
                <h3 className="text-2xl font-semibold">
                  Potential benefits of {subcategoryName}
                </h3>
                <ul className="mt-4 grid gap-4">
                  {benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      {b.icon && (
                        <span className="mt-0.5 shrink-0">{b.icon}</span>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{b.title}</p>
                        <p className="text-sm text-gray-600">{b.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Facilitators */}
      {facilitators.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h3 className="text-2xl font-semibold">Meet your facilitators</h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Get to know the compassionate experts who lead our programs.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {facilitators.map((f, i) => (
              <Card key={i} className="overflow-hidden">
                {f.img && (
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="bg-emerald-50 px-5 py-4">
                  <p className="font-semibold text-emerald-900">{f.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* PROGRAM CARDS */}
      <section
        id="programs"
        className="max-w-6xl mx-auto px-4 py-10 scroll-mt-24"
      >
        <SectionTitle
          title={
            isCounsellingCategory
              ? "Counselling options available"
              : `${subcategoryName} programs for the cancer community`
          }
        />

        {!loggedInUser && (
          <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
            Please log in to register or join a waitlist. You’ll be redirected
            to the login page if you click a booking button.
          </p>
        )}

        {loadingPrograms && (
          <p className="mt-4 text-gray-500 text-sm">Loading programs…</p>
        )}

        {programsError && (
          <p className="mt-4 text-red-600 text-sm">{programsError}</p>
        )}

        {!loadingPrograms && !programsError && (
          <>
            {slotsLoading && (
              <p className="mt-2 text-xs text-gray-400">
                Updating dates from Cal…
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {leftPrograms.map((p) => {
                  const linked = !!(
                    p.cal_user &&
                    p.cal_slug &&
                    p.cal_event_type_id
                  );
                  const slotInfo = slotInfoByProgram[p.id] || {
                    dates: [],
                    slots: [],
                  };

                  const fullDates = isCounsellingCategory
                    ? []
                    : getFullDatesForProgram(p.id);

                  const calDates = slotInfo.dates || [];
                  const occDates = (p.occurrences || [])
                    .map((o) => (o.starts_at || "").substring(0, 10))
                    .filter(Boolean);

                  const allDates = calDates.length > 0 ? calDates : occDates;
                  const fullSet = new Set(fullDates);

                  const hasBookableDate = allDates.some(
                    (d) => !fullSet.has(d)
                  );

                  const isUiFull =
                    !isCounsellingCategory &&
                    linked &&
                    allDates.length > 0 &&
                    !hasBookableDate;

                  return (
                    <ProgramCard
                      key={p.id}
                      p={p}
                      linked={linked}
                      onRegister={openBookingFor}
                      calDates={slotInfo.dates}
                      isFull={isUiFull}
                      onJoinWaitlist={
                        isCounsellingCategory ? undefined : joinWaitlistFor
                      }
                      fullDates={fullDates}
                      mode={isCounsellingCategory ? "counselling" : "default"}
                    />
                  );
                })}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {rightPrograms.map((p) => {
                  const linked = !!(
                    p.cal_user &&
                    p.cal_slug &&
                    p.cal_event_type_id
                  );
                  const slotInfo = slotInfoByProgram[p.id] || {
                    dates: [],
                    slots: [],
                  };

                  const fullDates = isCounsellingCategory
                    ? []
                    : getFullDatesForProgram(p.id);

                  const calDates = slotInfo.dates || [];
                  const occDates = (p.occurrences || [])
                    .map((o) => (o.starts_at || "").substring(0, 10))
                    .filter(Boolean);

                  const allDates = calDates.length > 0 ? calDates : occDates;
                  const fullSet = new Set(fullDates);
                  const hasBookableDate = allDates.some(
                    (d) => !fullSet.has(d)
                  );
                  const isUiFull =
                    !isCounsellingCategory &&
                    linked &&
                    allDates.length > 0 &&
                    !hasBookableDate;

                  return (
                    <ProgramCard
                      key={p.id}
                      p={p}
                      linked={linked}
                      onRegister={openBookingFor}
                      calDates={slotInfo.dates}
                      isFull={isUiFull}
                      onJoinWaitlist={
                        isCounsellingCategory ? undefined : joinWaitlistFor
                      }
                      fullDates={fullDates}
                      mode={isCounsellingCategory ? "counselling" : "default"}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Partner programs */}
    

      {/* FAQ */}
{faqItems.length > 0 && (
  <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
    {faqImage && (
      <img
        src={faqImage}
        alt={faqAlt || "Program illustration"}
        className="h-96 w-full rounded-2xl object-cover"
      />
    )}

    <div>
      <h3 className="text-2xl font-semibold">
        Frequently Asked Questions
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Answers to common questions about {subcategoryName.toLowerCase()}.
      </p>

      <div className="mt-6 divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white">
        {faqItems.map((item, i) => (
          <details
            key={i}
            className="group"
            open={i === 0} // first one open by default (optional)
          >
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-gray-900">
              <span>{item.title}</span>
              <span className="ml-4 text-gray-400 group-open:hidden">+</span>
              <span className="ml-4 text-gray-400 hidden group-open:inline">
                –
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600">
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
)}


      {/* Related programs */}
      {relatedPrograms.length > 0 && (
        <section className="bg-amber-500/10 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h3 className="text-center text-xl font-semibold text-amber-900">
              You May Also Like
            </h3>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {relatedPrograms.map((r, i) => (
                <Card key={i} className="overflow-hidden">
                  {r.img && (
                    <img
                      src={r.img}
                      alt={r.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="space-y-2 p-5">
                    <p className="text-lg font-semibold">{r.title}</p>
                    {r.copy && (
                      <p className="text-sm text-gray-600">{r.copy}</p>
                    )}
                    {r.to && (
                      <Link
                        to={r.to}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50"
                      >
                        Learn more
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <CalBookingModal
        open={isBookingOpen}
        onClose={closeBooking}
        calUser={selectedProgram?.cal_user}
        calSlug={selectedProgram?.cal_slug}
        name={loggedInUser?.fullName || loggedInUser?.name}
        email={loggedInUser?.email}
        userId={loggedInUser?.id}
        programTitle={selectedProgram?.title}
      />
    </main>
  );
}
