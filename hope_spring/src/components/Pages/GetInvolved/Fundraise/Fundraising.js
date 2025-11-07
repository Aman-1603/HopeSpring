import React from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  HelpCircle,
  PiggyBank,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";

/* ---------- Replace with your own assets ---------- */
const heroImg =
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop";
const hopeSignImg =
  "https://images.unsplash.com/photo-1533075377284-02188f1f4a6b?q=80&w=1400&auto=format&fit=crop";
const balanceRocksImg =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop";

const gallery = [
  "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515165562835-c3b8c1c3b4f0?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532634896-26909d0d4b6a?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518602164578-cd0074062764?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508606572321-901ea443707f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512427691650-44c5022b0a19?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975619635-0f37a1e2e2b0?q=80&w=900&auto=format&fit=crop",
];

const WhyCard = ({ icon: Icon, title, children }) => (
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

const ResourceRow = ({ title, href = "#", children }) => (
  <li className="rounded-xl border border-dashed border-gray-300 bg-white">
    <details>
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold">
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          {title}
        </span>
        <span className="text-gray-500">+</span>
      </summary>
      <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
        {children || "Templates, examples, and tips to help you get started."}
        <div className="mt-3">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>
    </details>
  </li>
);

export default function Fundraising() {
  return (
    <main className="text-gray-900">
      {/* HERO */}
      <section className="relative">
        <img
          src={heroImg}
          alt=""
          className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
        />
        <div className="absolute inset-0 bg-slate-900/25" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
            <h1 className="rounded-xl bg-white/90 px-4 py-2 text-2xl font-extrabold text-slate-900 shadow-sm backdrop-blur">
              Host a fundraiser
            </h1>
          </div>
        </div>
      </section>

      {/* INTRO STORY */}
      <section className="mx-auto max-w-6xl grid-cols-2 gap-10 px-4 py-12 md:grid">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={hopeSignImg}
            alt="HOPE event"
            className="h-80 w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-extrabold">
            Together, we can turn fear into hope—and isolation into community
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Cancer remains a leading cause of death in Canada. In that moment,
            fear, uncertainty, and isolation can take hold. At HopeSpring Cancer
            Support Centre, we believe no one should face cancer alone. Your
            fundraiser ensures our programs—counselling, gentle exercise,
            support groups, and workshops—stay free for those who need them.
          </p>
        </div>
      </section>

      {/* WHY FUNDRAISE */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl grid-cols-2 items-start gap-10 px-4 md:grid">
          <div>
            <h3 className="text-2xl font-extrabold">
              Fundraise now because cancer doesn’t wait
            </h3>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <img
                src={balanceRocksImg}
                alt="Balanced stones"
                className="h-64 w-full object-cover"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <WhyCard icon={Clock3} title="“I don’t have time to plan.”">
              We’ll provide planning tools, templates, and quick ideas that fit
              your schedule—like an online campaign or workplace challenge.
            </WhyCard>
            <WhyCard icon={HelpCircle} title="“I don’t know how to fundraise.”">
              You don’t need to be an expert. Share your story and why you
              care—we’ll provide messages, tips, and templates.
            </WhyCard>
            <WhyCard
              icon={PiggyBank}
              title="“I’m not sure I can raise enough to make a difference.”"
            >
              Every dollar counts. Whether you raise $50 or $5,000, your impact
              provides free programs and community support.
            </WhyCard>
          </div>
        </div>
      </section>

      {/* HOST + RESOURCES */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <h3 className="text-xl font-extrabold">Host a Fundraiser</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-700">
            Ready to go or looking for inspiration? Explore the resources
            below—step-by-step guides, checklists, FAQs, and templates.
          </p>
        </div>

        <ul className="mx-auto mt-6 max-w-3xl space-y-2">
          <ResourceRow
            title="Step-by-Step Fundraiser Guide"
            href="/downloads/fundraiser-guide.pdf"
          />
          <ResourceRow
            title="Fundraising Event Planning Checklist"
            href="/downloads/fundraising-checklist.pdf"
          />
          <ResourceRow
            title="Post-Fundraiser Report"
            href="/downloads/post-fundraiser-report.docx"
          />
          <ResourceRow
            title="FAQ — Fundraising & Donating to HopeSpring"
            href="/downloads/fundraising-faq.pdf"
          />
          <ResourceRow
            title="Tax Receipting Guidelines"
            href="/downloads/tax-receipting.pdf"
          />
          <ResourceRow
            title="Raffle/Lottery Guidelines"
            href="/downloads/raffle-guidelines.pdf"
          />
        </ul>

        <div className="mt-8 text-center">
          {/* If your form is external, replace Link with <a href="…" target="_blank" rel="noreferrer"> */}
          <Link
            to="/fundraising/form"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start a Fundraiser <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="mb-4 text-center text-xl font-extrabold md:text-left">
            Fundraising stories
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gallery.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl">
                <img
                  src={src}
                  alt=""
                  className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
