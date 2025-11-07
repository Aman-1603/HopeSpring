import React from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  ChevronRight,
  FileText,
} from "lucide-react";

/* ---------- Replace with your own assets ---------- */
const heroImg =
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1600&auto=format&fit=crop";
const communityImg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop";
const quoteAvatar =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop";
const bannerFaces =
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop";
const gallery = [
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520974319767-9f8a62a2d6f3?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1400&auto=format&fit=crop",
];

/* ---------- Small UI bits ---------- */
const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700">
    {children}
  </span>
);

const ValueCard = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-emerald-50 p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{children}</p>
      </div>
    </div>
  </div>
);

const RoleRow = ({ title, children }) => (
  <li className="rounded-xl border border-dashed border-gray-300 bg-white">
    <details>
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold">
        <span>{title}</span>
        <span className="text-gray-500">+</span>
      </summary>
      <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
        {children}
      </div>
    </details>
  </li>
);

/* ---------- Page ---------- */
export default function Volunteer() {
  const roles = [
    {
      t: "Administrative Assistant",
      d: "Support front desk, phones, scheduling, and light data entry. Weekday daytime preferred.",
    },
    {
      t: "Art Program Facilitator",
      d: "Co-facilitate creative sessions; prepare materials and welcome participants.",
    },
    {
      t: "Board/Committee Member",
      d: "Provide governance and strategic guidance; monthly meetings.",
    },
    {
      t: "Certified Relaxation Practitioner",
      d: "Offer relaxation/wellness sessions within your scope and insurance.",
    },
    {
      t: "Peer Support Volunteer",
      d: "Provide lived-experience support after completing our peer training.",
    },
    {
      t: "Photographer/Videographer",
      d: "Capture program moments for internal stories and community outreach.",
    },
    {
      t: "Sewers and Knitters",
      d: "Create comfort items (caps, pillows, blankets) for members and families.",
    },
    {
      t: "Special Events & Ambassadors",
      d: "Help at fundraisers, outreach tables, and community events.",
    },
    {
      t: "Youth Social Worker (Student)",
      d: "Student placement support (with school approval).",
    },
  ];

  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <img
          src={heroImg}
          alt=""
          className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[420px]"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-center px-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Empower the lives of those affected by cancer.
              </h1>
              <p className="mt-3 max-w-xl text-white/90">
                Every hour and every kindness matters. Join our caring community
                of volunteers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GETTING STARTED */}
      <section className="mx-auto max-w-6xl grid-cols-2 gap-10 px-4 py-10 md:grid">
        <div>
          <h2 className="text-xl font-extrabold">Getting started</h2>
          <p className="mt-2 text-sm text-gray-700">
            Becoming a volunteer is easy. Complete the interest form and choose
            roles that fit your skills and schedule. We’ll reach out to set up a
            brief conversation.
          </p>

          <div className="mt-5 flex gap-3">
            {/* External form? Swap Link for <a href="…"> */}
            <Link
              to="/volunteer/form"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <FileText className="h-4 w-4" />
              Volunteer Form
            </Link>
            <Link
              to="#roles"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              Volunteer Opportunities
            </Link>
          </div>
        </div>

        <div className="text-sm leading-6 text-gray-700">
          <p>
            To begin, complete the volunteer form—it only takes a few minutes.
            Select a time for a 15-minute pre-screening interview. Successful
            applicants will be invited to a role-specific orientation and
            training.
          </p>
          <p className="mt-3">
            Questions? Email{" "}
            <a
              href="mailto:volunteer@hopespring.ca"
              className="font-medium text-emerald-700 underline"
            >
              volunteer@hopespring.ca
            </a>
            .
          </p>
        </div>
      </section>

      {/* COMMUNITY + VALUES */}
      <section className="mx-auto max-w-6xl grid-cols-2 items-start gap-10 px-4 py-4 md:grid">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={communityImg}
            alt="Community"
            className="h-72 w-full object-cover"
          />
        </div>
        <div className="grid gap-4">
          <ValueCard icon={HeartHandshake} title="Caring">
            Join a community of caring volunteers; your empathy provides real
            hope and connection.
          </ValueCard>
          <ValueCard icon={Users} title="Supportive">
            Offer information about programs, greet participants, and provide
            emotional support.
          </ValueCard>
          <ValueCard icon={ShieldCheck} title="Inclusive">
            We welcome volunteers of all backgrounds and experiences. Training
            provided—belonging encouraged.
          </ValueCard>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-4xl items-center gap-6 px-4 md:flex">
          <div className="mx-auto h-28 w-28 overflow-hidden rounded-full md:mx-0">
            <img
              src={quoteAvatar}
              alt="Christina"
              className="h-full w-full object-cover"
            />
          </div>
          <blockquote className="mt-5 text-sm leading-7 text-gray-700 md:mt-0">
            “When I was diagnosed with breast cancer, I found support from a
            peer volunteer. Now almost 8 years later, I’m able to offer that
            support to women experiencing their own challenges. The
            understanding and care we exchange is life-affirming.”{" "}
            <span className="block mt-2 font-semibold">— Christina</span>
          </blockquote>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-extrabold">
            I would like to volunteer in the following areas…
          </h3>
          <Link
            to="/volunteer/form"
            className="hidden rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 md:inline-block"
          >
            Apply Now
          </Link>
        </div>

        <p className="mt-2 text-xs text-gray-600">
          Opportunities vary by need and season; not all roles are available at
          all times. If a role isn’t listed today, please check back or email
          us. We reserve the right to modify roles as needed.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl">
          <img
            src={bannerFaces}
            alt="Volunteer banner"
            className="h-28 w-full object-cover"
          />
        </div>

        <ul className="mt-6 space-y-2">
          {roles.map((r) => (
            <RoleRow key={r.t} title={r.t}>
              {r.d}
              <div className="mt-3">
                <Link
                  to="/volunteer/form"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Apply <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </RoleRow>
          ))}
        </ul>

        <div className="mt-6 md:hidden">
          <Link
            to="/volunteer/form"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="bg-orange-500 py-10 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-lg font-extrabold">
            Capturing memories of our volunteers
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {gallery.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white/10">
                <img
                  src={src}
                  alt=""
                  className="h-48 w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
