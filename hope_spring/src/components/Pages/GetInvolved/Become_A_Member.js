import React from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  Phone,
  ChevronRight,
  BadgeCheck,
  Baby,
  UserRound,
  UsersRound,
  Stethoscope,
} from "lucide-react";

/** Replace with your assets */
const heroImg =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop";
const benefitsImgRight =
  "https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=1400&auto=format&fit=crop";
const programsImgLeft =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1400&auto=format&fit=crop";
const timelineImg =
  "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1600&auto=format&fit=crop"; // placeholder if you have a custom timeline graphic

const Chip = ({ icon: Icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
    <Icon className="h-3.5 w-3.5" />
    {label}
  </span>
);

const ValueCard = ({ icon: Icon, title, children }) => (
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

export default function BecomeMember() {
  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="h-[340px] w-full object-cover sm:h-[400px] lg:h-[460px]"
          />
          <div className="absolute inset-0 bg-slate-900/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Become a member
            </h1>
            <p className="mt-3 max-w-xl text-white/90">
              Membership gives you easy access to our free programs, services,
              and a caring community—at any stage of the cancer journey.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              >
                <BadgeCheck className="h-4 w-4" />
                Become a Member
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white"
              >
                <Phone className="h-4 w-4" />
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE CHIPS */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="mr-2 font-semibold text-gray-700">
            At HopeSpring, our doors are open to:
          </span>
          <Chip icon={Stethoscope} label="Those with cancer" />
          <Chip icon={BadgeCheck} label="Survivors" />
          <Chip icon={UserRound} label="Post-cancer" />
          <Chip icon={Baby} label="Children" />
          <Chip icon={UsersRound} label="Family" />
          <Chip icon={Users} label="Caregivers" />
          <Chip icon={ShieldCheck} label="Healthcare providers" />
        </div>
      </section>

      {/* HOW TO BECOME */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-extrabold">How to become a member</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-700">
            Fill out the quick online form or contact us directly. Our team will
            guide you through the process and ensure you have ongoing access to
            programs, services, and community support.
          </p>
        </div>
      </section>

      {/* VIDEO + VALUES */}
      <section className="mx-auto max-w-6xl grid-cols-2 gap-10 px-4 py-12 md:grid">
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <div className="aspect-video w-full">
            {/* Replace the src with your actual YouTube video id */}
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Member experience"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div className="grid content-start gap-4">
          <ValueCard icon={HeartHandshake} title="Caring">
            Connect with others who have faced similar experiences. Whether you
            seek information, emotional support, or a safe space to talk, we’re
            here for you every step of the way.
          </ValueCard>
          <ValueCard icon={Users} title="Supportive">
            Trained volunteers and facilitators share information about programs
            and offer emotional support to help individuals living with cancer.
          </ValueCard>
          <ValueCard icon={ShieldCheck} title="Inclusive">
            Thanks to community donations, our programs are free—reducing the
            financial burden so members can focus on healing.
          </ValueCard>
        </div>
      </section>

      {/* JOURNEY / SURVIVORSHIP */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h3 className="text-lg font-extrabold">
            We are here to support you at every stage
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Diagnosis → Treatment → Support → Side effects → Managing
            expectations → Follow-up care → Survivorship.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border">
            <img
              src={timelineImg}
              alt="Cancer journey stages"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* BENEFITS & PROGRAMS (two-feature blocks) */}
      <section className="mx-auto max-w-6xl grid-cols-2 gap-10 px-4 py-12 md:grid">
        {/* Benefits block (text left) */}
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-extrabold">Benefits of membership</h3>
          <p className="mt-2 text-sm text-gray-700">
            Members receive free access to our core services—counselling,
            wellness programs, support groups, gentle exercise, creative arts,
            and more. You are not alone; our services guide you through your
            journey.
          </p>
          <div className="mt-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View all services <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={benefitsImgRight}
            alt="Conversation on couch"
            className="h-80 w-full object-cover md:h-full"
          />
        </div>

        {/* Programs block (image left) */}
        <div className="order-3 overflow-hidden rounded-2xl md:order-3">
          <img
            src={programsImgLeft}
            alt="Group program"
            className="h-80 w-full object-cover md:h-full"
          />
        </div>
        <div className="order-4 flex flex-col justify-center">
          <h3 className="text-xl font-extrabold">Our programs</h3>
          <p className="mt-2 text-sm text-gray-700">
            From yoga and qigong to art and mindfulness, explore programs that
            promote resilience and well-being for patients, survivors,
            caregivers, and families.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Gentle exercise</li>
            <li>Support groups</li>
            <li>Artistic practices</li>
            <li>Reiki / Therapeutic Touch</li>
            <li>Family, youth & children</li>
            <li>Educational workshops</li>
          </ul>
          <div className="mt-4">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View all programs <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* REPEAT CTA */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-extrabold">How to become a member</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-700">
            It’s quick and free. Complete the membership form and we’ll set up
            your account so you can start exploring programs right away.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Become a Member
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
