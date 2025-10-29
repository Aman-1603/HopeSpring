import React, { useMemo, useState } from "react";

const SECTIONS = [
  {
    title: "Regional Services",
    rows: [
      {
        name: "Artline Salon",
        description:
          "Salon in Kitchener offering a wide range of hair services including head shaving, colouring, hair accessories and more.",
        phone: "519-585-0230",
        email: "hair@artlinesalon.com",
        website: "https://artlinesalon.com/",
      },
      {
        name: "AsEllyn",
        description:
          "Creative services and support (workshops, projects and events).",
        phone: "519-574-2196",
        email: "ellyn@lyndallprojects.com",
        website: "https://lyndallprojects.com/",
      },
      {
        name:
          "Canadian Cancer Society Waterloo Region Chapter – Wheels of Hope Transportation Program",
        description:
          "Volunteer drivers donate their time and use their own cars to help people with cancer get to their appointments.",
        phone: "519-886-8888",
        email: "waterloo@ontario.cancer.ca",
        website: "https://cancer.ca/",
      },
      {
        name:
          "Canadian Mental Health Association Waterloo Wellington (CMHA) – Here 24/7",
        description:
          "24/7 crisis, mental-health and addictions support across Waterloo-Wellington. One intake line for 11 partner agencies.",
        phone: "1-844-437-3247",
        email: "CAfeedback@cmhaww.ca",
        website: "https://here247.ca/",
      },
      {
        name: "Hospice Waterloo Region",
        description:
          "Programs and services that support individuals and their families through end-of-life journeys.",
        phone: "519-743-4114",
        email: "hospice@hospicewaterloo.ca",
        website: "https://www.hospicewaterloo.ca/",
      },
      {
        name: "Hospice Wellington (Guelph)",
        description:
          "Support for individuals in Guelph/Wellington County who are living with a life-limiting illness, including grief and bereavement programs.",
        phone: "519-836-3921",
        email: "info@hospicewellington.org",
        website: "https://www.hospicewellington.org/",
      },
      {
        name: "Innisfree Hospice (Kitchener)",
        description: "Palliative care and family support.",
        phone: "519-208-5055",
        website: "https://www.homewoodhealth.com/locations/innisfree-house",
      },
      {
        name: "Lisaard Hospice (Cambridge)",
        description:
          "Hospice in Cambridge providing palliative care and support for the community.",
        phone: "519-650-1121",
        website: "https://www.lisaardandinnisfree.com/",
      },
      {
        name: "Look Good Feel Better",
        description:
          "Workshops that help people with cancer manage appearance-related effects of treatment.",
        phone: "647-776-5111",
        email: "news@lgfb.ca",
        website: "https://lgfb.ca/",
      },
      {
        name: "Ontario Breast Screening Clinics (OBSP) – Cancer Care Ontario",
        description:
          "Comprehensive map and booking information for breast screening locations across Ontario.",
        website:
          "https://www.cancercareontario.ca/en/cancer-care-ontario/programs/screening/breast-screening/locations",
      },
      {
        name: "Ontario Caregiver Organization",
        description:
          "Programs, 24/7 helpline, and resources to support caregivers.",
        phone: "1-833-416-2273",
        email: "info@ontariocaregiver.ca",
        website: "https://ontariocaregiver.ca/",
      },
      {
        name: "Ontario Health at Home (Waterloo-Wellington)",
        description:
          "Coordinates local home and community care, long-term care placement and system navigation.",
        phone: "310-2222",
        website:
          "https://healthcareathome.ca/centralwest/en/Contact-Us/ontario-health-at-home",
      },
      {
        name:
          "Ontario Parents Advocating for Children with Cancer (OPACC)",
        description: "Support and advocacy for families of children with cancer.",
        phone: "705-828-7965",
        email: "info@opacc.org",
        website: "https://opacc.org/",
      },
      {
        name:
          "Prostate Cancer Support Group Waterloo-Wellington",
        description:
          "Volunteer group offering monthly support meetings and resources for those living with prostate cancer in the region.",
        phone: "226-240-0264",
        email: "info@pcsg-waterloo-wellington.ca",
        website: "https://pcsg-waterloo-wellington.ca/",
      },
      {
        name: "Rethink Breast Cancer",
        description: "Education, community and support for young people with breast cancer.",
        phone: "1-416-220-0700",
        email: "hello@rethinkbreastcancer.com",
        website: "https://rethinkbreastcancer.com/",
      },
      {
        name: "The Waterloo Region Myeloma Support Group",
        description:
          "Support and information for people newly diagnosed or living with myeloma, and their families.",
        email: "waterlooregionsupport@myloma.ca",
      },
      {
        name: "TorchLight",
        description:
          "24/7 telephone support and listening service for individuals and caregivers.",
        phone: [
          "519-821-3761",
          "519-821-3760",
          "1-888-821-3760",
          "519-415-3764",
          "519-837-5469",
          "519-767-2654",
        ].join(" · "),
        website: "https://torchlightcanada.org/",
      },
      {
        name:
          "Waterloo Wellington Self-Management Program (WWSMP)",
        description:
          "Self-management programs for people living with or at risk of chronic disease; training for providers.",
        phone: "1-866-337-3318",
        email: "selfmanagement@langs.org",
        website: "https://www.wwselfmanagement.ca/",
      },
      {
        name:
          "Woolwich Community Health Centre – Wellesley Hospice (St. Jacobs)",
        description: "Community-based hospice supports in Wellesley and area.",
        phone: "519-664-3794",
        website: "https://www.wchc.on.ca/",
      },
    ],
  },

  // ----- create more sections reusing the same structure -----
  {
    title: "Counselling",
    rows: [
      {
        name: "Cancer Care Counselling (HopeSpring)",
        description: "Free counselling for individuals and families.",
        website: "/book/cancer-care-counselling",
      },
      {
        name: "Here 24/7 – Crisis Line",
        description: "24/7 intake for mental-health and addictions support.",
        phone: "1-844-437-3247",
        website: "https://here247.ca/",
      },
    ],
  },
    {
    title: "Counselling",
    rows: [
      {
        name: "Cancer Care Counselling (HopeSpring)",
        description: "Free counselling for individuals and families.",
        website: "/book/cancer-care-counselling",
      },
      {
        name: "Here 24/7 – Crisis Line",
        description: "24/7 intake for mental-health and addictions support.",
        phone: "1-844-437-3247",
        website: "https://here247.ca/",
      },
    ],
  }

  // Add all the other sections from your screenshot the same way…
];



