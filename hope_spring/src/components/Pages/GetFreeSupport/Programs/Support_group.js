import React, { useState } from "react";
import { Link } from "react-router-dom";

/** Small atoms */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-3 py-1">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 6l-11 11-5-5" stroke="currentColor" strokeWidth="2" />
    </svg>
    {children}
  </span>
);

const SectionTitle = ({ kicker, title, desc }) => (
  <div className="space-y-2">
    {kicker && <p className="uppercase tracking-wide text-[12px] text-gray-500">{kicker}</p>}
    <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c33]">{title}</h2>
    {desc && <p className="text-gray-600 max-w-2xl">{desc}</p>}
  </div>
);

const ProgramCard = ({ title, summary, day, time, facilitator, href = "/support/calendar" }) => (
  <article className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition">
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {day && <Badge>{day}</Badge>}
      {time && <Badge>{time}</Badge>}
    </div>
    <h3 className="font-semibold text-lg text-[#0b1c33]">{title}</h3>
    {facilitator && <p className="text-sm text-gray-500 mb-2">with {facilitator}</p>}
    <p className="text-gray-700 text-[15px] leading-relaxed">{summary}</p>
    <Link
      to={href}
      className="mt-4 inline-block rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
    >
      Register here
    </Link>
  </article>
);

