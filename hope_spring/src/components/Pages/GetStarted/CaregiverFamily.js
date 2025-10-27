import React from "react";
import { Link } from "react-router-dom";

export default function CaregiverFamily() {
  const accordions = [
    {
      title: "Cancer Care Counselling Sessions",
      body:
        "Free one-on-one counselling focused on caregiver stress, boundary setting, grief, and practical coping tools while supporting your loved one.",
    },
    {
      title: "Support Groups",
      body:
        "Join groups for caregivers and family to share experiences, learn strategies, and receive emotional support from peers and professionals.",
    },
    {
      title: "Gentle Exercise Programs",
      body:
        "Short, restorative movement (yoga, tai chi, qi gong, stretching) to help reduce stress and maintain your own health while caregiving.",
    },
    {
      title: "Relaxation Programs",
      body:
        "Reiki, massage therapy, and therapeutic touch to support nervous system regulation and promote better rest.",
    },
    {
      title: "Art and Creativity",
      body:
        "Expressive arts programs like Joyful Art Practice and Skills & Techniques to decompress and process emotions through creativity.",
    },
    {
      title: "Coping and Resources",
      body:
        "Practical tools, local resources, and education for topics like chemo-brain, communication, and navigating the healthcare system.",
    },
    {
      title: "Children and Youth Programs",
      body:
        "Age-appropriate programs for children and youth impacted by a family member’s cancer—supporting resilience and communication.",
    },
  ];

  const features = [
    {
      icon: "🧭",
      title: "Flexible Access",
      text: "Remote and in-person programs so you can join when it works for you.",
    },
    {
      icon: "💛",
      title: "Always Free",
      text: "All services are free for anyone affected by cancer, including caregivers.",
    },
    {
      icon: "🧠",
      title: "Tools for Balance",
      text: "Find resources that help you care for yourself while supporting your loved one.",
    },
    {
      icon: "👥",
      title: "Personalized Support",
      text: "Guidance and counselling tailored to your specific needs and challenges.",
    },
  ];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <img
              src="/images/ribbon-hero.png"     // optional: /public/images/ribbon-hero.png
              alt=""
              className="w-[520px] max-w-full mb-6"
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0b1c33]">
              I am a caregiver, supporter, or family member – Category
            </h1>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-start">
          <div>
            <img
              src="/images/hope-lawn.jpg"       // /public/images/hope-lawn.jpg
              alt="HopeSpring community"
              className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Getting started with HopeSpring is easy
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We offer free, comprehensive programs and services to support caregivers, supporters,
              and family members. Explore counselling, groups, relaxation, and practical resources
              designed to help you manage stress and care for yourself.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/support/calendar"
                className="rounded-xl bg-[#22c55e] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Start here
              </Link>
              <Link
                to="/contact-us"
                className="rounded-xl bg-[#0b1c33] text-white px-4 py-2 font-semibold shadow-sm hover:brightness-110"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP (accordion) */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-[#0b1c33]">How we help you</h3>
            <Link
              to="/book/cancer-care-counselling"
              className="rounded-lg bg-[#22c55e] text-white px-3 py-2 text-sm font-semibold hover:brightness-110"
            >
              Book your consultation
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {accordions.map((item) => (
              <details key={item.title} className="group border rounded-lg overflow-hidden bg-white">
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-[#0b1c33]">
                  <span className="font-medium">{item.title}</span>
                  <svg
                    className="h-5 w-5 transition-transform group-open:rotate-45"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-700">{item.body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE BAND */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Specialized Support for Caregivers, Supporters, and Family Members
              to help you cope, manage stress, and support your loved ones
            </h3>
          </div>

          <ul className="grid gap-3">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-xl border bg-white p-4 flex items-start gap-3 shadow-sm"
              >
                <div className="text-xl leading-none">{f.icon}</div>
                <div>
                  <div className="font-semibold text-[#0b1c33]">{f.title}</div>
                  <div className="text-gray-700 text-sm">{f.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT TO EXPECT + APPROACH */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-[#0b1c33]">What To Expect</h4>
            <p className="mt-2 text-gray-700">
              A caring, understanding community that recognizes your role and provides the tools
              to support your well-being. Our programs help you maintain balance while supporting
              your loved one.
            </p>
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-[#0b1c33]">Our Approach</h4>
            <p className="mt-2 text-gray-700">
              We offer practical resources and programs tailored to caregivers. Our holistic approach
              ensures that you, as a caregiver or family member, receive the guidance and support you
              need to navigate the journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
