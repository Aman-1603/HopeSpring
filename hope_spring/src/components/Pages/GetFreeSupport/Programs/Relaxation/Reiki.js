import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Activity,
  MessageSquareHeart,
  ChevronRight,
  CalendarCheck2,
  Info,
} from "lucide-react";

/* Replace these with local assets if you have them */
const heroImg =
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1600&auto=format&fit=crop";
const benefitsImg =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop";
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
    title: "Therapeutic Touch",
    to: "/programs/therapeutic-touch",
    img: "https://images.unsplash.com/photo-1585543530718-98629df2cf8b?q=80&w=1200&auto=format&fit=crop",
    blurb:
      "A gentle, non-invasive approach that supports relaxation and natural balance.",
  },
  {
    title: "Meditation",
    to: "/programs/meditation",
    img: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop",
    blurb:
      "Mindfulness practices to calm the mind and support daily resilience.",
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

const PractitionerBadge = ({ name, img }) => (
  <div className="flex flex-col items-center">
    <div className="h-48 w-48 overflow-hidden rounded-2xl shadow">
      <img src={img} alt={name} className="h-full w-full object-cover" />
    </div>
    <div className="mt-3 w-full max-w-[12rem] rounded-xl bg-orange-500 px-6 py-2 text-center text-sm font-semibold text-white shadow">
      {name}
    </div>
  </div>
);

export default function Reiki() {
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
              Reiki
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Reiki helps with stress reduction and relaxation and can promote
              healing through gentle, grounding techniques.
            </p>
            <div className="mt-6">
              <Link
                to="/booking/reiki"
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
            <h2 className="text-2xl font-extrabold">How can Reiki help me?</h2>
          </div>
          <p className="text-sm leading-7 text-gray-700">
            Reiki is an ancient healing technique. In many sessions, healing
            energy is channeled from the practitioner to the individual to
            enhance energy and reduce stress, pain, and fatigue. Sessions are
            gentle and can be adapted for comfort, focusing on relaxation and
            overall well-being.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1fr,1.2fr]">
            <div>
              <h3 className="text-2xl font-extrabold">
                Potential benefits of Reiki
              </h3>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img
                  src={benefitsImg}
                  alt="Reiki session"
                  className="h-72 w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <BenefitCard icon={HeartPulse} title="Stress Reduction">
                Calming the mind and body, fostering relaxation and inner peace.
              </BenefitCard>
              <BenefitCard icon={Activity} title="Pain Alleviation">
                Providing relief from discomfort and supporting the body’s
                healing mechanisms.
              </BenefitCard>
              <BenefitCard icon={MessageSquareHeart} title="Emotional Support">
                Offering emotional balance and a sense of overall well-being.
              </BenefitCard>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTITIONERS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="text-xl font-extrabold">Meet your Practitioners</h3>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          Our practitioners are certified and experienced in providing Reiki and
          related relaxation techniques tailored to the unique needs of cancer
          patients, survivors, and caregivers. We foster a safe, supportive
          environment for your healing journey.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <PractitionerBadge
            name="Juliette"
            img="https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?q=80&w=900&auto=format&fit=crop"
          />
          <PractitionerBadge
            name="Linda"
            img="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=900&auto=format&fit=crop"
          />
          <PractitionerBadge
            name="Peter"
            img="https://images.unsplash.com/photo-1542042161784-26ab9e041e96?q=80&w=900&auto=format&fit=crop"
          />
          <PractitionerBadge
            name="Rebecca"
            img="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=900&auto=format&fit=crop"
          />
        </div>

        <div className="mt-6">
          <Link
            to="/booking/reiki"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            Schedule a Session <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* PROGRAM LIST (accordion style) */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:text-left">
          <h3 className="text-xl font-extrabold">Explore Reiki programs</h3>

          <ul className="mt-6 space-y-2">
            {[
              { title: "Reiki & Reflexology with Linda", to: "/register/reiki-linda" },
              { title: "Reiki with Juliette", to: "/register/reiki-juliette" },
              { title: "Reiki with Peter", to: "/register/reiki-peter" },
              { title: "Reiki with Rebecca", to: "/register/reiki-rebecca" },
            ].map((row) => (
              <li key={row.title} className="rounded-xl border border-dashed border-gray-300">
                <details>
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold">
                    <span>{row.title}</span>
                    <span className="text-gray-500">+</span>
                  </summary>
                  <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
                    Gentle sessions focused on relaxation and balance. Suitable
                    for patients, survivors, caregivers, and family members.
                    <div className="mt-3">
                      <Link
                        to={row.to}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Register <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
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
                    q: "Is Reiki safe during cancer treatment?",
                    a: "Yes—when provided by trained practitioners. Always consult your care team for personal guidance.",
                  },
                  {
                    q: "Do I need a referral?",
                    a: "HopeSpring programs typically do not require a referral, but insurers or clinics may vary.",
                  },
                  {
                    q: "Can sessions be adapted for fatigue or limited mobility?",
                    a: "Absolutely. Positioning, pacing, and duration are tailored to your comfort.",
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
                  alt="Reiki setting"
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
