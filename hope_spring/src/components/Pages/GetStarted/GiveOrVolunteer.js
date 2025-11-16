import React from "react";
import { Link } from "react-router-dom";

export default function GiveOrVolunteer() {
  const accordions = [
    {
      title: "Volunteer Opportunities",
      body:
        "From front-desk hospitality and program support to events, outreach, and professional skills-based projects—there’s a place for everyone. Tell us your interests and availability and we’ll match you with a meaningful role.",
    },
    {
      title: "Student Placements",
      body:
        "We host students for practicum/placement hours in counselling, community work, events, and communications. Get real-world experience supporting those affected by cancer.",
    },
    {
      title: "How You Can Donate",
      body:
        "Monthly or one-time gifts, employer matching, and tribute gifts all help us keep programs free. We also accept in-kind donations for select initiatives.",
    },
    {
      title: "Other Ways to Give",
      body:
        "Host a fundraiser, sponsor a program, leave a legacy gift, or ask your company about community partnerships. Your support expands care across our region.",
    },
  ];

  const reasons = [
    { icon: "💛", text: "Support our ability to provide comprehensive care and resources to cancer patients and their families" },
    { icon: "🌱", text: "Maintain and expand our programs" },
    { icon: "🫶", text: "Ensure continued support for those in need" },
    { icon: "✨", text: "Help create a positive impact" },
  ];

  const chips = [
    "Those with cancer",
    "Survivors",
    "Post cancer",
    "Children",
    "Family",
    "Caregivers",
    "Medical partners",
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            {/* optional ribbon artwork; replace with your asset */}
            <img
              src="/images/ribbon-hero.png"
              alt=""
              className="w-[520px] max-w-full mb-6"
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0b1c33]">
              I want to give or volunteer – category
            </h1>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-start">
          <img
            src="/images/s1.png"
            alt="HopeSpring community"
            className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
          />

          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Welcome donors and volunteers
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              At HopeSpring Cancer Support Centre, every donation and every hour of
              volunteer work makes an immeasurable difference. Your generosity helps
              us provide essential support, resources, and comfort—free of charge—
              for individuals and families facing cancer.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/donate"
                className="rounded-xl bg-[#22c55e] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Donate
              </Link>
              <Link
                to="/volunteer"
                className="rounded-xl bg-[#0b1c33] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACCORDIONS */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-lg md:text-xl font-semibold text-[#0b1c33]">
            You can change lives
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

      {/* IMPACT BAND */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
          {/* Replace with your group photo: /public/images/volunteer-group.jpg */}
          <img
            src="/images/volunteer-one.png"
            alt="Volunteers"
            className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
          />

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b1c33] mb-4">
              Empowering individuals affected by cancer
            </h3>
            <ul className="grid gap-3">
              {reasons.map((r, i) => (
                <li
                  key={i}
                  className="rounded-xl border bg-white p-4 flex items-start gap-3 shadow-sm"
                >
                  <div className="text-xl leading-none">{r.icon}</div>
                  <div className="text-[#0b1c33]">{r.text}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CHIP STRIP */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-[#0b1c33] font-semibold">
            Join us in our mission to support and empower those affected by cancer.
            At HopeSpring, our doors are open to anyone. Period.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white text-sm"
              >
                <span className="text-[#ffb300]">🎗️</span>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
