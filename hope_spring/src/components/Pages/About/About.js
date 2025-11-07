import React from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  HeartPulse,
  UsersRound,
  UserRound,
  Baby,
} from "lucide-react";

/* ====== Replace these with your own assets ====== */
const heroImg =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop"; // dandelion
const hopeRocksImg =
  "https://images.unsplash.com/photo-1600959907703-30f5b7b9559a?q=80&w=1400&auto=format&fit=crop";
const teamImg =
  "https://images.unsplash.com/photo-1530034228571-ecfbe4c7e714?q=80&w=1400&auto=format&fit=crop";
const communityImg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop";
const histStartImg =
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop";
const histUniteImg =
  "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop";
const histRebirthImg =
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1200&auto=format&fit=crop";
const joinImg =
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1400&auto=format&fit=crop";
/* ================================================ */

const BandChip = ({ icon: Icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/30">
    <Icon className="h-4 w-4" />
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

const HistoryCard = ({ number, title, img, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
    <div className="overflow-hidden rounded-xl">
      <img src={img} alt={title} className="h-44 w-full object-cover" />
    </div>
    <div className="mt-3 text-xs font-semibold text-gray-600">{number}. {title}</div>
    <p className="mt-1 text-sm text-gray-700">{children}</p>
  </div>
);

export default function AboutUs() {
  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <img
          src={heroImg}
          alt=""
          className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[420px]"
        />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-center px-4">
            <h1 className="rounded-xl bg-white/80 px-6 py-3 text-3xl font-extrabold text-slate-900 backdrop-blur">
              Inspire. Empower. Hope.
            </h1>
          </div>
        </div>
      </section>

      {/* ORANGE AUDIENCE BAND */}
      <section className="bg-orange-500 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold text-white md:text-left">
            At HopeSpring, Our Doors Are Open To Anyone. Period.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <BandChip icon={HeartPulse} label="Those with cancer" />
            <BandChip icon={UsersRound} label="Survivors" />
            <BandChip icon={UserRound} label="Post cancer" />
            <BandChip icon={Baby} label="Children" />
            <BandChip icon={UsersRound} label="Family" />
            <BandChip icon={UsersRound} label="Caregivers" />
            <BandChip icon={ShieldCheck} label="Medical partners" />
          </div>
        </div>
      </section>

      {/* MISSION / STORY */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold">Our Mission</h2>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            We empower individuals affected by cancer to enhance their emotional,
            physical, spiritual, social, and mental well-being. We provide
            programs, support, and resources that help people feel more in
            control of their lives—within a caring community that promotes
            holistic wellness.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img src={teamImg} alt="Team" className="h-64 w-full object-cover" />
          </div>
        </div>

        <div className="md:pt-10">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={hopeRocksImg}
              alt="Hope rocks"
              className="h-64 w-full object-cover"
            />
          </div>
          <h3 className="mt-6 text-xl font-extrabold text-gray-800">Our Story</h3>
          <p className="mt-2 text-sm leading-7 text-gray-700">
            Since opening in 1996, we’ve supported those who have been affected
            by cancer in many ways. We provide compassionate care to people who
            have had a positive cancer diagnosis, survivors, and their support
            circles. With education, navigation, peer connection, wellness
            workshops, and more, we are a community-based non-profit that relies
            entirely on donations from the community for daily operations and programs.
          </p>
        </div>
      </section>

      {/* BUILDING A COMPASSIONATE COMMUNITY */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr,1fr]">
            <div>
              <h3 className="text-3xl font-extrabold leading-tight">
                Building A Compassionate Community
              </h3>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img
                  src={communityImg}
                  alt="Community"
                  className="h-64 w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <ValueCard icon={HeartHandshake} title="Caring">
                HopeSpring is more than a place—it’s a community. Whether you
                need information, emotional support, or a safe space to talk,
                we’re here for you.
              </ValueCard>
              <ValueCard icon={Users} title="Supportive">
                Trained volunteers generously offer time and knowledge about
                programs and services, and provide emotional support.
              </ValueCard>
              <ValueCard icon={ShieldCheck} title="Inclusive">
                Thanks to community donations, we remove the financial burden so
                individuals and families can focus on healing.
              </ValueCard>
            </div>
          </div>
        </div>
      </section>

      {/* OUR HISTORY */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="mb-5 text-center text-lg font-extrabold">Our History</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <HistoryCard
            number="4"
            title="Community Unites"
            img={histUniteImg}
          >
            In 2017, after 20+ years of support, HopeSpring closed its doors.
            The community rallied with generosity from faith groups, clubs, and
            local fundraising—proving HopeSpring creates real, transformative
            impact in people’s lives.
          </HistoryCard>

          <HistoryCard
            number="5"
            title="HopeSpring’s rebirth"
            img={histRebirthImg}
          >
            With a strengthened balance sheet and renewed leadership, we focused
            on sustainability and strategic growth to serve cancer patients
            across the Waterloo Region and beyond.
          </HistoryCard>

          <HistoryCard
            number="1"
            title="The Start of HopeSpring"
            img={histStartImg}
          >
            Established in 1996 to provide vital programs and services to
            Waterloo Region residents affected by cancer, later expanding to
            Cambridge through the Chaplin Family YMCA partnership.
          </HistoryCard>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-14 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl">
          <img src={joinImg} alt="Join" className="h-80 w-full object-cover" />
        </div>
        <div>
          <h3 className="text-3xl font-extrabold leading-tight">
            Join The HopeSpring Community
          </h3>
          <p className="mt-3 text-sm text-gray-700">
            A cancer diagnosis can be devastating; the emotional toll can be as
            challenging as the physical disease itself. That’s why HopeSpring
            has created a warm, supportive community with low-barrier access to
            emotional and social support, plus the tools needed for empowerment,
            personal growth, and self-help.
          </p>
          <div className="mt-5">
            <Link
              to="/join"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
