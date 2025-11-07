import React from "react";

/* Replace these with your real headshots or local assets */
const PHOTOS = {
  nohelia:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
  mary:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  justin:
    "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop",
  moiz:
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
  vaish:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  dana:
    "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=800&auto=format&fit=crop",
  sierra:
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
  jake:
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
};

const people = [
  {
    name: "Nohelia",
    role: "Members Services, Programming, and Volunteer Lead",
    email: "volunteer@hopespring.ca",
    photo: PHOTOS.nohelia,
  },
  {
    name: "Mary Lou",
    role: "Marketing, Communication, Fundraising",
    email: "marketing@hopespring.ca",
    photo: PHOTOS.mary,
  },
  {
    name: "Justin",
    role: "Grant and Funding Development Lead",
    email: "grantsupport@hopespring.ca",
    photo: PHOTOS.justin,
  },
  {
    name: "Moiz",
    role: "Peer Support",
    email: "peersupport@hopespring.ca",
    photo: PHOTOS.moiz,
  },
  {
    name: "Vaish",
    role: "Accounts/Finance",
    email: "finance@hopespring.ca",
    photo: PHOTOS.vaish,
  },
  {
    name: "Dana",
    role: "Grant Development, Data and Analysis Coordinator",
    email: "communityconnector@hopespring.ca",
    photo: PHOTOS.dana,
  },
  {
    name: "Sierra",
    role: "Social Media Content Creation Marketing Assistant",
    email: "marketing@hopespring.ca",
    photo: PHOTOS.sierra,
  },
  {
    name: "Jake",
    role: "Media and Fundraising Assistant",
    email: "grantsupport@hopespring.ca",
    photo: PHOTOS.jake,
  },
];

const TeamCard = ({ person }) => (
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
    <div className="h-48 w-full overflow-hidden rounded-t-2xl">
      <img
        src={person.photo}
        alt={person.name}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="p-4">
      <div className="font-semibold">{person.name}</div>
      <div className="mt-1 text-xs text-gray-600">{person.role}</div>
      <a
        href={`mailto:${person.email}`}
        className="mt-2 inline-block text-sm text-emerald-700 underline"
      >
        {person.email}
      </a>
    </div>
  </div>
);

export default function OurTeam() {
  return (
    <main className="text-gray-900">
      {/* Page Title */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Our team</h1>
      </header>

      {/* Section Heading + Note */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-xl font-extrabold">Our Team</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          For the quickest response, please call our phone number at{" "}
          <a className="font-semibold" href="tel:5197424673">
            519-742-4673
          </a>
          .
        </p>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <TeamCard key={p.name} person={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
