import React from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, MessageSquareText, Users, ArrowRight } from "lucide-react";

// Chemo Brain Program Page – TailwindCSS + lucide-react icons

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-white/90 backdrop-blur">
    {children}
  </span>
);

const Button = ({ as: As = "button", to, children, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-700 ring-offset-white",
    ghost:
      "bg-white/90 text-gray-900 hover:bg-white focus-visible:ring-emerald-700 ring-offset-emerald-600",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-emerald-700",
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
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1920&auto=format&fit=crop";

const benefits = [
  {
    title: "Validation of experience",
    body:
      "Many individuals may feel isolated or frustrated by cognitive changes. Learning about chemo brain offers reassurance that they are not alone.",
    icon: <Users className="h-5 w-5 text-amber-600" aria-hidden />,
  },
  {
    title: "Empowering through knowledge",
    body:
      "Understanding treatment-related cognitive effects helps participants recognize and cope with challenges effectively.",
    icon: <BookOpen className="h-5 w-5 text-blue-600" aria-hidden />,
  },
  {
    title: "Effective communication",
    body:
      "With knowledge and tools, patients, survivors, and caregivers can engage in more open, effective communication with providers.",
    icon: <MessageSquareText className="h-5 w-5 text-emerald-600" aria-hidden />,
  },
];

const facilitator = { name: "Michaela", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80" };

const programItems = [
  {
    title: "Chemo Brain with Michaela",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-700">
          The workshop explains what \"chemo brain\" is, common symptoms (attention, memory), and practical strategies that
          support day‑to‑day focus. Includes printable tools and discussion time.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 ring-1 ring-emerald-200">Zoom</span>
          <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200">90 minutes</span>
        </div>
        <Button variant="outline">
          Register
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    ),
  },
];

const related = [
  {
    title: "Support Groups",
    copy:
      "Facilitated groups that foster empathy, confidentiality, and mutual understanding.",
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1000&q=80",
  },
  {
    title: "Therapeutic Touch",
    copy:
      "A gentle technique focused on restoring balance and easing stress and anxiety.",
    img: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=1000&q=80",
  },
  {
    title: "Cancer Care Counselling",
    copy:
      "One‑on‑one counselling to navigate the challenges that come with a cancer diagnosis.",
    img: "https://images.unsplash.com/photo-1523246192043-9531f2c9d95a?w=1000&q=80",
  },
];

export default function ChemoBrainProgramPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="program-title">
        <img src={HERO_IMAGE} alt="Person reflecting on a sofa" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <Pill>Program – Chemo brain</Pill>
            <h1 id="program-title" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Chemo Brain</h1>
            <p className="mt-3 max-w-xl text-white/90">
              We understand the challenges that come with experiencing cognitive changes during or after treatment.
              This workshop shares what to expect and strategies to manage attention and memory.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="#register" variant="primary">Register for class</Button>
              <Button as={Link} to="/programs" variant="ghost">Explore other programs</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl gap-10 px-4 py-12 sm:grid sm:grid-cols-2">
        <h2 className="text-2xl font-semibold">How can Chemo Brain programs help me?</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">
          The workshop provides an understanding of chemo brain (attention and memory), why it happens, and practical
          ways to cope. Patients often leave with concrete tools to track tasks, pace energy, and communicate needs with
          family and care providers.
        </p>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6 md:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
            <img
              src="https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?w=900&q=80"
              alt="Caregiver with child smiling on couch"
              className="h-64 w-full rounded-xl object-cover md:h-full"
            />
            <div>
              <h3 className="text-2xl font-semibold">Potential benefits of Chemo Brain</h3>
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
          Our facilitators create a welcoming space for learning and support.
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
        <h3 className="text-center text-2xl font-semibold">Explore Chemo Brain</h3>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Offered at HopeSpring</h4>
            <Accordion items={programItems} defaultOpen={0} />
          </div>
        </div>
      </section>

      {/* FAQ placeholder */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1559070224-87c4c1a6b4f9?w=1000&q=80"
          alt="Person sitting and reflecting"
          className="h-80 w-full rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <Accordion
            items={[
              { title: "Is this workshop suitable for caregivers?", content: "Yes—caregivers are welcome and often find strategies helpful for daily life." },
              { title: "Do I need any materials?", content: "Just a notebook (optional) and a quiet space if joining via Zoom." },
              { title: "Will I receive handouts?", content: "Yes—digital handouts and simple tools are provided to support practice at home." },
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
                  <Button variant="outline" className="mt-2 w-fit">Learn more</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-xs text-gray-500">HopeSpring Cancer Support Centre</footer>
    </main>
  );
}