const FacilitatorCard = ({ name, img = "/images/facilitators/placeholder.jpg", color }) => (
  <div
    className={`rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${
      color ? `bg-[${color}]` : "bg-white"
    }`}
  >
    <div className="aspect-[1/1] w-full bg-gray-100">
      {/* Replace placeholder path(s) with real images in /public/images/facilitators */}
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="p-3 text-center">
      <p className="font-semibold text-[#0b1c33]">{name}</p>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-[#0b1c33]">{q}</span>
        <svg
          className={`w-5 h-5 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div className={`grid overflow-hidden transition-[grid-template-rows] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden pb-4 text-gray-600">{a}</div>
      </div>
    </div>
  );
};

/** Page */
export default function SupportGroups() {
  const benefits = [
    {
      title: "Mental health support",
      text:
        "Emotional and mental well-being are vital parts of the cancer journey. Our support groups provide a safe, confidential space facilitated by trained professionals.",
    },
    {
      title: "A beacon of hope",
      text:
        "Through shared stories and lived experiences, members remind each other to regain a sense of control and resilience during the cancer journey.",
    },
    {
      title: "Spark a connection",
      text:
        "Whether in-person or remote, our groups help form bonds that carry beyond the session. We celebrate wins and provide a safe and welcoming place whenever you need to connect.",
    },
  ];

  const programsLeft = [
    {
      title: "Women’s Morning Support Group with Tammy",
      facilitator: "Tammy",
      day: "Weekly",
      time: "Morning",
      summary:
        "A supportive space for women affected by cancer to connect, share, and uplift one another. Includes check-ins, topic circles, and resources for resilience.",
    },
    {
      title: "Men’s support group",
      facilitator: "Peer-led",
      day: "Bi-weekly",
      time: "Evening",
      summary:
        "A confidential space for men navigating diagnosis, treatment, survivorship, and life changes. Build community, learn coping skills, and support each other.",
    },
    {
      title: "Caregiver support group with Suzy",
      facilitator: "Suzy",
      day: "Weekly",
      time: "Evening",
      summary:
        "Caregiving brings unique stress. This group focuses on practical strategies, emotional health, boundary-setting, and connecting with others in similar roles.",
    },
  ];

  const programsRight = [
    {
      title: "Women’s Evening Support Group with Christine",
      facilitator: "Christine",
      day: "Weekly",
      time: "Evening",
      summary:
        "A relaxed evening space to reflect, share stories, and strengthen coping strategies. Open to women at any point in the cancer journey.",
    },
    {
      title: "Pancreatic support group with Barbara",
      facilitator: "Barbara",
      day: "Monthly",
      time: "Evening",
      summary:
        "A diagnosis-specific circle for people impacted by pancreatic cancer. Discuss treatment, side-effects, nutrition, and navigating next steps.",
    },
    {
      title: "Ovarian support group with Barbara",
      facilitator: "Barbara",
      day: "Monthly",
      time: "Evening",
      summary:
        "A diagnosis-specific circle for people impacted by ovarian cancer. Share experiences, explore resources, and feel supported.",
    },
    {
      title: "Prostate Cancer Support Group Waterloo-Wellington",
      facilitator: "Community partners",
      day: "Monthly",
      time: "Evening",
      summary:
        "For individuals impacted by prostate cancer and their families. Evidence-informed discussion, guest speakers, and practical peer support.",
    },
  ];

  const facilitators = [
    { name: "Barbara", img: "/images/facilitators/barbara.jpg" },
    { name: "Christine", img: "/images/facilitators/christine.jpg" },
    { name: "Suzy", img: "/images/facilitators/suzy.jpg" },
    { name: "Tammy", img: "/images/facilitators/tammy.jpg" },
    // You can add a colored placeholder card if needed:
    // { name: "Men’s", img: "/images/facilitators/placeholder.jpg" },
  ];

  const faqs = [
    {
      q: "Do I need to be a HopeSpring member?",
      a:
        "No cost to join groups. Registration helps us send reminders and secure meeting links. Membership is free and open to everyone affected by cancer.",
    },
    {
      q: "Are groups virtual or in-person?",
      a:
        "Both options are available. Many programs offer remote sessions for flexibility. Check the calendar for exact format, dates, and times.",
    },
    {
      q: "Is what I share confidential?",
      a:
        "Yes. Our groups follow confidentiality guidelines. We create a respectful, non-judgmental environment so everyone can feel safe to participate.",
    },
  ];

  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative min-h-[320px] md:min-h-[380px]">
        <img
          src="/images/support-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-xl text-white">
            <p className="uppercase tracking-wide text-[12px] opacity-90">Programs</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Support Groups</h1>
            <p className="mt-3 text-white/90">
              Free, professionally facilitated groups for patients, survivors, and caregivers. Connect with
              others, share experiences, and build resilience — at any stage of the cancer journey.
            </p>
            <Link
              to="/support/calendar"
              className="mt-5 inline-block rounded-lg bg-emerald-500 text-white font-semibold px-5 py-2.5 hover:bg-emerald-600"
            >
              Find a group
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO BAND */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
          <div>
            <SectionTitle
              title="Free Support for Cancer Patients, survivors, and Caregivers Guiding Any Step of the Journey"
              desc=""
            />
          </div>
          <div className="text-gray-700 leading-relaxed">
            Each of our support groups is facilitated by trained professionals, focusing on connection,
            education, and practical tools for navigating the cancer experience. Whether you’re newly diagnosed,
            in treatment, or supporting someone you love, you are welcome here.
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div>
          <SectionTitle
            title="How Support Groups May Help"
            desc="We recognize that each individual’s journey with cancer is unique. Our support groups aim to provide:"
          />
          <div className="mt-4 space-y-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-[#0b1c33]">{b.title}</p>
                <p className="text-gray-700 text-[15px] mt-1">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md">
          <img src="/images/support-groups/people.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* FACILITATORS */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle
          title="Meet your facilitators"
          desc="Get to know the experienced experts behind our programs. With compassionate care, they build a safe, welcoming space for healing, connection, and growth."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {facilitators.map((f) => (
            <FacilitatorCard key={f.name} {...f} />
          ))}
        </div>
      </section>

      {/* PROGRAM CARDS */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionTitle
          title="Support Groups Programs For The Cancer Community"
          desc=""
        />
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            {programsLeft.map((p) => (
              <ProgramCard key={p.title} {...p} />
            ))}
          </div>
          <div className="space-y-4">
            {programsRight.map((p) => (
              <ProgramCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO FEATURE */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl overflow-hidden shadow-md bg-black aspect-video">
          <iframe
            className="w-full h-full"
            title="HopeSpring Support Groups"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-[#0b1c33]">What to expect</h3>
          <p className="text-gray-700 mt-2 leading-relaxed">
            Expect a supportive and compassionate environment where you can share at your own pace.
            Our group guidelines help create an atmosphere of respect and confidentiality. Sessions often include
            check-ins, topic discussions, gentle practices, and resource sharing.
          </p>
          <Link
            to="/support/calendar"
            className="mt-4 inline-block rounded-lg bg-[#0e2340] text-white px-5 py-3 font-semibold w-fit shadow-sm hover:brightness-110"
          >
            View calendar & register
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img src="/images/support-groups/faq-image.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <SectionTitle title="Frequently Asked Questions" />
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            {faqs.map((f) => (
              <FAQItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="bg-[#ff8a00]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h3 className="text-white font-bold text-xl mb-4">You May Also Like</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Cancer Care Counselling",
                img: "/images/also-like/counselling.jpg",
                to: "/book/cancer-care-counselling",
              },
              {
                title: "Reiki",
                img: "/images/also-like/reiki.jpg",
                to: "/support/programs/relaxation/reiki",
              },
              {
                title: "Yoga",
                img: "/images/also-like/yoga.jpg",
                to: "/support/programs/gentle-exercise/yoga",
              },
            ].map((x) => (
              <Link
                to={x.to}
                key={x.title}
                className="rounded-2xl overflow-hidden bg-white/90 border border-white/50 hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img src={x.img} alt={x.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#0b1c33]">{x.title}</p>
                  <span className="mt-2 inline-block text-[#0e2340] font-semibold text-sm">Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
