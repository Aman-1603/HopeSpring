import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export default function Home() {
  const { t } = useTranslation();

  const chips = [
    "home.chips.thoseWithCancer",
    "home.chips.survivors",
    "home.chips.postCancer",
    "home.chips.children",
    "home.chips.family",
    "home.chips.caregivers",
    "home.chips.healthcareProvider"
  ];

  const tiles = [
    { titleKey: "home.tiles.livingWithCancer", bg: "bg-[#ffe7b8]", to: "/get-started/living-with-cancer", img:"/images/living-with-cancer.png" },
    { titleKey: "home.tiles.caregiver", bg: "bg-[#e1f5e6]", to: "/get-started/caregiver-family", img: "/images/caregiver.png" },
    { titleKey: "home.tiles.partner", bg: "bg-[#dff1ff]", to: "/get-started/provider-partner", img: "/images/healthcare.png" },
    { titleKey: "home.tiles.giveVolunteer", bg: "bg-[#e3e5ff]", to: "/get-started/give-or-volunteer", img: "/images/volunteer.png" }
  ];

  const cards = [
    {
      titleKey: "home.cards.freeSupport.title",
      img: "/images/free-support.png",
      textKey: "home.cards.freeSupport.text",
      to: "/support/programs/support-groups",
      altKey: "home.cards.freeSupport.alt"
    },
    {
      titleKey: "home.cards.freePrograms.title",
      img: "/images/free-program.png",
      textKey: "home.cards.freePrograms.text",
      to: "/support/programs/gentle-exercise/meditation",
      altKey: "home.cards.freePrograms.alt"
    },
    {
      titleKey: "home.cards.resources.title",
      img: "/images/free-resource.png",
      textKey: "home.cards.resources.text",
      to: "/resources",
      altKey: "home.cards.resources.alt"
    }
  ];

  const partnerLogos = [
  { src: "/images/partners/activia-logo.webp", alt: "Activia" },
  { src: "/images/partners/cambridge-logo.png", alt: "Cambridge" },
  { src: "/images/partners/canada-logo.png", alt: "Canda" },
  { src: "/images/partners/community-foundations-of-canada-logo.png", alt: "Canadian Cancer Society" },
  { src: "/images/partners/dan-judy-kroetsch-logo.png", alt: "Canadian Tire" },
  { src: "/images/partners/gc-surplus-logo.png", alt: "Caremongers" },
  { src: "/images/partners/george-lunan-foundation.png", alt: "CCRW" },
  { src: "/images/partners/guelph-community-foundation-logo.png", alt: "City of Kitchener" },
  { src: "/images/partners/kitchener-logo.png", alt: "Cobblestone" },
  { src: "/images/partners/merck-logo.png", alt: "Conestoga" },
  { src: "/images/partners/ontario-trillium-logo.png", alt: "DHL" },
  { src: "/images/partners/pfizer-logo.png", alt: "EB Games" },
  { src: "/images/partners/region-of-waterloo-logo.png", alt: "Fairmount" },
  { src: "/images/partners/rexall-logo.png", alt: "GoodLife" },
  { src: "/images/partners/Sponsorship-Logos-for-Website-1.png", alt: "Grand Valley Construction" },
  { src: "/images/partners/st-isidore-catholic-virtual-school-logo.png", alt: "Grant Thornton" },
  { src: "/images/partners/td-charitable-foundation-logo.png", alt: "H&M" },
  { src: "/images/partners/td-wealth-logo.png", alt: "Home Depot" },
  { src: "/images/partners/toyota-motor-manufacturing-logo.png", alt: "Hutton" },
  { src: "/images/partners/wilmot-lions-logo.png", alt: "KW Community Foundation" },
  { src: "/images/partners/WRCF_Logo_RGB.png", alt: "Habitat for Humanity KW" },
  { src: "/images/partners/zonta-logo.png", alt: "KWCF" }
];


  return (
    <>
      {/* HERO (full-bleed background image) */}
      <section className="relative min-h-[420px] md:min-h-[560px]">
        <img
          src="/images/hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffe6bf]/90 via-[#fff3dd]/70 to-white/40" />

        {/* Copy */}
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1
              className="uppercase font-extrabold text-[#0b1c33] tracking-tight
                         text-[clamp(30px,4.6vw,58px)] leading-[0.98]"
            >
              {t("home.hero.weAreHereFor")}{" "}
              <span className="bg-[linear-gradient(transparent_62%,rgba(255,138,0,.45)_62%)]">
                {t("home.hero.everyone")}
              </span>
              .{" "}
              <span className="bg-[linear-gradient(transparent_62%,rgba(255,138,0,.45)_62%)]">
                {t("home.hero.every")}
              </span>{" "}
              {t("home.hero.cancerAnytime")}
            </h1>

            <p className="text-gray-700 mt-4 max-w-xl">
              {t("home.hero.body")}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                className="rounded-xl bg-[#ff8a00] text-black px-5 py-3 font-semibold shadow-sm hover:brightness-110"
                href="#donate"
              >
                {t("home.hero.donateCta")}
              </a>
              <a
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-50"
                href="#call"
              >
                {t("home.hero.callCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ORANGE CHIPS BAR */}
      <section className="bg-[#ff8a00]">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <p className="text-center font-bold text-[#0b1c33]">
            {t("home.chipsBar.title")}
          </p>
          <div
            className="mt-2 flex gap-2 justify-center flex-wrap md:flex-nowrap overflow-x-auto pb-2
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((key) => (
              <span
                key={key}
                className="bg-white border border-white/60 rounded-full px-3.5 py-1.5 text-sm font-semibold shadow-sm"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR QUICK TILES */}
      <section id="get-started" className="py-10 md:py-14">
  <div className="mx-auto max-w-6xl px-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {tiles.map((tile) => (
      <div
        key={tile.titleKey}
        className={`${tile.bg} rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow`}
      >
        <h4 className="font-semibold text-[#0b1c33]">
          {t(tile.titleKey)}
        </h4>

        <Link
          to={tile.to}
          className="inline-flex items-center gap-1 text-[#0e2340] font-semibold mt-2 hover:underline group"
        >
          <span>{t("home.tiles.learnMore")}</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    ))}
  </div>
</section>
  

      {/* THREE SERVICE CARDS */}
<section id="free-support" className="py-10 md:py-14">
  <div className="mx-auto max-w-6xl px-4">
    <h2 className="text-2xl font-bold mb-4 text-[#0b1c33]">
      {t("home.cards.sectionTitle")}
    </h2>

    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.titleKey}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow"
        >
          {/* IMAGE */}
          <div className="h-48 w-full overflow-hidden bg-gray-200">
            <img
              src={card.img}
              alt={t(card.altKey)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* BODY */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-[#0b1c33]">
              {t(card.titleKey)}
            </h3>

            <p className="text-gray-700 mt-1">
              {t(card.textKey)}
            </p>

            <Link
              to = {card.to}
              className="mt-3 inline-block rounded-xl bg-[#0e2340] text-white px-4 py-2 font-semibold hover:brightness-110"
            >
              <span>{t("home.cards.viewCta")}</span>
            </Link>
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
              title="HopeSpring video"
              className="w-full h-full"
              src="https://www.youtube.com/watch?v=FUT2zZYhbfg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-4xl font-bold text-[#0e2340]">
              {t("home.video.statHeadline")}
            </h3>
            <br />
            <h4 className="text-2xl font-bold text-[#0e2340]">
              {t("home.video.missionHeadline")}
            </h4>
            <p className="text-gray-700 mt-2 leading-relaxed">
              {t("home.video.body")}
            </p>
            <br />
            <a
              href="/about"
              className="mt-4 inline-block rounded-xl bg-[#0e2340] text-white px-5 py-3 font-semibold w-fit shadow-sm hover:brightness-110"
            >
              {t("home.video.learnMoreCta")}
            </a>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
{/* PARTNERS – horizontal scroll strip */}
<section className="bg-[#fff7ef]">
  <div className="mx-auto max-w-6xl px-4 py-10">
    <h2 className="text-3xl md:text-4xl font-semibold text-[#0b1c33] text-center mb-3">
      Our Trusted Partners
    </h2>

    <p className="text-gray-700 text-center max-w-3xl mx-auto mb-8">
      {t("home.partners.body")}
    </p>

    <div className="rounded-xl bg-white/60 border border-gray-200 py-4 px-4">
      {/* auto-scrolling marquee */}
      <div className="partner-marquee">
        <div className="partner-marquee-track">
          {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center shrink-0 px-8"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-32 md:h-36 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
    </>
  );
}
