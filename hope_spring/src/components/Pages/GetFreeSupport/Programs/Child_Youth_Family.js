import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Palette,
  Gamepad2,
  Handshake,
  HeartHandshake,
  PlayCircle,
  ClipboardList,
  Link2,
} from "lucide-react";

/**
 * Children / Youth / Families page (lucide-react icons)
 * - Hero with playful shapes + CTA
 * - Program filter chips
 * - Sections: HopeKids, HighHOPES (teens), Art Nights, Parent Support Group
 * - Facilitator card
 * - FAQ with image
 *
 * TailwindCSS required.
 */

const Button = ({ as: As = "button", to, children, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-700 ring-offset-white",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-emerald-700",
    ghost:
      "bg-white/90 text-gray-900 hover:bg-white focus-visible:ring-emerald-700 ring-offset-emerald-600",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (As === Link) return (
    <Link className={cls} to={to} {...props}>
      {children}
    </Link>
  );
  if (to)
    return (
      <a href={to} className={cls} {...props}>
        {children}
      </a>
    );
  return (
    <As className={cls} {...props}>
      {children}
    </As>
  );
};

const Pill = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
      active
        ? "bg-[#0e2340] text-white border-[#0e2340]"
        : "bg-white text-[#0e2340] border-gray-300 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
);

const Stat = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <span className="text-emerald-600" aria-hidden>
      {icon}
    </span>
    {label}
  </div>
);

const SectionHeader = ({ eyebrow, title, children }) => (
  <div>
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{eyebrow}</p>
    )}
    <h2 className="mt-1 text-3xl font-extrabold text-[#0b1c33]">{title}</h2>
    {children && <p className="mt-3 text-gray-600 max-w-2xl">{children}</p>}
  </div>
);

const programs = {
  hopeKids: {
    slug: "hopekids",
    title: "HopeKids",
    ageBands: [
      {
        band: "7–12 Years Old",
        points: ["Build self‑esteem", "Gentle movement + play", "Peer connection"],
        when: "Tuesdays 5:30PM – 6:30PM",
        where: "Studio / Zoom",
      },
      {
        band: "13–17 Years Old",
        points: ["Creative arts", "Mindfulness", "Supportive space"],
        when: "Thursdays 3:30PM – 4:30PM",
        where: "Studio / Zoom",
      },
    ],
    blurb:
      "HopeKids provides a safe, engaging place for children and youth to play, learn, and connect while exploring coping strategies and emotional expression. Programs mix games, art, and mindful activities and are adapted for energy levels during and after treatment.",
    img: "https://images.unsplash.com/photo-1490674459751-8c6f0550f2d1?w=1200&q=80",
  },
  highHopes: {
    slug: "highhopes",
    title: "HighHOPES",
    blurb:
      "A supportive group designed for older children and teens who are living with cancer in the family or facing it themselves. We focus on confidence, peer connection, resilience, and having fun.",
    stats: [
      { icon: <Users className="h-4 w-4" />, label: "Build open conversations with family" },
      { icon: <Handshake className="h-4 w-4" />, label: "Community and peer support" },
      { icon: <Gamepad2 className="h-4 w-4" />, label: "Learn coping skills & stress relief" },
      { icon: <Palette className="h-4 w-4" />, label: "Fun, age‑appropriate activities" },
    ],
    cta: { when: "Coming Fall 2025", register: false },
    img: "https://images.unsplash.com/photo-1513171920216-2640b2884714?w=1200&q=80",
  },
  artNights: {
    slug: "art-nights",
    title: "Art Nights",
    blurb:
      "Hands‑on creative evenings where kids and teens explore paint, collage, and craft to express emotions in a calm, welcoming space.",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
  },
  parentGroup: {
    slug: "parent-support-group",
    title: "Parent Support Group",
    blurb:
      "A peer group for caregivers to share experiences, learn practical coping strategies, and access free services like counselling or resource navigation.",
    perks: [
      { icon: <HeartHandshake className="h-4 w-4" />, label: "1:1 support & check‑ins" },
      { icon: <PlayCircle className="h-4 w-4" />, label: "Guided sessions / short videos" },
      { icon: <ClipboardList className="h-4 w-4" />, label: "Worksheets & take‑home tools" },
      { icon: <Link2 className="h-4 w-4" />, label: "Link to local community services" },
    ],
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  },
};

