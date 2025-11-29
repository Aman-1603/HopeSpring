// src/components/Pages/GetFreeSupport/Programs/Support_group.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * API base – works for:
 * - Vite:   VITE_API_BASE_URL
 * - CRA:    REACT_APP_API_BASE_URL
 * - Fallback: same-origin (empty string)
 */
const API_BASE =
  import.meta.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "";

/** ---------- small atoms ---------- */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-3 py-1">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 6l-11 11-5-5" stroke="currentColor" strokeWidth="2" />
    </svg>
    {children}
  </span>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-[12px] font-semibold px-3 py-1">
    {children}
  </span>
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

/** Format helpers */
const fmtMonthDay = (isoOrYmd) => {
  try {
    // Handle both full ISO and "YYYY-MM-DD"
    const val =
      isoOrYmd && isoOrYmd.length === 10
        ? `${isoOrYmd}T00:00:00`
        : isoOrYmd;
    const d = new Date(val);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoOrYmd;
  }
};

/** ---------- Program card ---------- */
const ProgramCard = ({ p, linked, onRegister, calDates = [] }) => {
  const occs = p.occurrences || [];

  const hasCalDates = calDates && calDates.length > 0;
  const showCalDates = hasCalDates ? calDates.slice(0, 4) : [];
  const showOccs = !hasCalDates ? occs.slice(0, 4) : [];

  const moreCount = hasCalDates
    ? calDates.length - showCalDates.length
    : occs.length - showOccs.length;

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

      {/* date pills – now driven by Cal slots, fallback to occurrences */}
      {(hasCalDates || occs.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hasCalDates
            ? showCalDates.map((d) => (
                <Pill key={d}>{fmtMonthDay(d)}</Pill>
              ))
            : showOccs.map((o) => (
                <Pill key={o.id}>{fmtMonthDay(o.starts_at)}</Pill>
              ))}
          {moreCount > 0 && <Pill>+ {moreCount} more</Pill>}
        </div>
      )}

      {!linked ? (
        <button
          type="button"
          disabled
          className="mt-4 inline-block rounded-lg bg-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold cursor-not-allowed"
        >
          Not yet open
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onRegister(p)}
          className="mt-4 inline-block rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
        >
          Register here
        </button>
      )}
    </article>
  );
};

/** ---------- Facilitator card ---------- */
const FacilitatorCard = ({
  name,
  img = "/images/facilitators/placeholder.jpg",
}) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div className="aspect-[1/1] w-full bg-gray-100">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 text-center">
        <p className="font-semibold text-[#0b1c33]">{name}</p>
      </div>
    </div>
  );
};

