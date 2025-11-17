import React from "react";
import { Link } from "react-router-dom";
import { Palette, Sparkles, Users, Info, ClipboardList, CalendarDays, ArrowRight } from "lucide-react";

// Joyful Art Practice – TailwindCSS + lucide-react icons

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

//const HERO_IMAGE =
//  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&auto=format&fit=crop";

const objectives = [
  {
    title: "Find your artistic style",
    body: "Encourages participants to explore and develop their own unique artistic voice.",
    icon: <Sparkles className="h-5 w-5 text-amber-600" aria-hidden />,
  },
  {
    title: "Relieve stress",
    body: "Learn a variety of art techniques and mindful exercises that support relaxation and stress relief.",
    icon: <Palette className="h-5 w-5 text-blue-600" aria-hidden />,
  },
  {
    title: "Connect with your community",
    body: "Foster community and connection among participants through shared creative expression.",
    icon: <Users className="h-5 w-5 text-emerald-600" aria-hidden />,
  },
];

const facilitator = {
  name: "Char Heaman",
  photo: "/images/facilitators/Char.png",
  bio: (
    <>
      Many people who see my work make assumptions about me; primarily that I have been painting for years and that I have
      some formal training. Although that is how the story begins for many artists, that is not my story!
    </>
  ),
};

const moreAbout = [
  {
    title: "Prerequisite",
    icon: <Info className="h-4 w-4 text-emerald-700" aria-hidden />,
    body:
      "No experience required. This class is open to all skill levels—from new-to-art to more experienced artists.",
  },
  {
    title: "More information",
    icon: <ClipboardList className="h-4 w-4 text-emerald-700" aria-hidden />,
    body:
      "Each monthly session explores drawing, painting, and collage, with short mindfulness and breathing exercises to help reduce stress and anxiety.",
  },
  {
    title: "Course format",
    icon: <CalendarDays className="h-4 w-4 text-emerald-700" aria-hidden />,
    body:
      "Monthly, 90-minute class. Materials list is provided prior to the session. Hybrid delivery (Studio / Zoom).",
    cta: true,
  },
];

const related = [
  {
    title: "Joyful art skills and techniques",
    copy:
      "Learn a variety of art techniques including drawing, painting, and collage, plus mindfulness and breathing exercises.",
      img: "",
      to: "",
  },
  {
    title: "Cancer Care Counselling",
    copy:
      "Guidance and strategies to navigate the challenges that come with a cancer diagnosis.",
      img: "/images/Cancer-care-counselling-suggestion.png",
      to: "/book/cancer-care-counselling"
  },
  {
    title: "Art Night for kids after school",
    copy:
      "A playful creative space for children to express emotions and connect through art.",
      img: "",
      to: "/support/programs/arts-creativity/joyful-art-practice",
  },
];

export default function JoyfulArtPracticePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="program-title">
        <img src="/images/art-practice-banner.png" alt="Coloured pencils" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <Pill>Program – Joyful art practice</Pill>
            <h1 id="program-title" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Joyful Art Practice</h1>
            <p className="mt-3 max-w-xl text-white/90">
              A soft, loving, and encouraging platform to practice—whatever you are facing—through art.
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
        <h2 className="text-2xl font-semibold">How can Joyful art Practice help me?</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">
          This monthly class provides a creative outlet for relaxation and joy. Each session includes art techniques such
          as drawing, painting, and collage, paired with mindfulness and breathing exercises to help reduce stress and
          anxiety. All levels welcome—from new to art to more experienced artists.
        </p>
      </section>

      {/* Objectives */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6 md:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
            <img
              src="/images/art-benefits.png"
              alt="Paint brushes with orange paint"
              className="h-64 w-full rounded-xl object-cover md:h-full"
            />
            <div>
              <h3 className="text-2xl font-semibold">Program Objectives</h3>
              <ul className="mt-4 grid gap-4">
                {objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <span className="mt-0.5 shrink-0">{o.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{o.title}</p>
                      <p className="text-sm text-gray-600">{o.body}</p>
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
        <h3 className="text-2xl font-semibold text-center md:text-left">Meet your facilitator</h3>
        <Card className="mx-auto mt-6 grid max-w-4xl items-center gap-6 p-4 md:grid-cols-[280px,1fr]">
          <img src={facilitator.photo} alt={facilitator.name} className="h-48 w-full rounded-xl object-cover md:h-56" />
          <div>
            <p className="font-semibold text-[#0b1c33]">{facilitator.name}</p>
            <p className="mt-2 text-sm text-gray-600">{facilitator.bio}</p>
            <Button variant="outline" className="mt-3">Read more</Button>
          </div>
        </Card>
      </section>

      {/* More about */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-center text-2xl font-semibold">More About Joyful art practice</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {moreAbout.map((m, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                {m.icon}
                {m.title}
              </div>
              <p className="mt-2 text-sm text-gray-600">{m.body}</p>
              {m.cta && (
                <div className="mt-4" id="register">
                  <Button variant="outline">
                    Register here
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ placeholder */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
        <img
          src="/images/joyful-suggestion.png"
          alt="Assorted art brushes"
          className="h-80 w-full rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <details className="group mt-3 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Do I need art experience?</summary>
            <p className="mt-2 text-sm text-gray-600">No—this class welcomes all levels and focuses on joyful making.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Are materials provided?</summary>
            <p className="mt-2 text-sm text-gray-600">A simple materials list is sent before class. Use what you have at home.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Can I join online?</summary>
            <p className="mt-2 text-sm text-gray-600">Yes—most sessions are hybrid with Zoom access.</p>
          </details>
        </div>
      </section>

      {/* Related */}
      <section className="bg-amber-50 py-14">
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

      <footer className="px-4 py-0 text-center text-xs text-gray-500"></footer>
    </main>
  );
}
