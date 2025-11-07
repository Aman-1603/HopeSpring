import React from "react";
import { Link } from "react-router-dom";

// Yoga Program Page – TailwindCSS

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-white/90 backdrop-blur">
    {children}
  </span>
);

const Button = ({ as: As = "button", to, children, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-700 ring-offset-white",
    ghost:
      "bg-white/90 text-gray-900 hover:bg-white focus-visible:ring-emerald-700 ring-offset-emerald-600",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-emerald-700",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (As === Link) return <Link className={cls} to={to} {...props}>{children}</Link>;
  if (to) return <a href={to} className={cls} {...props}>{children}</a>;
  return (
    <As className={cls} {...props}>
      {children}
    </As>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
);

const Accordion = ({ items, defaultOpen = 0 }) => (
  <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
    {items.map((it, idx) => (
      <details key={idx} className="group" open={idx === defaultOpen}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-left font-medium text-gray-900">
          <span className="flex items-center gap-3">
            {it.icon && <span aria-hidden>{it.icon}</span>}
            {it.title}
          </span>
          <span className="ml-4 select-none rounded-full border px-2 text-xs text-gray-600 group-open:rotate-45 transition">+</span>
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600">
          {typeof it.content === "function" ? it.content() : it.content}
        </div>
      </details>
    ))}
  </div>
);

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1920&auto=format&fit=crop";

const benefits = [
  {
    title: "Enhanced Focus and Cognitive Function",
    body: "Helps manage distractions and increase productivity in personal and professional pursuits.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-amber-500"><path d="M12 3l2.4 4.86L20 9l-4 3.9L17 19l-5-2.7L7 19l1-6.1L4 9l5.6-1.14L12 3z" fill="currentColor"/></svg>
    ),
  },
  {
    title: "Cultivation of Empathy and Compassion",
    body: "Supports a deeper sense of interconnectedness with community through understanding and support.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-rose-500" fill="currentColor"><path d="M12 21s-7-4.35-7-10a5 5 0 0110 0 5 5 0 0110 0c0 5.65-7 10-7 10s-3-1.87-6-4.9c-3 3.03-6 4.9-6 4.9z"/></svg>
    ),
  },
  {
    title: "Mental Clarity and Emotional Equilibrium",
    body: "Helps manage anxiety, depression, and other emotional challenges, improving resilience.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-emerald-500" fill="currentColor"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z"/></svg>
    ),
  },
];

const facilitators = [
  { name: "Tammy", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { name: "Melissa", photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&q=80" },
];

const hopespringPrograms = [
  { title: "Gentle Yoga and Meditation with Melissa" },
  { title: "Gentle Yoga for Symptom Management with Tammy" },
  { title: "Yoga for Cancer Recovery with Tammy" },
];

const related = [
  {
    title: "Tai Chi",
    copy: "A mind-body practice with flowing movements combining breath and balance.",
  },
  {
    title: "Meditation",
    copy: "Mindfulness exercises with encouragement to practice at home as a daily routine.",
  },
  {
    title: "Qi Gong",
    copy: "Gentle movements and breathing techniques to cultivate and balance energy (Qi).",
  },
];

export default function YogaProgramPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="program-title">
        <img src={HERO_IMAGE} alt="Yoga pose on mat" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <Pill>Program – yoga</Pill>
            <h1 id="program-title" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Yoga</h1>
            <p className="mt-3 max-w-xl text-white/90">
              Yoga helps exercise control over physical and emotional well‑being by combining movement, breathing, stretching, body poses and meditation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="#register" variant="primary">Find a class</Button>
              <Button as={Link} to="/programs" variant="ghost">Explore other programs</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl gap-10 px-4 py-12 sm:grid sm:grid-cols-2">
        <h2 className="text-2xl font-semibold">How can yoga help me?</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">
          In this group program, yoga plays a significant role in cancer support by offering physical movement and mental flexibility to both patients, survivors, and caregivers. It helps reduce stress, anxiety, and fatigue commonly associated with cancer and its treatment.
        </p>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6 md:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
            <img
              src="https://images.unsplash.com/photo-1552196566-3d4f2c6a1f1a?w=900&q=80"
              alt="Yoga class in studio"
              className="h-64 w-full rounded-xl object-cover md:h-full"
            />
            <div>
              <h3 className="text-2xl font-semibold">Potential benefits of Yoga</h3>
              <ul className="mt-4 grid gap-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <span className="mt-0.5 shrink-0">{b.icon}</span>
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

      {/* Facilitators */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-2xl font-semibold">Meet your facilitators</h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Get to know the compassionate experts who lead our programs. With warmth and experience, they create a welcoming space for healing, connection, and care.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {facilitators.map((f, i) => (
            <Card key={i} className="overflow-hidden">
              <img src={f.photo} alt={f.name} className="h-56 w-full object-cover" />
              <div className="bg-emerald-50 px-5 py-4">
                <p className="font-semibold text-emerald-900">{f.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Explore programs */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-center text-2xl font-semibold">Explore Yoga programs</h3>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Offered at HopeSpring</h4>
            <Accordion
              items={hopespringPrograms.map((p) => ({
                title: p.title,
                icon: <span className="text-emerald-600">●</span>,
                content: "Details and sign-up links will appear here when connected to the database.",
              }))}
            />
          </div>
        </div>
      </section>

      {/* FAQ placeholder */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-100 p-8 text-center text-gray-500">Image placeholder</div>
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <Accordion
            items={[
              { title: "Do I need prior yoga experience?", content: "No — classes are beginner friendly and adaptable." },
              { title: "What should I bring?", content: "A yoga mat (optional), water, and comfortable clothing." },
              { title: "Are classes online?", content: "Many sessions are available via Zoom with closed captions." },
            ]}
          />
        </div>
      </section>

      {/* Related */}
      <section className="bg-amber-500/10 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-center text-xl font-semibold text-amber-900">You May Also Like</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((r, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 w-full bg-amber-100" />
                <div className="space-y-2 p-5">
                  <p className="text-lg font-semibold">{r.title}</p>
                  <p className="text-sm text-gray-600">{r.copy}</p>
                  <Button variant="outline" className="mt-2 w-fit">Learn more</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-xs text-gray-500">
        HopeSpring Cancer Support Centre
      </footer>
    </main>
  );
}
