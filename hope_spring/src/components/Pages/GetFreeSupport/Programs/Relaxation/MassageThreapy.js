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

/** Replace these with your real asset imports if you have them */
const heroImg =
  "/images/massage-therapy-banner.png";
const benefitsImg =
  "/images/massage-therapy-benefits.png";
const faqSideImg =
  "/images/massage-therapy-suggestion.png";

const youMayAlsoLike = [
  {
    title: "Reiki",
    img: "/images/reiki-suggestion.png",
    to: "/support/programs/relaxation/reiki",
    blurb:
      "An ancient healing technique focused on channeling energy to specific areas of the body.",
  },
  {
    title: "Therapeutic Touch",
    img: "/images/therupatic-theraphy.png",
    to: "/support/programs/relaxation/therapeutic-touch",
    blurb:
      "A gentle technique that supports relaxation and balance, delivered by an experienced practitioner.",
  },
  {
    title: "Meditation",
    img: "/images/yoga-suggestion.png",
    to: "/support/programs/gentle-exercise/meditation" ,
    blurb:
      "Mindfulness exercises to reduce stress and support daily well-being; encouraged as a home practice.",
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

const PractitionerCard = ({ name, children, tone = "emerald" }) => (
  <div
    className={`rounded-2xl border border-${tone}-200 bg-white p-5 shadow-sm`}
  >
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 overflow-hidden rounded-xl">
        <img
          src="/images/facilitators/Ian.png"
          alt={`${name} portrait`}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-base font-semibold text-gray-900">{name}</h4>
        <p className="text-xs text-gray-500">Registered Massage Therapist</p>
      </div>
    </div>
    <p className="mt-3 text-sm text-gray-600">{children}</p>
  </div>
);

export default function MassageTherapy() {
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
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
              <Info className="h-3.5 w-3.5" /> Program
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Massage Therapy
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Massage therapy can aid in reducing muscle tension, improving
              circulation, and providing relief from pain and fatigue.
            </p>
            <div className="mt-6">
              <Link
                to="/booking/massage-therapy"
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
              How can Massage Therapy help me?
            </h2>
          </div>
          <p className="text-sm leading-7 text-gray-700">
            Massage therapy is a hands-on therapeutic technique that involves
            manipulating the soft tissues of the body to promote relaxation,
            alleviate muscle tension, reduce pain, and enhance overall
            well-being. It can be beneficial for cancer patients, survivors, and
            caregivers, providing physical and emotional relief during their
            cancer journey.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1fr,1.2fr]">
            <div>
              <h3 className="text-2xl font-extrabold">
                Potential benefits of Massage Therapy
              </h3>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img
                  src={benefitsImg}
                  alt="Back massage"
                  className="h-72 w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <BenefitCard icon={HeartPulse} title="Stress Reduction">
                Massage can help reduce stress and anxiety by promoting
                relaxation and calmness. Sessions provide a nurturing and safe
                environment that allows individuals to rest, unwind, and release
                tension. This can help restore energy, enhance mood, and foster
                emotional well-being during challenging times.
              </BenefitCard>
              <BenefitCard icon={Activity} title="Pain Alleviation">
                Massage has demonstrated effectiveness in reducing pain,
                alleviating muscle tension, and easing discomfort associated
                with cancer-related side effects. It can enhance circulation,
                promote relaxation, and support better sleep.
              </BenefitCard>
              <BenefitCard
                icon={MessageSquareHeart}
                title="Communication and connection"
              >
                Sessions offer an opportunity for open communication between the
                participant, caregivers, and the therapist. This supportive
                environment can help individuals express needs and concerns,
                strengthening the therapeutic alliance and enhancing overall
                experience.
              </BenefitCard>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTITIONERS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="text-xl font-extrabold">Meet your Practitioners</h3>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          Our practitioners are certified and experienced in providing massage
          tailored to the unique needs of cancer patients, survivors, and
          caregivers. We provide a safe and supportive environment to facilitate
          your journey toward healing and improved well-being.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <PractitionerCard name="Ian">
            Kind and knowledgeable Registered Massage Therapist supporting
            HopeSpring since 2017. Ian brings a thoughtful, holistic approach to
            care and adapts techniques to individual needs.
          </PractitionerCard>
          <PractitionerCard name="Christian" tone="amber">
            Offers community-based massage sessions in partnership locations, with
            a warm, person-centred approach focused on comfort and safety.
          </PractitionerCard>
        </div>
      </section>

      {/* PROGRAM OPTIONS */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center md:text-left">
          <h3 className="text-xl font-extrabold">
            Explore Massage Therapy programs
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ProgramCard
              subtitle="Offered at HopeSpring"
              title="Massage Therapy with Ian"
              body={
                <>
                  <span className="font-medium">When:</span> 6–9pm on Zoom.
                  <br />
                  Personalized sessions for cancer patients, survivors, and
                  caregivers. Oncology authorization may be requested before
                  booking.
                </>
              }
              cta="Register"
              to="/register/massage-therapy-ian"
            />
            <ProgramCard
              subtitle="Offered by community partners"
              title="Massage Therapy with Christian"
              body={
                <>
                  Availability at Conestoga College Doon Campus for a fee.
                  These sessions are open to cancer patients, survivors,
                  caregivers, families, and anyone in the cancer community—
                  including staff.
                </>
              }
              cta="Register"
              to="/register/massage-therapy-christian"
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
                    q: "Is massage therapy safe during cancer treatment?",
                    a: "Yes—when provided by trained practitioners familiar with oncology care. Always consult your care team for personal guidance.",
                  },
                  {
                    q: "Do I need a referral?",
                    a: "Some programs or insurers may require one. HopeSpring programs typically do not, but verification is recommended.",
                  },
                  {
                    q: "Can sessions be adapted for fatigue or limited mobility?",
                    a: "Absolutely. Positioning, pressure, and duration are adjusted to your comfort.",
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
                  alt="Therapist preparing massage room"
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
