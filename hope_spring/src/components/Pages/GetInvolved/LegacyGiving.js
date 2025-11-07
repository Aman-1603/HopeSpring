import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Mail, Phone, ChevronRight } from "lucide-react";

/** Replace with your real asset URLs */
const introImg =
  "https://images.unsplash.com/photo-1598908316649-5cf2c56e1e88?q=80&w=1400&auto=format&fit=crop"; // gardening hands
const hopeBanner =
  "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1600&auto=format&fit=crop"; // HOPE sign

export default function LegacyGiving() {
  return (
    <main className="text-gray-900">
      {/* PAGE TITLE */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Legacy giving</h1>
      </header>

      {/* INTRO: image left, copy right */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={introImg}
            alt="Planting for the future"
            className="h-80 w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-extrabold">Legacy Giving</h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            A legacy can take many forms. You can create your own legacy helping those facing one of the most common illnesses today. Locally, over 4,000 people are diagnosed with cancer every year. Look around you – you probably know someone facing cancer right now. Behind every diagnosis is a family impacted by that physical and emotional trauma. HopeSpring works hand in hand with the hospitals, providing psychosocial support in partnership with treatment. Your Legacy Gift supports the essential programs and initiatives that helps cancer patients and their families manage the stress and cope better when facing a diagnosis. Your Legacy Gift can have a profound impact on the lives of those facing cancer in the Region.
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            Most personal giving is limited by income. Legacy gifts allow ordinary people
            to make an extraordinary impact—often the largest gift they will ever make—by
            directing a portion of their estate. It’s simple to include HopeSpring in your
            will or name us as a beneficiary of life insurance or registered funds.
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            We understand that you may have people who depend on you for financial
            support. That’s as it should be. But if you are able, please consider leaving
            a residual percentage, a specific amount, or a gift of securities to
            HopeSpring.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {/* If your donate flow is external, swap Link for <a href="…"> */}
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <HeartHandshake className="h-4 w-4" />
              Give now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              Contact us <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT BLOCK */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200 md:p-8">
          <h3 className="text-base font-extrabold">Let’s talk confidentially</h3>
          <p className="mt-2 text-sm text-gray-700">
            We’d be honoured to discuss options with you and your advisor. There is no
            obligation and your information will remain private.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <div className="font-semibold">Shawn Howat</div>
              <div className="text-sm text-gray-600">
                President, Board of Directors<br />
                HopeSpring Cancer Support Centre<br />
                55 Benton St, Kitchener, ON N2G
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="h-4 w-4" />
              519-742-4673
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:President@HopeSpring.ca"
                className="underline decoration-emerald-600 decoration-2 underline-offset-2"
              >
                President@HopeSpring.ca
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BIG BANNER WITH CTAS */}
      <section
        className="relative"
        aria-label="Legacy giving banner"
      >
        <img
          src={hopeBanner}
          alt=""
          className="h-[260px] w-full object-cover sm:h-[320px]"
        />
        <div className="absolute inset-0 bg-slate-900/20" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-end justify-center gap-4 px-4 pb-6 sm:justify-start">
            <Link
              to="/donate"
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              GIVE NOW
            </Link>
            <Link
              to="/contact"
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-600"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
