import React from "react";
import { Link } from "react-router-dom";

/* Replace with your real headshots */
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1000&auto=format&fit=crop`;
const PH = {
  shawn: img("1544006659-f0b21884ce1d"),      // placeholder
  wendy: img("1517841905240-472988babdf9"),
  jenniferM: img("1524504388940-b1c1722653e1"),
  gloria: img("1544005313-94ddf0286df2"),
  aisling: img("1524502397800-2eeaad7c3fe5"),
  tara: img("1520975619635-0f37a1e2e2b0"),
  atinuke: img("1520975661595-6453be3f7070"),
  jenniferW: img("1519682337058-a94d519337bc"),
  john: img("1500648767791-00dcc994a43e"),
};

const directors = [
  {
    name: "Shawn Hlowatzki",
    role: "President, Communications Chair",
    email: "president@hopespring.ca",
    photo: PH.shawn,
  },
  {
    name: "Wendy Lague",
    role: "Treasurer; Finance, Risk, and Audit Chair",
    email: "treasurer@hopespring.ca",
    photo: PH.wendy,
  },
  {
    name: "Jennifer Markovic",
    role: "Technology Lead",
    email: "infotech@hopespring.ca",
    photo: PH.jenniferM,
  },
  {
    name: "Gloria Shoon",
    role: "Director at Large",
    email: "—",
    photo: PH.gloria,
  },
  {
    name: "Aisling Dennett",
    role: "Director at Large",
    email: "—",
    photo: PH.aisling,
  },
  {
    name: "Tara Brown",
    role: "Recording Secretary",
    email: "—",
    photo: PH.tara,
  },
  {
    name: "Atinuke Olajid",
    role: "Director at Large",
    email: "—",
    photo: PH.atinuke,
  },
  {
    name: "Jennifer White",
    role: "Director at Large",
    email: "—",
    photo: PH.jenniferW,
  },
  {
    name: "John Baxter",
    role: "Director at Large",
    email: "—",
    photo: PH.john,
  },
];

const AdvisorRow = ({ name }) => (
  <div className="rounded-xl bg-gray-100 py-3 pl-4 pr-3 text-sm text-gray-700 ring-1 ring-gray-200">
    {name}
  </div>
);

const DirectorCard = ({ p }) => (
  <div className="flex gap-4">
    <div className="h-40 w-64 shrink-0 overflow-hidden rounded-xl ring-1 ring-gray-200">
      <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
    </div>
    <div className="pt-1">
      <div className="font-semibold">{p.name}</div>
      <div className="mt-1 text-xs text-gray-600">{p.role}</div>
      {p.email !== "—" && (
        <a
          href={`mailto:${p.email}`}
          className="mt-2 inline-block text-xs font-medium text-emerald-700 underline"
        >
          {p.email}
        </a>
      )}
    </div>
  </div>
);

export default function BoardOfDirectors() {
  return (
    <main className="text-gray-900">
      {/* Title */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Board of directors</h1>
      </header>

      {/* Board grid */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-center text-xl font-extrabold">
          Board of Directors
        </h2>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {directors.map((p) => (
            <DirectorCard key={p.name} p={p} />
          ))}
        </div>
      </section>

      {/* Advisory board (light bars like the mock) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="mb-4 text-center text-lg font-extrabold">
          Advisory Board
        </h3>
        <div className="space-y-3">
          {[
            "Advisory Board Members",
            "Tammy Robinson Simmons",
            "Adela Dobrowski",
            "Betty Ann Haller",
          ].map((n) => (
            <AdvisorRow key={n} name={n} />
          ))}
        </div>
      </section>

      {/* HOPE banner with CTAs */}
      <section className="relative">
        <img
          src="https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="h-[300px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-end gap-3 px-4 pb-6">
            {/* If external (e.g., CanadaHelps), swap Link for <a href="…" target="_blank" rel="noreferrer"> */}
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
