import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Activity,
  Smile,
  ChevronRight,
  CalendarCheck2,
  Info,
} from "lucide-react";

/** Replace with your local assets if available */
const heroImg =
  "https://images.unsplash.com/photo-1585543530718-98629df2cf8b?q=80&w=1600&auto=format&fit=crop";
const benefitsImg =
  "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1200&auto=format&fit=crop";
const faqSideImg =
  "https://images.unsplash.com/photo-1599058917212-d750089bc07b?q=80&w=1200&auto=format&fit=crop";

const youMayAlsoLike = [
  {
    title: "Massage Therapy",
    to: "/programs/massage-therapy",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
    blurb:
      "Hands-on techniques that promote relaxation, reduce pain, and enhance overall well-being.",
  },
  {
    title: "Meditation",
    to: "/programs/meditation",
    img: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop",
    blurb:
      "Guided mindfulness practices to reduce stress and support day-to-day resilience.",
  },
  {
    title: "Reiki",
    to: "/programs/reiki",
    img: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=1200&auto=format&fit=crop",
    blurb:
      "A gentle energy-based approach that supports relaxation and natural balance.",
  },
];

const BenefitCard = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-emerald-50 p-2">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{children}</p>
      </div>
    </div>
  </div>
);

const ProgramCard = ({ title, subtitle, body, cta, to }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h4 className="text-sm font-semibold tracking-wide text-emerald-700">
      {subtitle}
    </h4>
    <h3 className="mt-1 text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
    <div className="mt-5">
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        {cta} <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

const PractitionerBadge = ({ name, img }) => (
  <div className="flex flex-col items-center">
    <div className="h-48 w-48 overflow-hidden rounded-2xl shadow">
      <img src={img} alt={`${name}`} className="h-full w-full object-cover" />
    </div>
    <div className="mt-3 rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow">
      {name}
    </div>
  </div>
);

export default function TherapeuticTouch() {
  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[420px]"
          />
          <div className="absolute inset-0 bg-amber-600/30 mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
              <Info className="h-3.5 w-3.5" /> Program
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Therapeutic Touch
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              A gentle, non-invasive technique that aims to promote relaxation,
              reduce stress, and support the body’s natural healing processes.
            </p>
            <div className="mt-6">
              <Link
                to="/booking/therapeutic-touch"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Schedule a Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">
              How can Therapeutic Touch help me?
            </h2>
          </div>
        <p className="text-sm leading-7 text-gray-700">
            Therapeutic Touch is a healing technique designed to help restore
            balance and the body’s natural flow of energy. Delivered by an
            experienced practitioner, sessions often provide profound
            relaxation, a sense of calm, and improved well-being. Appointments
            can be adapted to comfort needs and energy levels.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1fr,1.2fr]">
            <div>
              <h3 className="text-2xl font-extrabold">
                Potential benefits of Therapeutic Touch
              </h3>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img
                  src={benefitsImg}
                  alt="Hand therapy"
                  className="h-72 w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <BenefitCard icon={HeartPulse} title="Stress Reduction">
                Alleviating stress, anxiety, and tension often associated with
                treatment or recovery—supporting deep relaxation.
              </BenefitCard>
              <BenefitCard icon={Activity} title="Pain Management">
                Easing discomfort and pain and contributing to improved comfort
                levels through gentle, non-invasive techniques.
              </BenefitCard>
              <BenefitCard icon={Smile} title="Emotional Well-being">
                Supporting emotional and mental well-being during challenging
                times and fostering a sense of connection and calm.
              </BenefitCard>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTITIONERS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="text-xl font-extrabold">Meet your Practitioners</h3>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          Our practitioners are certified and experienced in these relaxation
          techniques tailored to the unique needs of cancer patients, survivors,
          and caregivers. We strive to create a safe and supportive environment.
        </p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <PractitionerBadge
            name="Gloria"
            img="https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?q=80&w=900&auto=format&fit=crop"
          />
          <PractitionerBadge
            name="Susanne"
            img="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=900&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* PROGRAM OPTIONS */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:text-left">
          <h3 className="text-xl font-extrabold">
            Explore Therapeutic Touch programs
          </h3>
          <div className="mt-8 grid gap-6">
            <ProgramCard
              subtitle="Offered at HopeSpring"
              title="Therapeutic Touch with Gloria"
              body={
                <>
                  A healing technique designed to support relaxation and natural
                  balance. Sessions offer a calming experience and improved
                  sense of well-being. Appointments are typically 45 minutes and
                  may be by appointment only.
                </>
              }
              cta="Register"
              to="/register/therapeutic-touch-gloria"
            />
            <ProgramCard
              subtitle="Offered at HopeSpring"
              title="Therapeutic Touch with Susanne"
              body={
                <>
                  Gentle, non-invasive sessions tailored to comfort and energy
                  levels. Suitable for patients, survivors, caregivers, and
                  family members seeking calm and connection.
                </>
              }
              cta="Register"
              to="/register/therapeutic-touch-susanne"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-extrabold">Frequently Asked Questions</h3>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    q: "Is Therapeutic Touch safe during treatment?",
                    a: "Yes, when provided by trained practitioners. Always consult your care team for personal guidance.",
                  },
                  {
                    q: "Do I need a referral?",
                    a: "Generally no for HopeSpring programs, though some insurers or clinics may require one.",
                  },
                  {
                    q: "Can sessions be adapted to fatigue or limited mobility?",
                    a: "Absolutely—positioning, duration, and pacing are tailored to your comfort.",
                  },
                ].map((item, i) => (
                  <li key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <details>
                      <summary className="cursor-pointer list-none font-semibold">
                        {item.q}
                      </summary>
                      <p className="mt-2 text-sm text-gray-600">{item.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={faqSideImg}
                  alt="Therapist preparing session"
                  className="h-80 w-full object-cover md:h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="bg-orange-500 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-xl font-extrabold">You May Also Like</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {youMayAlsoLike.map((card) => (
              <Link
                to={card.to}
                key={card.title}
                className="group block overflow-hidden rounded-2xl bg-white text-gray-900 shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={card.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-semibold">{card.title}</h4>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {card.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
