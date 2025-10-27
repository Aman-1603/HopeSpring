import React from "react";
import { Link } from "react-router-dom";

export default function ProviderPartner() {
  const accordions = [
    {
      title: "Patient and Healthcare Provider Resources",
      body:
        "Quick-reference sheets, referral info, and program overviews you can share with your patients and teams. We help patients access emotional, physical, and practical support at no cost.",
    },
    {
      title: "HopeSpring’s Partnership Programs & Services in the Community",
      body:
        "We collaborate with hospitals, clinics, and community agencies to deliver programs on-site or virtually—support groups, relaxation, gentle exercise, and coping resources.",
    },
    {
      title: "Become a Community Partner",
      body:
        "Let’s explore co-branded programming, information sessions, and referral pathways that make it easier for patients and families to get timely support.",
    },
    {
      title: "Speaking and Engagement",
      body:
        "We offer education for clinical teams and the public on caregiver support, coping strategies, survivorship, and wellness resources. Invite us to your rounds, fairs, or workshops.",
    },
  ];

  const bullets = [
    { icon: "💛", text: "Collaborative care planning and referrals" },
    { icon: "📚", text: "Joint educational workshops" },
    { icon: "🤝", text: "Community outreach programs" },
    { icon: "🧑‍⚕️", text: "Support and counselling services for your patients" },
  ];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            {/* Optional hero artwork; place your asset at /public/images/ribbon-hero.png */}
            <img
              src="/images/ribbon-hero.png"
              alt=""
              className="w-[520px] max-w-full mb-6"
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0b1c33]">
              I am a healthcare provider or community partner – Category
            </h1>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-start">
          <div>
            {/* Replace with your photo: /public/images/hope-lawn.jpg */}
            <img
              src="/images/hope-lawn.jpg"
              alt="HopeSpring community"
              className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Getting started with HopeSpring is easy
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We offer free, comprehensive programs and services that complement clinical care.
              Together with providers and community partners, we help patients and families access
              counselling, group support, relaxation, and practical resources across Waterloo Region
              and beyond.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/support/calendar"
                className="rounded-xl bg-[#22c55e] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Start here
              </Link>
              <Link
                to="/contact-us"
                className="rounded-xl bg-[#0b1c33] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP (accordion) */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-lg md:text-xl font-semibold text-[#0b1c33]">
            Guiding the patient journey
          </h3>

          <div className="mt-4 space-y-3">
            {accordions.map((item) => (
              <details key={item.title} className="group border rounded-lg overflow-hidden bg-white">
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-[#0b1c33]">
                  <span className="font-medium">{item.title}</span>
                  <svg
                    className="h-5 w-5 transition-transform group-open:rotate-45"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-700">{item.body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ENGAGEMENT BAND */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
          {/* Replace with your event photo: /public/images/partner-tent.jpg */}
          <img
            src="/images/partner-tent.jpg"
            alt="Community engagement"
            className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
          />

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b1c33] mb-4">
              Some ways we engage with our health network
            </h3>
            <ul className="grid gap-3">
              {bullets.map((b, i) => (
                <li key={i} className="rounded-xl border bg-white p-4 flex items-start gap-3 shadow-sm">
                  <div className="text-xl leading-none">{b.icon}</div>
                  <div className="text-[#0b1c33]">{b.text}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-[#0b1c33]">Our Approach</h4>
            <p className="mt-2 text-gray-700">
              We prioritize collaboration and communication with healthcare providers and community
              partners to ensure a supportive system for those affected by cancer. Our goal is to
              enhance the overall care experience for patients and families by adding accessible,
              no-cost programming alongside clinical care.
            </p>
          </div>

          {/* Replace with your asset: /public/images/hands-flower.jpg */}
          <img
            src="/images/hands-flower.jpg"
            alt="Supportive care"
            className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
          />
        </div>
      </section>
    </div>
  );
}
