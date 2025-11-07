import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  HandHeart,
  Users,
  Cog,
  UserPlus,
  Upload,
  UserCheck,
  RefreshCcw,
  ChevronRight,
  Quote,
} from "lucide-react";

/* Replace with your real assets */
const heroImg =
  "https://images.unsplash.com/photo-1587351021384-c2d5a7c27b3b?q=80&w=1600&auto=format&fit=crop";
const familyStackImg =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1400&auto=format&fit=crop";
const grandpaHugImg =
  "https://images.unsplash.com/photo-1516826673983-614f5ab2f4f5?q=80&w=1600&auto=format&fit=crop";
const bannerRightImg =
  "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1400&auto=format&fit=crop";

const Feature = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-3 rounded-2xl bg-[#0b2f3f] p-4 text-teal-50/90 ring-1 ring-white/5">
    <div className="rounded-xl bg-white/10 p-2">
      <Icon className="h-5 w-5 text-teal-200" />
    </div>
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  </div>
);

const Step = ({ icon: Icon, title, text }) => (
  <div className="rounded-2xl bg-sky-50 p-5 ring-1 ring-sky-100">
    <div className="mb-3 inline-flex rounded-xl bg-sky-100 p-2">
      <Icon className="h-5 w-5 text-sky-700" />
    </div>
    <h4 className="font-semibold text-sky-900">{title}</h4>
    <p className="mt-1 text-sm text-sky-800/80">{text}</p>
  </div>
);

export default function LifeAfterMe() {
  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <img
          src={heroImg}
          alt=""
          className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-center px-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Your Legacy, Their Hope: Support Cancer Care Through Life After Me
              </h1>
              <div className="mt-4 w-full max-w-sm rounded-xl bg-white/15 p-4 text-white backdrop-blur">
                Organize important info, wishes, and documents in one secure place
                and make a lasting impact by supporting HopeSpring.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP STRIP */}
      <section className="bg-[#0b2f3f] py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-4">
          <Feature icon={ShieldCheck} title="Private & Secure">
            Bank-grade security and encrypted storage for peace of mind.
          </Feature>
          <Feature icon={HandHeart} title="Legacy with Impact">
            Align your planning with charitable support for cancer care.
          </Feature>
          <Feature icon={Users} title="For Loved Ones">
            Reduce confusion and stress—give family clear guidance.
          </Feature>
          <Feature icon={Cog} title="Simple to Use">
            Guided checklists and categories keep everything organized.
          </Feature>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold">Why it matters?</h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            Preparing for the future can feel overwhelming—especially during or
            after a cancer journey. Life After Me makes this process easier,
            helping your loved ones avoid confusion and stress. Just like
            HopeSpring, their mission is rooted in compassion, clarity, and dignity.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={familyStackImg}
            alt="Family smiling"
            className="h-80 w-full object-cover"
          />
        </div>
      </section>

      {/* BIG CTA BAND */}
      <section className="bg-[#0b2f3f] py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h3 className="text-lg font-extrabold text-white">
            Getting started is easy.
          </h3>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-teal-100/90">
            Create an account, add details, choose trusted appointees, and keep
            things up to date. You can also connect your legacy to support
            HopeSpring’s mission.
          </p>
          <div className="mt-4">
            <a
              href="https://lifeafterme.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Access Life After Me <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 4-STEP HOW-TO */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Step
            icon={UserPlus}
            title="1. Account"
            text="Create your account and add basic details to begin."
          />
          <Step
            icon={Upload}
            title="2. Upload"
            text="Add and organize documents, wishes, and important info."
          />
          <Step
            icon={UserCheck}
            title="3. Trusted Appointees"
            text="Nominate people you trust to carry out your wishes."
          />
          <Step
            icon={RefreshCcw}
            title="4. Update"
            text="Keep your information current in minutes as life changes."
          />
        </div>
      </section>

      {/* BENEFITS LIST (placeholder bars to match your screenshot) */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h3 className="text-lg font-extrabold">
          Prepare for the Future, Empower HopeSpring’s Mission
        </h3>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((k) => (
            <div
              key={k}
              className="h-6 w-full rounded-md bg-gray-100 ring-1 ring-gray-200"
            />
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-extrabold">
            Your Story Lives On—So Does Your Impact*
          </h3>
          <figure className="mt-3 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200">
            <Quote className="h-6 w-6 text-gray-500" />
            <blockquote className="mt-2 text-sm text-gray-700">
              “It was great that we had access to all the information my dad
              prepared. He even left a video message for his grandchildren! Life
              After Me makes things easy and truly gives a peace of mind.”
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold">
              — Steve Bellwood
            </figcaption>
          </figure>
          <div className="mt-4">
            <a
              href="https://lifeafterme.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2f3f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d3a4d]"
            >
              Access Life After Me <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={grandpaHugImg}
            alt="Grandparent hugging child"
            className="h-72 w-full object-cover"
          />
        </div>
      </section>

      {/* BANNER CTA WITH LOGOS */}
      <section className="mx-auto max-w-6xl grid-cols-2 items-center gap-6 px-4 py-10 md:grid">
        <div className="rounded-2xl bg-[#0b2f3f] p-6 text-white">
          <h4 className="text-lg font-extrabold">
            You can’t predict the future… But now you can prepare for it
          </h4>
          <p className="mt-2 text-sm text-teal-100/90">
            Make it easier for your loved ones with secure planning. With our
            partnership, you can also choose to uplift HopeSpring’s work for
            patients, survivors, and families.
          </p>
          <div className="mt-4">
            <a
              href="https://lifeafterme.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Access Life After Me <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={bannerRightImg}
            alt="Happy family outdoors"
            className="h-64 w-full object-cover"
          />
        </div>
      </section>

      {/* LOGOS + SOCIAL (simple placeholder row) */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-90">
          <img
            src="https://dummyimage.com/180x58/ffffff/0b2f3f&text=HopeSpring"
            alt="HopeSpring"
            className="h-12"
          />
          <img
            src="https://dummyimage.com/200x58/ffffff/0b2f3f&text=lifeafterme"
            alt="Life After Me"
            className="h-12"
          />
          <div className="mx-2 h-6 w-px bg-gray-300" />
          <div className="flex gap-4 text-slate-700/70">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Pinterest">p</a>
          </div>
        </div>
      </section>
    </main>
  );
}
