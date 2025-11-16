import React from "react";
import { Link } from "react-router-dom";

export default function LivingWithCancer() {
  // ----- data you can tweak later -----
  const accordions = [
    {
      title: "Cancer Care Counselling Sessions",
      body:
        "Book free one-on-one counselling with our registered professionals. Sessions focus on coping tools, stress management, grief, and navigating change during and after treatment.",
    },
    {
      title: "Support Groups",
      body:
        "Peer-led and professionally-facilitated groups where you can share experiences, ask questions, and receive emotional support from those who understand your journey.",
    },
    {
      title: "Gentle Exercise Programs",
      body:
        "Beginner-friendly movement including yoga, tai chi, qi gong, and guided stretching—available remotely and in-person. Please check with your care team before starting.",
    },
    {
      title: "Relaxation Programs",
      body:
        "Reiki, massage therapy, and therapeutic touch are designed to reduce anxiety and promote rest, helping you reconnect with your body during recovery.",
    },
    {
      title: "Art and Creativity",
      body:
        "Expressive arts programs like Joyful Art Practice and Skills & Techniques support emotional processing and offer a space to create, play, and connect.",
    },
    {
      title: "Coping and Resources",
      body:
        "From chemo-brain strategies to community resources, explore practical tools and local information to help you feel more in control.",
    },
    {
      title: "Children and Youth Programs",
      body:
        "Age-appropriate programs designed for children, youth, and families impacted by cancer—supporting communication, resilience, and connection.",
    },
  ];

  const features = [
    {
      icon: "💛",
      title: "Always Free",
      text: "All programs and services are free for anyone affected by cancer.",
    },
    {
      icon: "🧭",
      title: "Flexible Access",
      text: "In-person and remote options to fit your schedule and energy levels.",
    },
    {
      icon: "🔒",
      title: "No Diagnosis Required",
      text: "You’re not required to share medical details to get support.",
    },
    {
      icon: "🤝",
      title: "Here When You Need Us",
      text: "Call 519-742-HOPE (4673) or email volunteer@hopespring.ca.",
    },
  ];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            {/* Optional ribbon/hero image */}
            
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0b1c33]">
              I am living with cancer or I am a survivor – Category
            </h1>
          </div>
        </div>
      </section>

      {/* INTRO SPLIT: image + text/buttons */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-start">
          <div>
            <img
              src="/images/s1.png"     // /public/images/hope-lawn.jpg
              alt="HopeSpring community"
              className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Getting started with HopeSpring is easy
            </h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Welcome to HopeSpring Cancer Support Centre, where we offer free comprehensive programs
              and services to support individuals living with cancer, their caregivers, healthcare providers,
              and community partners. We’re here for you every step of the way.
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

      {/* HOW WE HELP: accordion list */}
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
              <details
                key={item.title}
                className="group border rounded-lg overflow-hidden bg-white"
              >
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

      {/* FEATURE BAND: image + feature cards */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Empowering Individuals Affected by Cancer to Enhance their Emotional,
              Physical, Mental, and Spiritual Well-being
            </h3>
            <img
              src="/images/s2.png"    
              alt="Participant smiling"
              className="mt-4 w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
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

      {/* WHAT TO EXPECT + image pair */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-[#0b1c33]">What To Expect</h4>
            <p className="mt-2 text-gray-700">
              Expect a supportive, compassionate environment with a variety of free programs.
              Our staff and volunteers provide personalized care and practical tools for your journey.
            </p>
            <img
              src="/images/s3.png"      
              alt="Hands holding flower"
              className="mt-5 w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
          </div>
          <div>
            <img
              src="/images/s4.png"       
              alt="Pink ribbon"
              className="w-full rounded-2xl shadow-md ring-1 ring-black/10 object-cover"
            />
            <h4 className="mt-5 text-lg md:text-xl font-semibold text-[#0b1c33]">Our Approach</h4>
            <p className="mt-2 text-gray-700">
              Programs are designed to complement your medical treatment and enhance your daily life.
              Always consult your medical team before beginning exercise programs.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
