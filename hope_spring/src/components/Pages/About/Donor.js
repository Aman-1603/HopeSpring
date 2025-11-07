import React from "react";

/* Helper: simple logo grid */
function LogoGrid({ items }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 place-items-center gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((src, i) => (
        <div key={i} className="flex h-16 w-40 items-center justify-center md:h-18 md:w-48">
          {/* Keep images natural (no forced bg). Use max sizes so mixed logos look tidy */}
          <img
            src={src}
            alt="Sponsor / Partner logo"
            className="max-h-16 w-auto object-contain md:max-h-20"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

/* ---- Replace the URLs below with your real logo assets ---- */
const logos = {
  counselling: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Cambridge+CF",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Resilient+Communities",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=TMMC",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Pfizer",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Merck",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=George+Lunan+Foundation",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=FedEx+Cares",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Woolwich+Township",
  ],
  gentleExercise: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=City+of+Kitchener",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=City+of+Waterloo",
  ],
  generalGifts: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Dan+%26+Judy+Kretsch+Fund",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=TD+Charitable+Foundation",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Gordon+Linkletter+Family+Fund",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=W+Brewer+%26+Sons",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=TD+Wealth+Private+Giving",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=ACTIVIA",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Gina%27s+Closet",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=WR+Community+Foundation",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Catholic+Women%27s+League",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=WR+CF+Harding+Family+Fund",
  ],
  supportGroups: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=JF+Bickel+Foundation",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=CIBC",
  ],
  wigs: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Zonta+KW",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=TMMC",
  ],
  partnerships: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Med+Robot",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Rebuild+Physio",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Ctrl",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=KW+Titans",
  ],
  other: [
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Region+of+Waterloo",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=GC+Surplus",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Canadian+Red+Cross",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Gov+of+Canada",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=City+of+Kitchener",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Community+Foundations+of+Canada",
    "https://dummyimage.com/360x120/ffffff/1c1c1c&text=Rexall",
  ],
};

const Section = ({ title, items }) => (
  <section className="py-8">
    <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
      {title}
    </h3>
    <LogoGrid items={items} />
    <div className="mx-auto mt-10 max-w-6xl border-t border-gray-200" />
  </section>
);

export default function DonorPartners() {
  return (
    <main className="text-gray-900">
      {/* Page Title */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold"></h1>
      </header>

      {/* Intro + headline */}
      <section className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-xl font-extrabold">Donor wall of fame</h2>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-gray-600">
          We are grateful for the support of our trusted partners who share our vision of
          empowering lives affected by cancer. Together, we create a network of care and compassion.
        </p>
      </section>

      {/* Sections */}
      <div className="px-4">
        <Section title="Counselling" items={logos.counselling} />
        <Section title="Gentle Exercise" items={logos.gentleExercise} />
        <Section title="General Unsolicited Donations" items={logos.generalGifts} />
        <Section title="Support Groups" items={logos.supportGroups} />
        <Section title="Wigs" items={logos.wigs} />
        <Section title="Partnerships" items={logos.partnerships} />
        <Section title="Other" items={logos.other} />
      </div>

      {/* Optional: CTA to become a partner/sponsor */}
      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h3 className="text-lg font-extrabold">Become a partner</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-700">
          Interested in supporting HopeSpring as a corporate or community partner?
          We’d love to speak with you about recognition and impact opportunities.
        </p>
        <a
          href="/contact"
          className="mt-4 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Contact our team
        </a>
      </section>
    </main>
  );
}