export default function ChildrenYouthFamilyPage() {
  const [tab, setTab] = useState("all");

  return (
    <main className="min-h-screen bg-[#fbfaf5] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hopekidshero.svg"
          alt="Kids playing outdoors"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1c33]/80 via-[#0b1c33]/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36 text-white">
          <p className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm">Children / Youth / Families</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">HopeKids</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Joyful programs designed for kids and teens to connect, create, move, and build resilience — with caregivers supported alongside.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="primary" to="#programs">Explore programs</Button>
            <Button variant="ghost" as={Link} to="/support/calendar">View calendar & register</Button>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {[
            { v: "all", t: "All" },
            { v: "kids", t: "7–12" },
            { v: "teens", t: "13–17" },
            { v: "parents", t: "Parents" },
          ].map((c) => (
            <Pill key={c.v} active={tab === c.v} onClick={() => setTab(c.v)}>
              {c.t}
            </Pill>
          ))}
        </div>
      </section>

      {/* HOPEKIDS */}
      <section id="programs" className="mx-auto max-w-6xl grid items-start gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Program" title={programs.hopeKids.title}>
            {programs.hopeKids.blurb}
          </SectionHeader>
          <div className="mt-6 grid gap-4">
            {programs.hopeKids.ageBands.map((ab, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#0b1c33]">{ab.band}</p>
                    <ul className="mt-2 grid list-disc pl-5 text-sm text-gray-700 gap-1">
                      {ab.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-sm text-gray-600">
                      Time: {ab.when} · Location: {ab.where}
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1504177847826-8b2b2d1a3da0?w=300&q=80"
                    alt="HopeKids"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline">Register</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <img
            src={programs.hopeKids.img}
            alt="HopeKids collage"
            className="h-80 w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* HIGHHOPES (Teens) */}
      <section className="relative bg-[#e8fbff] py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <img
            src={programs.highHopes.img}
            alt="Teens basketball"
            className="h-80 w-full rounded-2xl object-cover"
          />
          <div>
            <SectionHeader eyebrow="Teens" title="HighHOPES">
              {programs.highHopes.blurb}
            </SectionHeader>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {programs.highHopes.stats.map((s, i) => (
                <Stat key={i} icon={s.icon} label={s.label} />
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" disabled={!programs.highHopes.cta.register}>
                {programs.highHopes.cta.when}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ART NIGHTS */}
      <section className="mx-auto max-w-6xl grid items-center gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Creative" title="Art Nights">
            {programs.artNights.blurb}
          </SectionHeader>
          <div className="mt-4">
            <Button variant="outline">Register</Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={programs.artNights.img}
            alt="Art supplies"
            className="h-80 w-full rounded-2xl object-cover"
          />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/90 p-1 shadow ring-1 ring-gray-200">
            <img
              src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=200&q=80"
              alt="Paint"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* PARENT SUPPORT GROUP */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeader eyebrow="Caregivers" title="Parent Support Group">
          {programs.parentGroup.blurb}
        </SectionHeader>
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,520px),1fr]">
          <Card className="overflow-hidden">
            <img
              src={programs.parentGroup.img}
              alt="Parent group"
              className="h-64 w-full object-cover"
            />
            <div className="p-4 text-sm text-gray-600">
              Tuesdays 6:30pm – 8:00pm · New Location: Centre · Hybrid (Zoom)
            </div>
          </Card>
          <Card className="p-4">
            <p className="mb-3 font-semibold">Free programs and services</p>
            <ul className="space-y-2">
              {programs.parentGroup.perks.map((p, idx) => (
                <li key={idx} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="text-emerald-600" aria-hidden>
                    {p.icon}
                  </span>
                  <span className="text-sm text-gray-700">{p.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button variant="outline">Register</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Facilitator */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="text-2xl font-semibold">Meet your facilitators</h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Our team creates a warm environment for children, youth, and caregivers.
        </p>
        <div className="mt-6 grid max-w-xl gap-4">
          <Card className="p-4">
            <p className="font-semibold">Name</p>
            <p className="mt-1 text-sm text-gray-600">
              Add a brief bio of the facilitator working in Youth & Families. Share experience,
              credentials, and a welcoming message to prospective participants.
            </p>
            <Button variant="outline" className="mt-3">
              Read more
            </Button>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-12 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&q=80"
          alt="Kids playing with bubbles"
          className="h-80 w-full rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <details className="group mt-3 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Are these programs free?</summary>
            <p className="mt-2 text-sm text-gray-600">Yes—thanks to donors and partners, all programs are free for members.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Are sessions online or in‑person?</summary>
            <p className="mt-2 text-sm text-gray-600">We offer both studio and Zoom options. Check the calendar for each program.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Can parents attend with their kids?</summary>
            <p className="mt-2 text-sm text-gray-600">Yes—caregivers are welcome. Some activities are youth‑only to encourage peer connection.</p>
          </details>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-xs text-gray-500">HopeSpring Cancer Support Centre</footer>
    </main>
  );
}
