import ProgramTemplate from "../ProgramTemplate/ProgramTemplate";
import {
  HeartPulse,
  Activity,
  MessageSquareHeart,
} from "lucide-react";

const reikiConfig = {
  slug: "reiki",

  // CATEGORY-ONLY MATCH:
  // Any program where normalize(category) === normalize("Reiki")
  // will show on this page.
  categoryName: "Reiki",
  subcategoryName: "",

  /* ===== Hero ===== */
  heroImage: "/images/reiki-banner.png",
  heroAlt: "Reiki session",
  heroTag: "Program – Reiki",
  heroTitle: "Reiki",
  heroSubtitle:
    "Reiki helps with stress reduction and relaxation and can support healing through gentle, grounding techniques.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can Reiki help me?",
  introBody:
    "Reiki is an ancient healing technique. In many sessions, healing energy is channeled from the practitioner to the individual to enhance energy, reduce stress, and ease pain and fatigue. Sessions are gentle and can be adapted for comfort, focusing on relaxation and overall well-being.",

  /* ===== Benefits ===== */
  benefitsImage: "/images/reiki-benefits.png",
  benefitsAlt: "Reiki session",
  benefits: [
    {
      title: "Stress reduction",
      body:
        "Calms the mind and body, supporting deep relaxation and a sense of inner peace.",
      icon: <HeartPulse className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Pain alleviation",
      body:
        "May provide relief from discomfort and support the body’s natural healing mechanisms.",
      icon: <Activity className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Emotional support",
      body:
        "Offers emotional balance and a greater sense of overall well-being during challenging times.",
      icon: <MessageSquareHeart className="h-5 w-5" aria-hidden />,
    },
  ],

  /* ===== Practitioners / Facilitators ===== */
  facilitators: [
    { name: "Juliette", img: "/images/facilitators/juliette.png" },
    { name: "Linda", img: "/images/facilitators/Linda.png" },
    { name: "Peter", img: "/images/facilitators/Peter.png" },
    { name: "Rebecca", img: "/images/facilitators/Rebecca.png" },
  ],

  /* ===== FAQ ===== */
  faqImage: "/images/reiki-suggestion.png",
  faqAlt: "Reiki setting",
  faqItems: [
    {
      title: "Is Reiki safe during cancer treatment?",
      content:
        "When provided by trained practitioners and in consultation with your care team, Reiki can be a gentle complementary option.",
    },
    {
      title: "Do I need a referral?",
      content:
        "HopeSpring programs typically do not require a referral, though insurers or external clinics may have different requirements.",
    },
    {
      title: "Can sessions be adapted for fatigue or limited mobility?",
      content:
        "Yes. Positioning, pacing, and duration can be tailored to your comfort, mobility, and energy levels.",
    },
  ],

  /* ===== Related programs (You May Also Like) ===== */
  relatedPrograms: [
    {
      title: "Massage Therapy",
      copy:
        "Hands-on techniques that promote relaxation, reduce pain, and enhance overall well-being.",
      img: "/images/massage-therapy-banner.png",
      to: "/support/programs/relaxation/massage-therapy",
    },
    {
      title: "Therapeutic Touch",
      copy:
        "A gentle, non-invasive approach that supports relaxation and natural balance.",
      img: "/images/therapeutic-banner.png",
      to: "/support/programs/relaxation/therapeutic-touch",
    },
    {
      title: "Meditation",
      copy:
        "Mindfulness practices to calm the mind and support day-to-day resilience.",
      img: "/images/meditation-banner.png",
      to: "/support/programs/gentle-exercise/meditation",
    },
  ],
};

export default function ReikiProgramPage() {
  return <ProgramTemplate config={reikiConfig} />;
}
