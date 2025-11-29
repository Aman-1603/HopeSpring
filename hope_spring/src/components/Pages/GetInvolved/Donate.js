import React from "react";
import { Link } from "react-router-dom";
import DonateWidget from "../DonateWidget";

export default function Donate() {
  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative min-h-[420px] md:min-h-[560px]">
        {/* Background image - put an image at /public/images/donate-hero.jpg */}
        <img
          src="/images/donate-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* soft wash for legibility */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b1c33_0%,rgba(11,28,51,.75)_35%,transparent_70%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16 grid gap-8 md:grid-cols-[1.2fr_.8fr] items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Help Create a Community Where No One Faces Cancer Alone
            </h1>
            <p className="mt-3 max-w-xl text-white/90">
              Your gift powers free programs, counselling, and resources for
              people impacted by cancer in our region.
            </p>
          </div>

          {/* Donation widget area (replace with your provider embed) */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl">
            {/* Example: Donorbox, FundraiseUp, Stripe, etc.
               Replace the box below with your provider’s iframe/script */}
                <DonateWidget />
           
          </div>
        </div>
      </section>

      {/* AMOUNT IMPACT */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-xl font-bold text-[#0b1c33]">
            Any amount makes a huge impact.
          </h2>
          <p className="mt-1 text-center text-gray-600">
            Your generosity funds counselling, programs, wigs, supplies, and
            more—at no cost to those we serve.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { amt: "$35", blurb: "Helps fund a wellness class" },
              { amt: "$50", blurb: "Supports a counselling session" },
              { amt: "$75", blurb: "Provides program materials" },
              { amt: "$100", blurb: "Covers a family support visit" },
              { amt: "$250+", blurb: "Accelerates new programs" },
            ].map((s) => (
              <div
                key={s.amt}
                className="rounded-2xl border bg-white p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-extrabold text-[#0b1c33]">
                  {s.amt}
                </div>
                <p className="text-sm text-gray-600 mt-1">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TO DONATE TO */}
      <section className="bg-[#ff8a00]/10 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-xl font-bold text-[#0b1c33] mb-4">
            What to donate to
          </h3>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Mental Health Care",
                text:
                  "Fund cancer care counselling and mental health supports for individuals and families.",
                img: "/images/donate-mental.jpg",
              },
              {
                title: "Programs",
                text:
                  "Support free programs—exercise, meditation, peer support, and activities for families.",
                img: "/images/donate-programs.jpg",
              },
              {
                title: "Men’s Health",
                text:
                  "Expand targeted services and outreach to men in our community impacted by cancer.",
                img: "/images/donate-men.jpg",
              },
            ].map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border bg-white overflow-hidden shadow-sm"
              >
                <div className="h-44 bg-gray-200">
                  <img
                    src={c.img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#0b1c33]">{c.title}</h4>
                  <p className="text-gray-600 mt-1">{c.text}</p>
                  <Link
                    to="/donate"
                    className="inline-block mt-3 text-[#0e2340] font-semibold hover:underline"
                  >
                    Give to this →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>    

      {/* STORY + CTA */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 lg:grid-cols-2">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="HopeSpring Story"
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-[#0b1c33]">
              Help ensure no one faces cancer alone.
            </h3>
            <p className="text-gray-700 mt-2">
              Your donation provides vital programs, guidance, and hope. With
              your support, we can meet people where they are—emotionally,
              physically, and financially—so they never have to navigate cancer
              by themselves.
            </p>
            <Link
              to="/donate"
              className="mt-4 w-fit inline-block rounded-xl bg-[#0e2340] text-white px-5 py-3 font-semibold shadow-sm hover:brightness-110"
            >
              Start/renew my donation
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT BANNER */}
      <section className="relative">
        <img
          src="/images/impact-banner.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="relative bg-[#0b1c33]/70">
          <div className="mx-auto max-w-6xl px-4 py-10 text-white">
            <h3 className="text-center text-2xl font-bold">
              Let’s Lessen the Burden of Cancer—Together!
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "People served / year", value: "1,200+" },
                { label: "Free programs delivered", value: "1,000+" },
                { label: "Local partners", value: "60+" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/20 bg-white/5 p-5 text-center"
                >
                  <div className="text-3xl font-extrabold">{s.value}</div>
                  <div className="text-sm opacity-90">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MORE WAYS TO GIVE */}
      <section className="bg-[#ff8a00]/10 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-xl font-bold text-[#0b1c33] mb-4">
            More Ways to Give
          </h3>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Host a Fundraiser",
                text:
                  "Rallies, workplace campaigns, birthdays—small events make a big impact.",
                cta: "Learn more",
              },
              {
                title: "In-kind donations",
                text:
                  "Supplies or services can directly support programs and families.",
                cta: "Learn more",
              },
              {
                title: "Give by cheque",
                text:
                  "Prefer offline giving? Cheques are welcome—thank you for your support.",
                cta: "Get details",
              },
              {
                title: "Legacy Giving",
                text:
                  "Create lasting impact through a bequest or planned gift.",
                cta: "Learn more",
              },
              {
                title: "Donate a car",
                text:
                  "Vehicle donation partners can turn your car into support for families.",
                cta: "Learn more",
              },
              {
                title: "Give by stock",
                text:
                  "Donating securities can be tax-efficient and highly impactful.",
                cta: "Contact us",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="text-2xl">💛</div>
                <h4 className="mt-2 font-bold text-[#0b1c33]">{c.title}</h4>
                <p className="text-gray-600 mt-1">{c.text}</p>
                <Link
                  to="/donate"
                  className="inline-block mt-3 text-[#0e2340] font-semibold hover:underline"
                >
                  {c.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS / SUPPORTERS */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-xl font-bold text-[#0b1c33] mb-4 text-center">
            Thank you to our community partners and supporters
          </h3>
          {/* Replace with real logos in /public/images/partners/... */}
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border bg-white grid place-content-center text-gray-500"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
