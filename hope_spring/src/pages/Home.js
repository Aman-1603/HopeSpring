export default function Home() {
  const chips = [
    "Those with cancer",
    "Survivors",
    "Post-cancer",
    "Children",
    "Family",
    "Caregivers",
    "Healthcare provider",
  ];

  const tiles = [
    { title: "I am living with cancer or I am a survivor", bg: "bg-[#ffe7b8]" },
    { title: "I am a caregiver/supporter/family", bg: "bg-[#e1f5e6]" },
    { title: "I am a healthcare/community partner", bg: "bg-[#dff1ff]" },
    { title: "I want to give or volunteer", bg: "bg-[#e3e5ff]" },
  ];

  const cards = [
    { title: "Free Support Services", text: "Counselling and practical programs to navigate challenges." },
    { title: "Free Programs", text: "Exercise, meditation, family support, and more." },
    { title: "Community Resources", text: "Local groups and cancer-care information." },
  ];

  return (
    <>
      {/* HERO (full-bleed background image) */}
      <section className="relative min-h-[420px] md:min-h-[560px]">
        {/* Background image (place file at public/images/hero.png or change the path) */}
        <img
          src="/images/hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient wash for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffe6bf]/90 via-[#fff3dd]/70 to-white/40" />

        {/* Copy */}
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1
              className="uppercase font-extrabold text-[#0b1c33] tracking-tight
                         text-[clamp(30px,4.6vw,58px)] leading-[0.98]"
            >
              We are here for{" "}
              <span className="bg-[linear-gradient(transparent_62%,rgba(255,138,0,.45)_62%)]">
                everyone
              </span>
              .{" "}
              <span className="bg-[linear-gradient(transparent_62%,rgba(255,138,0,.45)_62%)]">
                every
              </span>{" "}
              cancer. anytime.
            </h1>

            <p className="text-gray-700 mt-4 max-w-xl">
              We are a community-based, charitable non-profit dedicated to supporting
              individuals impacted by cancer. Our mission is to empower and enhance
              emotional, physical, and mental well-being at every stage of the journey.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                className="rounded-xl bg-[#ff8a00] text-black px-5 py-3 font-semibold shadow-sm hover:brightness-110"
                href="#donate"
              >
                Donate
              </a>
              <a
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-50"
                href="#call"
              >
                519-742-4673
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ORANGE CHIPS BAR */}
      <section className="bg-[#ff8a00]">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <p className="text-center font-bold text-[#0b1c33]">
            At HopeSpring, our doors are open to anyone. Period.
          </p>
          <div
            className="mt-2 flex gap-2 justify-center flex-wrap md:flex-nowrap overflow-x-auto pb-2
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((t) => (
              <span
                key={t}
                className="bg-white border border-white/60 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR QUICK TILES */}
      <section id="get-started" className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.title}
              className={`${t.bg} rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow`}
            >
              <h4 className="font-semibold text-[#0b1c33]">{t.title}</h4>
              <a
                href="#learn"
                className="text-[#0e2340] font-semibold inline-block mt-2 hover:underline"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* THREE SERVICE CARDS */}
      <section id="free-support" className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold mb-4 text-[#0b1c33]">
            Free support for patients, loved ones, and caregivers — every step of the journey
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((c) => (
              <article
                key={c.title}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow"
              >
                <div className="h-48 w-full bg-gray-200 grid place-content-center text-gray-500">
                  Image
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#0b1c33]">{c.title}</h3>
                  <p className="text-gray-700 mt-1">{c.text}</p>
                  <a
                    href="#more"
                    className="mt-3 inline-block rounded-xl bg-[#0e2340] text-white px-4 py-2 font-semibold hover:brightness-110"
                  >
                    View →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO + STAT */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 lg:grid-cols-2">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-md">
            <iframe
              title="Video Test"
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-[#0e2340]">
              2 in 5 Canadians are expected to be diagnosed with cancer in their lifetime.
            </h3>
            <p className="text-gray-700 mt-2 leading-relaxed">
              This column sits beside the video on desktop and stacks on mobile.
              If it stacks cleanly, your responsive grid is working.
            </p>
            <a
              href="#about"
              className="mt-4 inline-block rounded-xl bg-[#0e2340] text-white px-5 py-3 font-semibold w-fit shadow-sm hover:brightness-110"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-[#fff7ef]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-20 rounded-xl bg-white/60 border border-gray-200 grid place-content-center text-gray-500">
            Partner logos strip
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#fff6ea] border-y border-[#ffe3bf] py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-4 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl font-bold text-[#0b1c33]">Subscribe to our Newsletter</h3>
            <p className="text-gray-700">Get updates on events, programs, and ways to help.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Email address"
              className="flex-1 h-11 rounded-xl border border-gray-300 px-3 placeholder:text-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#0e2340]/30"
            />
            <button className="h-11 px-5 rounded-xl bg-[#0e2340] text-white font-semibold shadow-sm hover:brightness-110">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