export default function Resources() {
  const [open, setOpen] = useState(() => new Set([0])); // open first section by default
  const [q, setQ] = useState("");

  // Text filter (matches section titles or any cell text)
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SECTIONS;
    return SECTIONS.map((sec) => {
      const rows = sec.rows.filter((r) =>
        [sec.title, r.name, r.description, r.phone, r.email, r.website]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
      return rows.length ? { ...sec, rows } : null;
    }).filter(Boolean);
  }, [q]);

  const toggle = (i) => {
    const next = new Set(open);
    next.has(i) ? next.delete(i) : next.add(i);
    setOpen(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c33]">
            Resources
          </h1>
          <p className="text-gray-600 mt-1">
            Browse local, regional, and provincial resources. Click a section to expand.
          </p>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search resources…"
          className="h-11 w-full sm:w-72 rounded-xl border px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0e2340]/30"
        />
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-3">
        {filtered.map((sec, i) => {
          const isOpen = open.has(i);
          return (
            <div key={sec.title} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {/* Section header */}
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#fff7ef] hover:bg-[#fff1df]/80"
              >
                <span className="font-semibold text-[#0b1c33]">{sec.title}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              {/* Table */}
              <div className={`${isOpen ? "block" : "hidden"}`}>
                <ResourceTable rows={sec.rows} />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-gray-600">No resources matched your search.</p>
        )}
      </div>
    </div>
  );
}

/* ================== UI: Table for a section ================== */
function ResourceTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="min-w-[720px] grid grid-cols-[1.2fr_2fr_1.2fr] border-t border-gray-200 bg-gray-50 text-sm font-semibold text-[#0b1c33]">
        <div className="px-4 py-3 border-r border-gray-200">Regional Service</div>
        <div className="px-4 py-3 border-r border-gray-200">Description</div>
        <div className="px-4 py-3">Contact information</div>
      </div>

      {/* Rows */}
      <div className="min-w-[720px] divide-y divide-gray-200">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[1.2fr_2fr_1.2fr] text-sm ${
              idx % 2 ? "bg-gray-50/60" : "bg-white"
            }`}
          >
            {/* name */}
            <div className="px-4 py-4 border-r border-gray-100">
              {r.website ? (
                <a
                  href={r.website}
                  target={r.website.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-[#0e2340] font-medium hover:underline"
                  title={r.website}
                >
                  {r.name}
                </a>
              ) : (
                <span className="text-[#0e2340] font-medium">{r.name}</span>
              )}
            </div>

            {/* description */}
            <div className="px-4 py-4 border-r border-gray-100 text-gray-700">
              {r.description || "—"}
            </div>

            {/* contact */}
            <div className="px-4 py-4 space-y-1">
              {r.phone && <div className="text-[#0b1c33]">{r.phone}</div>}
              {r.email && (
                <div>
                  <a className="hover:underline" href={`mailto:${r.email}`}>
                    {r.email}
                  </a>
                </div>
              )}
              {r.website && (
                <div>
                  <a
                    className="hover:underline"
                    href={r.website}
                    target={r.website.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {prettyUrl(r.website)}
                  </a>
                </div>
              )}
              {!r.phone && !r.email && !r.website && <div className="text-gray-400">—</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function prettyUrl(url) {
  try {
    if (!url.startsWith("http")) return url;
    const u = new URL(url);
    return u.hostname.replace("www.", "") + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return url;
  }
}
