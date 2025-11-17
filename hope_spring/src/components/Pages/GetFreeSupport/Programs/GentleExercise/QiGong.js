import React from "react";
import { Link } from "react-router-dom";

// Qi Gong Program Page – TailwindCSS

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

//const HERO_IMAGE =
//  "https://images.unsplash.com/photo-1549576496-7712f8f6c095?q=80&w=1920&auto=format&fit=crop";

const benefits = [
  {
    title: "Supportive Community",
    body:
      "Qi Gong is often practiced together, offering a sense of connection, shared learning, and emotional support.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" className="text-amber-500" fill="currentColor"><path d="M12 3l2.4 4.86L20 9l-4 3.9L17 19l-5-2.7L7 19l1-6.1L4 9l5.6-1.14L12 3z"/></svg>,
  },
  {
    title: "Physical Well‑Being",
    body:
      "Gentle movements, breathing techniques, and meditation can improve overall mobility, balance, and relaxation.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" className="text-blue-500" fill="currentColor"><path d="M9 21a8 8 0 010-16 8 8 0 100 16zm6-18a1 1 0 011-1 7 7 0 010 14 1 1 0 01-1-1V3z"/></svg>,
  },
  {
    title: "Emotional Resilience",
    body:
      "Regular practice may ease stress and support a sense of inner peace and emotional balance.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" className="text-emerald-500" fill="currentColor"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z"/></svg>,
  },
];

const facilitator = { name: "Joel", photo: "/images/facilitators/Joel.png" };

const hopespringPrograms = [
  {
    title: "Qi Gong with Joel",
    when: "Tuesdays @ 7:30pm on Zoom",
    desc:
      "Discover the power of gentle movement and deep breathing with Joel. Rooted in traditional Chinese practice, the class supports improved energy flow, calmness, and overall well‑being. Suitable seated or standing.",
  },
];

const related = [
  { title: "Tai Chi", 
    copy: "Mind‑body practice with flowing movements combining breath and balance.", 
    img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80" ,
    to: "/support/programs/gentle-exercise/tai-chi"},

  { title: "Yoga", 
    copy: "Improve strength, flexibility, and overall wellbeing with welcoming classes.", 
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    to: "/support/programs/gentle-exercise/yoga" },


  { title: "Meditation", 
    copy: "Mindfulness exercises with encouragement to practice daily at home.", 
    img: "/images/yoga-suggestion.png",
    to: "/support/programs/gentle-exercise/meditation" },
];

export default function QiGongProgramPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="program-title">
        <img src="/images/qi-gong-banner.png" alt="Qi Gong practice outdoors" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <Pill>Program – Qi gong</Pill>
            <h1 id="program-title" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Qi Gong</h1>
            <p className="mt-3 max-w-xl text-white/90">
              Qi Gong is a traditional Chinese system that combines movement, meditation, and breathing exercises to promote emotional, spiritual, and physical well‑being.
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
        <h2 className="text-2xl font-semibold">How can Qi Gong help me?</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">
          Qi Gong is an ancient practice with gentle, flowing movements, focused breathing, and mindful attention. Many participants find it helpful for relaxation, improved mobility, and a grounded sense of well‑being. Movements can be adapted to be done seated or standing.
        </p>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6 md:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
            <img
              src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=900&q=80"
              alt="Close‑up of calm hands during practice"
              className="h-64 w-full rounded-xl object-cover md:h-full"
            />
            <div>
              <h3 className="text-2xl font-semibold">Benefits Of Qi Gong</h3>
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

      {/* Facilitator */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-2xl font-semibold">Meet your facilitators</h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Get to know the compassionate experts who lead our programs. With warmth and experience, they create a welcoming space for healing, connection, and care.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card className="overflow-hidden">
            <img src={facilitator.photo} alt={facilitator.name} className="h-56 w-full object-cover" />
            <div className="bg-emerald-50 px-5 py-4">
              <p className="font-semibold text-emerald-900">{facilitator.name}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Explore programs */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-center text-2xl font-semibold">Explore Qi Gong programs</h3>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Offered at HopeSpring</h4>
            <Accordion
              items={hopespringPrograms.map((p) => ({
                title: p.title,
                icon: <span className="text-emerald-600">●</span>,
                content: (
                  <div className="space-y-3 text-gray-700">
                    <p className="text-sm font-medium text-gray-900">{p.when}</p>
                    <p>{p.desc}</p>
                    <div id="register">
                      <Button variant="outline">Register</Button>
                    </div>
                  </div>
                ),
              }))}
              defaultOpen={0}
            />
          </div>
        </div>
      </section>

      {/* FAQ placeholder */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
        <img
          src="/images/qi-suggestion.webp"
          alt="Qi Gong class movement"
          className="h-96 w-full rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <Accordion
            items={[
              { title: "Is Qi Gong beginner‑friendly?", content: "Yes. Movements are gentle and adaptable for all abilities." },
              { title: "Can I practice seated?", content: "Absolutely. Many participants choose to practice seated." },
              { title: "Is there a cost?", content: "Programs are free for members thanks to community support." },
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
                <img src={r.img} alt={r.title} className="h-48 w-full object-cover" />
                <div className="space-y-2 p-5">
                  <p className="text-lg font-semibold">{r.title}</p>
                  <p className="text-sm text-gray-600">{r.copy}</p>
                  <Link to={r.to}>
                  <Button variant="outline" className="mt-2 w-fit">Learn more</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-0 text-center text-xs text-gray-500">
        
      </footer>
    </main>
  );
}
