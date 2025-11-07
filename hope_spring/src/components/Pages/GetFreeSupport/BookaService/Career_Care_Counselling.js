import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck2,
  Info,
  HeartHandshake,
  Users2,
  Home,
  ChevronRight,
} from "lucide-react";

/* Replace with your local assets */
const heroRight =
  "https://images.unsplash.com/photo-1582234372722-50d7ccc30f5f?q=80&w=1400&auto=format&fit=crop";
const groupImg =
  "https://images.unsplash.com/photo-1519455953755-af066f52f1ea?q=80&w=1200&auto=format&fit=crop";
const benefitsImg =
  "https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=1200&auto=format&fit=crop";

const SubPill = ({ children, to = "#" }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
  >
    {children}
  </Link>
);

const ServiceCard = ({ icon: Icon, title, children }) => (
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

const CounselorCard = ({ name, img }) => (
  <div className="rounded-2xl bg-orange-500 p-1 shadow-sm">
    <div className="h-44 w-full overflow-hidden rounded-xl bg-orange-400">
      {img ? (
        <img src={img} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
    <div className="px-4 py-3 text-center text-sm font-semibold text-white">
      {name}
    </div>
  </div>
);

export default function CancerCareCounselling() {
  return (
    <main className="text-gray-900">
      {/* HERO (split) */}
      <section className="bg-emerald-50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
          <div className="px-6 py-12 sm:px-8 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
              <Info className="h-3.5 w-3.5" /> Program
            </span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Cancer Care Counselling
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-700">
              Professional, compassionate counselling for individuals,
              caregivers, and families impacted by cancer—offered with our
              community partners.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/booking/counselling"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Book Appointment
              </Link>

              <a
                href="https://iccs-example.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Is it covered via ICCS?
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 opacity-80">
              <img
                src="https://dummyimage.com/130x28/ffffff/2f855a&text=HopeSpring"
                alt="HopeSpring"
                className="h-7"
              />
              <img
                src="https://dummyimage.com/160x28/ffffff/2f855a&text=Community+Foundation"
                alt="Community Foundation"
                className="h-7"
              />
            </div>
          </div>

          <div className="relative hidden md:block">
            <img
              src={heroRight}
              alt="Counselling session"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SUB-NAV pills */}
      <section className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-wrap gap-2">
          <SubPill to="#individual">Individual Counselling</SubPill>
          <SubPill to="#child-youth">Child and Youth Counselling</SubPill>
          <SubPill to="#in-person">In-person or Remote</SubPill>
          <SubPill to="#safe-space">Nurture Environment</SubPill>
        </div>
      </section>

      {/* INTRO & BENEFITS */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold">
              What is Cancer Care Counselling?
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Counselling offers a safe, supportive space to process emotions,
              build coping strategies, and navigate practical challenges at any
              stage of the cancer journey. Sessions are delivered by qualified
              professionals and can be tailored to individuals, couples, and
              families.
            </p>
            <div className="mt-5">
              <Link
                to="/booking/counselling"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Book Appointment <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden">
            <img
              src={groupImg}
              alt="Supportive group"
              className="h-72 w-full object-cover"
            />
          </div>

          <div className="rounded-2xl overflow-hidden md:order-4">
            <img
              src={benefitsImg}
              alt="Companionship"
              className="h-72 w-full object-cover"
            />
          </div>

          <div className="md:order-3">
            <h3 className="text-xl font-extrabold">
              Potential Benefits of Counselling
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Emotional support, validation, and coping strategies.</li>
              <li>Help with anxiety, depression, grief, and uncertainty.</li>
              <li>Improved communication for couples and families.</li>
              <li>Navigation of practical issues during/after treatment.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROCESS + CTAs */}
      <section className="mx-auto max-w-6xl px-6 py-4">
        <h3 className="text-xl font-extrabold">Cancer Care Counselling Process</h3>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          We begin by understanding your needs and preferences to match you with
          a counsellor. Sessions are typically 50 minutes and may be virtual or
          in-person depending on availability. We aim to minimize wait times and
          remove barriers to access.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/booking/counselling"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Book Appointment
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* COUNSELLORS */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h3 className="text-xl font-extrabold">Meet your Counsellors</h3>
        <p className="mt-2 max-w-3xl text-sm text-gray-700">
          Our team provides person-centred, trauma-aware, and oncology-informed
          care. Below are a few of the wonderful counsellors you may meet.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            "Jennifer Helmuth",
            "Leslie Allsley",
            "Danielle Lancaster",
            "Ilona Markovich",
            "Josh Diner",
            "Vanessa Curry",
          ].map((n) => (
            <CounselorCard key={n} name={n} />
          ))}
        </div>
      </section>

      {/* TYPES OF SERVICES */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center md:text-left">
          <h3 className="text-xl font-extrabold">Types Of Counselling Services</h3>
          <p className="mt-2 text-sm text-gray-700">
            We offer multiple approaches. A brief overview is below—your intake
            will help determine the best fit.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ServiceCard icon={HeartHandshake} title="Individual One-on-One Support">
              Confidential sessions focused on your goals. Common topics include
              anxiety, adjustment, symptom burden, and resilience.
            </ServiceCard>
            <ServiceCard icon={Users2} title="Couples Counselling">
              Strengthen communication, navigate intimacy and role changes, and
              align expectations during/after treatment.
            </ServiceCard>
            <ServiceCard icon={Home} title="Family Counselling">
              Collaborative sessions for families to process emotions, support
              children, and plan practical care routines together.
            </ServiceCard>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ServiceCard icon={Users2} title="Child/Youth Counselling" />
            <ServiceCard icon={HeartHandshake} title="Caregivers Counselling" />
          </div>

          <div className="mt-6">
            <Link
              to="/booking/counselling"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Book Appointment <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h3 className="text-xl font-extrabold">Frequently Asked Questions</h3>
        <ul className="mt-5 space-y-4">
          {[
            {
              q: "Is counselling covered?",
              a: "Coverage varies by partner program and benefits. Some sessions may be covered through ICCS or extended health benefits.",
            },
            {
              q: "How many sessions can I access?",
              a: "We aim to provide short-term support with extensions as needed; availability may vary.",
            },
            {
              q: "Can I choose in-person or virtual?",
              a: "Yes—subject to counsellor availability and your preferences.",
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
      </section>

      {/* DISCLAIMER / FOOTNOTE */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs leading-6 text-gray-600">
          At HopeSpring Cancer Support Centre, our professional team provides a
          range of group and one-on-one counselling. We may coordinate referrals
          with community partners to provide you the best fit. This page is
          general information and is not a substitute for medical advice.
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="bg-orange-500 py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h3 className="text-xl font-extrabold text-center md:text-left">
            You May Also Like
          </h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Support Groups",
                blurb:
                  "Peer groups facilitated by experienced staff provide connection, understanding, and practical strategies.",
                to: "/programs/support-groups",
              },
              {
                title: "Reiki",
                blurb:
                  "Gentle sessions that help reduce stress while supporting a sense of balance and well-being.",
                to: "/programs/reiki",
              },
              {
                title: "Meditation",
                blurb:
                  "Guided mindfulness to calm the mind and support daily resilience.",
                to: "/programs/meditation",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group block overflow-hidden rounded-2xl bg-white text-gray-900 shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="h-44 w-full overflow-hidden bg-orange-100" />
                <div className="p-5">
                  <h4 className="font-semibold">{c.title}</h4>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {c.blurb}
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
