import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0b1730] text-indigo-100">
      {/* top */}
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-4">
        {/* Brand / contact */}
        <div>
          <Link to="/" className="inline-block mb-3">
            {/* Put /public/images/logo2.png or change src */}
            <img src="/images/logo2.png" alt="HopeSpring" className="h-10 w-auto object-contain" />
          </Link>

          <address className="not-italic text-sm leading-relaxed text-indigo-200/90">
            55 Benton St, Kitchener, ON<br />
            519.742.HOPE (4673)<br />
            <a className="hover:underline text-white" href="mailto:volunteer@hopespring.ca">
              volunteer@hopespring.ca
            </a>
          </address>

          {/* socials */}
          <div className="flex gap-3 mt-4">
            <a aria-label="Facebook" className="p-2 rounded-lg bg-white/10 hover:bg-white/20" href="#" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3H13v7A10 10 0 0 0 22 12z"/></svg>
            </a>
            <a aria-label="Instagram" className="p-2 rounded-lg bg-white/10 hover:bg-white/20" href="#" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.2a1 1 0 1 1-1.9.6 1 1 0 0 1 1.9-.6z"/></svg>
            </a>
            <a aria-label="YouTube" className="p-2 rounded-lg bg-white/10 hover:bg-white/20" href="#" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.8 15.5V8.5L15.6 12z"/></svg>
            </a>
          </div>
        </div>

        {/* Get Started */}
        <FooterCol title="Get Started" links={[
          { label: "I am living with cancer", to: "/get-started/living-with-cancer" },
          { label: "Caregivers & family", to: "/get-started/caregiver-family" },
          { label: "Healthcare partners", to: "/get-started/provider-partner" },
          { label: "Volunteer / Give", to: "/get-started/give-or-volunteer" },
        ]} />

        {/* Free Support */}
        <FooterCol title="Get Free Support" links={[
          { label: "Calendar & Register", to: "/support/calendar" },
          { label: "Programs", to: "/support/programs/support-groups" },
          { label: "Resources", to: "/resources" },
        ]} />

        {/* Get Involved */}
        <FooterCol title="Get Involved" links={[
          { label: "Donate", to: "/donate" },
          { label: "Become a Member", to: "/become-a-member" },
          { label: "Volunteer", to: "/volunteer" },
          { label: "Legacy Giving", to: "/legacy-giving" },
        ]} />
      </div>

      {/* newsletter band */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 grid gap-4 md:grid-cols-[1fr_auto] items-center">
          <p className="text-sm text-indigo-200">
            Subscribe for updates on programs, events, and ways to help.
          </p>
          <form onSubmit={(e)=>e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Email address"
              className="h-10 w-64 max-w-full rounded-lg border border-white/20 bg-white/10 px-3 text-white placeholder:text-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Link
              to="/donate"
              className="hidden"
            />
            <button className="h-10 px-4 rounded-lg bg-white text-[#0b1730] font-semibold">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-indigo-200 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HopeSpring Cancer Support Centre</p>
          <div className="flex gap-4">
            <Link className="hover:underline" to="/about">About</Link>
            <Link className="hover:underline" to="/reports">Reports</Link>
            <a className="hover:underline" href="#" target="_blank" rel="noreferrer">Privacy Policy</a>
            <a className="hover:underline" href="#" target="_blank" rel="noreferrer">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Small column component to keep the JSX tidy */
function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-3 tracking-wide">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) =>
          l.to ? (
            <li key={l.label}>
              <Link to={l.to} className="hover:underline hover:text-white">
                {l.label}
              </Link>
            </li>
          ) : (
            <li key={l.label}>
              <a href={l.href} className="hover:underline hover:text-white" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
