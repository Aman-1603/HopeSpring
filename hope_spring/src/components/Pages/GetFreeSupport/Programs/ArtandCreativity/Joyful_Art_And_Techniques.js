import React from "react";
import { Link } from "react-router-dom";
import { Palette, Brush, PenTool, Sparkles, Users, BookOpen, CalendarDays, ArrowRight } from "lucide-react";

// Joyful Art Skills & Techniques – Tailwind + lucide-react

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

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&auto=format&fit=crop";

const skills = [
  {
    title: "Watercolour basics",
    body: "Learn washes, gradients, and simple layering to build forms with transparency.",
    icon: <Palette className="h-5 w-5 text-amber-600" aria-hidden />,
  },
  {
    title: "Acrylic techniques",
    body: "Practice dry‑brush, glazing, scumbling, and palette‑knife textures for expressive effects.",
    icon: <Brush className="h-5 w-5 text-blue-600" aria-hidden />,
  },
  {
    title: "Mixed‑media & collage",
    body: "Combine paper, found textures, and ink marks to add depth and storytelling.",
    icon: <PenTool className="h-5 w-5 text-emerald-600" aria-hidden />,
  },
];

const outcomes = [
  { title: "Grow creative confidence", icon: <Sparkles className="h-4 w-4" aria-hidden /> },
  { title: "Relax & self‑soothe with art", icon: <BookOpen className="h-4 w-4" aria-hidden /> },
  { title: "Connect with a welcoming community", icon: <Users className="h-4 w-4" aria-hidden /> },
];

export default function JoyfulArtSkillsTechniquesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="program-title">
        <img src={HERO_IMAGE} alt="Colourful paint tubes" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-white">
            <Pill>Program – Art therapy</Pill>
            <h1 id="program-title" className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Art Therapy</h1>
            <p className="mt-3 max-w-xl text-white/90">
              Explore the healing power of art in a supportive space. Sessions combine approachable skills with
              mindful, stress‑relieving practice.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="#register" variant="primary">Register</Button>
              <Button as={Link} to="/programs" variant="ghost">Explore other programs</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl gap-10 px-4 py-12 sm:grid sm:grid-cols-2">
        <h2 className="text-2xl font-semibold">How can Art therapy help me?</h2>
        <p className="mt-4 text-gray-600 sm:mt-0">
          In Art Therapy, in‑person sessions are designed to help you explore your emotions, reduce stress, and improve overall well‑being through creative expression. Each session lasts 90 minutes at our Kitchener studio. Movements and activities are adaptable to energy levels during or after treatment.
        </p>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Card className="p-6 md:p-8">
          <div className="grid items-start gap-6 md:grid-cols-[340px,1fr]">
            <img
              src="/images/art-technique-banner.png"
              alt="Brush on vibrant canvas"
              className="h-64 w-full rounded-xl object-cover md:h-full"
            />
            <div>
              <h3 className="text-2xl font-semibold">Experience the healing power of art</h3>
              <ul className="mt-4 grid gap-4">
                {skills.map((o, i) => (
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
        <h3 className="text-2xl font-semibold text-center md:text-left">Meet your facilitators</h3>
        <Card className="mx-auto mt-6 grid max-w-md items-center gap-4 p-4">
          <div className="flex gap-4">
            <img
              src="/images/facilitators/Char.png"
              alt="Char Heaman"
              className="h-24 w-24 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-[#0b1c33]">Char Heaman</p>
              <p className="mt-1 text-sm text-gray-600">
                A welcoming facilitator who blends approachable techniques with mindful practice in a safe space.
              </p>
              <button className="mt-1 text-xs text-emerald-700 hover:underline">Read more</button>
            </div>
          </div>
        </Card>
      </section>

      {/* More about */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h3 className="text-center text-2xl font-semibold">More About Joyful art practice</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[{
            title: "PREREQUISITE",
            body: "No prior art experience required—open to all skill levels.",
          },{
            title: "MORE INFORMATION",
            body: "Techniques vary each month; a simple materials list is provided before class.",
          },{
            title: "COURSE FORMAT",
            body: "90‑minute in‑person sessions at our 8‑Benton Street studio (hybrid options available).",
            cta: true,
          }].map((m, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <CalendarDays className="h-4 w-4" aria-hidden />
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

      {/* FAQ + image */}
      <section className="mx-auto max-w-6xl grid items-start gap-8 px-4 py-10 md:grid-cols-2">
        <img
          src="/images/art-technique-suggestion.png"
          alt="Giraffe collage on table"
          className="h-80 w-full rounded-2xl object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">Frequently Asked Questions</h3>
          <details className="group mt-3 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Who is this class for?</summary>
            <p className="mt-2 text-sm text-gray-600">Adults at any stage of the cancer journey and caregivers are welcome.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">What should I bring?</summary>
            <p className="mt-2 text-sm text-gray-600">A small kit (pencils, paper) is enough—use what you have.</p>
          </details>
          <details className="group mt-2 rounded-xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium">Is it guided?</summary>
            <p className="mt-2 text-sm text-gray-600">Yes, sessions are instructor‑led with time for personal exploration.</p>
          </details>
        </div>
      </section>

      {/* Related */}
      <section className="bg-amber-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-center text-xl font-semibold text-amber-900">You May Also Like</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[{
              title: "Joyful art practice",
              copy: "Monthly creative sessions mixing art skills with stress‑relieving mindfulness.",
              img: "",
              to: "/support/programs/arts-creativity/joyful-art-practice",
            },{
              title: "Tai Chi",
              copy: "Gentle, flowing movement combined with breath to support balance and calm.",
              img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80",
              to: "/support/programs/gentle-exercise/tai-chi",
            },{
              title: "Qi Gong",
              copy: "Ancient practice combining movement, breath, and focus for well‑being.",
              img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
              to: "/support/programs/gentle-exercise/qigong"
            }].map((r, i) => (
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
