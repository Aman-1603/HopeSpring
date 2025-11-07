import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  UsersRound,
  Baby,
  UserRound,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
} from "lucide-react";

const BandChip = ({ icon: Icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/30">
    <Icon className="h-4 w-4" />
    {label}
  </span>
);

const Card = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h4 className="text-base font-extrabold">{title}</h4>
    <div className="mt-3 text-sm text-gray-700">{children}</div>
  </div>
);

export default function ContactUs() {
  const team = [
    {
      name: "Natalie",
      role: "Member Services, Programming, and Volunteer Lead",
      email: "volunteer@hopespring.ca",
    },
    { name: "Mary Lou", role: "Marketing, Communication, Fundraising", email: "marketing@hopespring.ca" },
    { name: "Justin", role: "Grant and Funding Development Lead", email: "grantsupport@hopespring.ca" },
    { name: "Dana", role: "Community Connector", email: "communityconnector@hopespring.ca" },
    { name: "Veda", role: "Accounts/Finance", email: "finance@hopespring.ca" },
  ];

  return (
    <main className="text-gray-900">
      {/* Page title */}
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-extrabold"></h1>
      </header>

      {/* Hero contact block */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-8 md:grid-cols-[1.1fr,1fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Contact Us</h2>
          <p className="mt-2 max-w-lg text-sm text-gray-700">
            Connect with us by filling out the form, giving us a call, or sending an email.
            We’re here to support you and look forward to hearing from you!
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-700" />
              <span>
                General Inquiry:&nbsp;
                <a className="font-semibold" href="tel:5197424673">
                  519-742-HOPE (4673)
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-700" />
              <a className="font-semibold" href="mailto:volunteer@hopespring.ca">
                volunteer@hopespring.ca
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-700" />
              <a className="font-semibold" href="mailto:info@hopespring.ca">
                www.hopespring.ca
              </a>
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            {/* If your general inquiry goes to an external form, swap Link for <a href="…" target="_blank" rel="noreferrer"> */}
            <Link
              to="/contact/general"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              General Inquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Empty right column (kept for screenshot spacing). Put a form or image here if you like. */}
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 md:min-h-[120px]">
          {/* Placeholder – optional content block */}
        </div>
      </section>

      {/* Orange audience band */}
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
            <BandChip icon={ShieldCheck} label="Healthcare provider" />
          </div>
        </div>
      </section>

      {/* Three info cards */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Connect with us">
            <ul className="space-y-1">
              <li>Facebook: @hopespring</li>
              <li>Instagram: @hope_spring</li>
              <li>Twitter: @hope_spring</li>
              <li>LinkedIn: hopespring cancer support centre</li>
              <li>Youtube: @hopespringcs</li>
              <li>Tiktok: @hope__spring</li>
              <li>Pinterest: @Hope__Spring</li>
              <li>Spotify: @HopeSpring Cancer Support Centre</li>
            </ul>
          </Card>

          <Card title="Our location">
            <p>
              In-person programming has begun and is indicated where available in our
              programs and registration section.
            </p>
            <address className="mt-2 not-italic">
              54 Benton St,<br />
              Kitchener, ON N2G 3H2
            </address>
          </Card>

          <Card title="Our hours">
            <p>Monday – Friday from 9am to 5pm</p>
            <p className="mt-1 text-gray-600">
              Closed on Holidays; we resume member care the next business day at 9am.
            </p>
          </Card>
        </div>
      </section>

      {/* Map + address */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid items-start gap-6 md:grid-cols-[420px,1fr]">
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
            {/* Replace src with your real Google Map embed if desired */}
            <iframe
              title="HopeSpring Map"
              className="h-[320px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=54%20Benton%20St%20Kitchener%20ON&z=15&output=embed"
            />
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-base font-extrabold">
              <MapPin className="h-5 w-5 text-emerald-700" />
              HOPESPRING
            </h4>
            <p className="mt-1 text-sm text-gray-700">
              54 Benton St<br />
              Kitchener, ON N2G 3H2
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Bus Stop</li>
              <li>Train/LRT Station</li>
              <li>HopeSpring</li>
              <li>Parking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team member contacts table */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h3 className="mb-3 text-center text-lg font-extrabold md:text-left">
          Team Member Contacts
        </h3>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {team.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.role}</td>
                  <td className="px-4 py-3">
                    <a
                      className="text-emerald-700 underline"
                      href={`mailto:${t.email}`}
                    >
                      {t.email}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