/** ---------- FAQ ---------- */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-[#0b1c33]">{q}</span>
        <svg
          className={`w-5 h-5 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden pb-4 text-gray-600">{a}</div>
      </div>
    </div>
  );
};

/** ---------- Cal booking modal (iframe only) ---------- */
const CalBookingModal = ({ open, onClose, calUser, calSlug, name, email }) => {
  if (!open || !calUser || !calSlug) return null;

  const user = String(calUser).trim();
  const slug = String(calSlug).trim();

  const params = new URLSearchParams();
  params.set("embed", "1");
  if (name) params.set("name", name);
  if (email) params.set("email", email);

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
          title="Book a support group session"
          src={src}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default function SupportGroups() {
  const benefits = [
    {
      title: "Mental health support",
      text:
        "Emotional and mental well-being are vital parts of the cancer journey. Our support groups provide a safe, confidential space facilitated by trained professionals.",
    },
    {
      title: "A beacon of hope",
      text:
        "Through shared stories and lived experiences, members remind each other to regain a sense of control and resilience during the cancer journey.",
    },
    {
      title: "Spark a connection",
      text:
        "Whether in-person or remote, our groups help form bonds that carry beyond the session. We celebrate wins and provide a safe and welcoming place whenever you need to connect.",
    },
  ];

  const facilitators = [
    { name: "Barbara", img: "/images/facilitators/barbara.png" },
    { name: "Christine", img: "/images/facilitators/christina.png" },
    { name: "Suzy", img: "/images/facilitators/suzy.png" },
    { name: "Tammy", img: "/images/facilitators/Tammy.png" },
  ];

  const faqs = [
    {
      q: "Do I need to be a HopeSpring member?",
      a:
        "No cost to join groups. Registration helps us send reminders and secure meeting links. Membership is free and open to everyone affected by cancer.",
    },
    {
      q: "Are groups virtual or in-person?",
      a:
        "Both options are available. Many programs offer remote sessions for flexibility. Check the calendar for exact format, dates, and times.",
    },
    {
      q: "Is what I share confidential?",
      a:
        "Yes. Our groups follow confidentiality guidelines. We create a respectful, non-judgmental environment so everyone can feel safe to participate.",
    },
  ];

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // NEW: map of Cal dates/slots by program id
  const [slotDatesByProgram, setSlotDatesByProgram] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hsUser");
      if (!raw) return;
      setLoggedInUser(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse hsUser from localStorage", e);
    }
  }, []);

  const fetchSupportGroups = async () => {
    try {
      setLoadingPrograms(true);

      const res = await fetch(`${API_BASE}/api/programs/support-groups`);
      if (!res.ok) throw new Error("Failed to fetch support groups");
      const basePrograms = await res.json();

      const withOccs = await Promise.all(
        basePrograms.map(async (p) => {
          try {
            const oRes = await fetch(
              `${API_BASE}/api/programs/${p.id}/occurrences`
            );
            if (!oRes.ok) return { ...p, occurrences: [] };
            const occs = await oRes.json();
            return { ...p, occurrences: occs };
          } catch {
            return { ...p, occurrences: [] };
          }
        })
      );

      setPrograms(withOccs);
      setProgramsError(null);
    } catch (e) {
      console.error(e);
      setProgramsError("Unable to load support group programs right now.");
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    fetchSupportGroups();
  }, []);

  // NEW: whenever programs change, fetch Cal slots for each
  useEffect(() => {
    if (!programs || programs.length === 0) return;

    let cancelled = false;

    async function loadSlots() {
      setSlotsLoading(true);
      try {
        const results = await Promise.all(
          programs.map(async (p) => {
            // only bother if program is linked to Cal
            if (!p.cal_event_type_id) {
              return [p.id, { dates: [], slots: [] }];
            }

            try {
              const res = await fetch(
                `${API_BASE}/api/cal/programs/${p.id}/slots`
              );
              if (!res.ok) {
                console.error("Failed slots res for program", p.id, res.status);
                return [p.id, { dates: [], slots: [] }];
              }
              const data = await res.json();
              const dates = data?.dates || [];
              const slots = data?.slots || [];
              return [p.id, { dates, slots }];
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
        setSlotDatesByProgram(map);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [programs]);

  const leftPrograms = useMemo(
    () => programs.filter((p) => p.column_index === 1),
    [programs]
  );
  const rightPrograms = useMemo(
    () => programs.filter((p) => p.column_index === 2),
    [programs]
  );

  // Open booking modal – Cal handles availability/date itself
  const openBookingFor = (p) => {
    const linked = !!(p?.cal_user && p?.cal_slug && p?.cal_event_type_id);
    if (!linked) return;

    setSelectedProgram(p);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedProgram(null);
  };

  return (
    <div className="pb-1">
      {/* HERO */}
      <section className="relative min-h-[320px] md:min-h-[380px]">
        <img
          src="/images/support-group-banner.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-xl text-white">
            <p className="uppercase tracking-wide text-[12px] opacity-90">
              Programs
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Support Groups
            </h1>
            <p className="mt-3 text-white/90">
              Free, professionally facilitated groups for patients, survivors,
              and caregivers. Connect with others, share experiences, and build
              resilience — at any stage of the cancer journey.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO BAND */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
          <div>
            <SectionTitle
              title="Free Support for Cancer Patients, survivors, and Caregivers Guiding Any Step of the Journey"
              desc=""
            />
          </div>
          <div className="text-gray-700 leading-relaxed">
            Each of our support groups is facilitated by trained professionals,
            focusing on connection, education, and practical tools for
            navigating the cancer experience.
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div>
          <SectionTitle
            title="How Support Groups May Help"
            desc="We recognize that each individual’s journey with cancer is unique. Our support groups aim to provide:"
          />
          <div className="mt-4 space-y-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-gray-200 p-4"
              >
                <p className="font-semibold text-[#0b1c33]">{b.title}</p>
                <p className="text-gray-700 text-[15px] mt-1">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="/images/support-group-benefits.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* FACILITATORS */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle
          title="Meet your facilitators"
          desc="Get to know the experienced experts behind our programs."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {facilitators.map((f) => (
            <FacilitatorCard key={f.name} {...f} />
          ))}
        </div>
      </section>

      {/* PROGRAM CARDS (DYNAMIC) */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle
          title="Support Groups Programs For The Cancer Community"
          desc=""
        />

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
              <div className="space-y-4">
                {leftPrograms.map((p) => {
                  const linked = !!(
                    p.cal_user &&
                    p.cal_slug &&
                    p.cal_event_type_id
                  );
                  const calInfo = slotDatesByProgram[p.id] || {
                    dates: [],
                    slots: [],
                  };
                  return (
                    <ProgramCard
                      key={p.id}
                      p={p}
                      linked={linked}
                      onRegister={openBookingFor}
                      calDates={calInfo.dates}
                    />
                  );
                })}
              </div>

              <div className="space-y-4">
                {rightPrograms.map((p) => {
                  const linked = !!(
                    p.cal_user &&
                    p.cal_slug &&
                    p.cal_event_type_id
                  );
                  const calInfo = slotDatesByProgram[p.id] || {
                    dates: [],
                    slots: [],
                  };
                  return (
                    <ProgramCard
                      key={p.id}
                      p={p}
                      linked={linked}
                      onRegister={openBookingFor}
                      calDates={calInfo.dates}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={fetchSupportGroups}
            className="text-xs px-3 py-2 border rounded-xl bg-gray-50 hover:bg-gray-100"
          >
            Refresh programs
          </button>
        </div>
      </section>

      {/* VIDEO FEATURE */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl overflow-hidden shadow-md bg-black aspect-video">
          <iframe
            className="w-full h-full"
            title="HopeSpring Support Groups"
            src="https://www.youtube.com/embed/w4MC1_rSNfA"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-[#0b1c33]">What to expect</h3>
          <p className="text-gray-700 mt-2 leading-relaxed">
            Expect a supportive and compassionate environment where you can
            share at your own pace.
          </p>
          <Link
            to="/support/calendar"
            className="mt-4 inline-block rounded-lg bg-[#0e2340] text-white px-5 py-3 font-semibold w-fit shadow-sm hover:brightness-110"
          >
            View calendar & register
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="/images/faq-support.png"
            alt="Person receiving support"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <SectionTitle title="Frequently Asked Questions" />
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 divide-y divide-gray-100">
            {faqs.map((f) => (
              <FAQItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="bg-[#ff8a00]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h3 className="text-white font-bold text-xl mb-4">
            You May Also Like
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Cancer Care Counselling",
                img: "/images/Cancer-care-counselling-suggestion.png",
                to: "/book/cancer-care-counselling",
              },
              {
                title: "Reiki",
                img: "/images/reiki-suggestion.png",
                to: "/support/programs/relaxation/reiki",
              },
              {
                title: "Yoga",
                img: "/images/yoga-suggestion.png",
                to: "/support/programs/gentle-exercise/yoga",
              },
            ].map((x) => (
              <Link
                to={x.to}
                key={x.title}
                className="rounded-2xl overflow-hidden bg-white/90 border border-white/50 hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img
                    src={x.img}
                    alt={x.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#0b1c33]">{x.title}</p>
                  <span className="mt-2 inline-block text-[#0e2340] font-semibold text-sm">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* booking modal */}
      <CalBookingModal
        open={isBookingOpen}
        onClose={closeBooking}
        calUser={selectedProgram?.cal_user}
        calSlug={selectedProgram?.cal_slug}
        name={loggedInUser?.name}
        email={loggedInUser?.email}
      />
    </div>
  );
}
