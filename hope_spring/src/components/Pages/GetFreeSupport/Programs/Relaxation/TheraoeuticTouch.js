import ProgramTemplate from "../ProgramTemplate/ProgramTemplate";
import { HeartPulse, Activity, Smile } from "lucide-react";

const therapeuticTouchConfig = {
  slug: "therapeutic-touch",

  // CATEGORY-ONLY MATCH:
  // Any program where normalize(category) === normalize("Therapeutic Touch")
  // will show on this page.
  categoryName: "Therapeutic Touch",
  subcategoryName: "",

  /* ===== Hero ===== */
  heroImage: "/images/therapeutic-banner.png",
  heroAlt: "Therapeutic touch session",
  heroTag: "Program – Therapeutic Touch",
  heroTitle: "Therapeutic Touch",
  heroSubtitle:
    "A gentle, non-invasive technique that aims to promote relaxation, reduce stress, and support the body’s natural healing processes.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can Therapeutic Touch help me?",
  introBody:
    "Therapeutic Touch is a healing technique designed to help restore balance and the body’s natural flow of energy. Delivered by experienced practitioners, sessions can provide profound relaxation, a sense of calm, and improved well-being. Appointments can be adapted to your comfort and energy levels.",

  /* ===== Benefits ===== */
  benefitsImage: "/images/therapeutic-touch-benefits.png",
  benefitsAlt: "Hand therapy",
  benefits: [
    {
      title: "Stress reduction",
      body:
        "Helps alleviate stress, anxiety, and tension associated with treatment or recovery by supporting deep relaxation.",
      icon: <HeartPulse className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Pain management",
      body:
        "May ease discomfort and pain using gentle, non-invasive techniques that support comfort and ease.",
      icon: <Activity className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Emotional well-being",
      body:
        "Supports emotional and mental well-being during challenging times and fosters a sense of connection and calm.",
      icon: <Smile className="h-5 w-5" aria-hidden />,
    },
  ],

  /* ===== Facilitators / Practitioners ===== */
  facilitators: [
    {
      name: "Gloria",
      img: "/images/facilitators/gloria.png",
    },
    {
      name: "Susanne",
      img: "/images/facilitators/Susanne.png",
    },
  ],

  /* ===== FAQ ===== */
  faqImage: "/images/tt-suggestion.png",
  faqAlt: "Therapist preparing session",
  faqItems: [
    {
      title: "Is Therapeutic Touch safe during treatment?",
      content:
        "When provided by trained practitioners and with guidance from your care team, Therapeutic Touch can be a gentle complementary option.",
    },
    {
      title: "Do I need a referral?",
      content:
        "Generally no for HopeSpring programs, though some external clinics or insurers may require one. Check program details if unsure.",
    },
    {
      title: "Can sessions be adapted to fatigue or limited mobility?",
      content:
        "Yes—positioning, duration, and pacing are tailored to your comfort, energy levels, and any mobility needs.",
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
      title: "Meditation",
      copy:
        "Guided mindfulness practices to reduce stress and support day-to-day resilience.",
      img: "/images/meditation-banner.png",
      to: "/support/programs/gentle-exercise/meditation",
    },
    {
      title: "Reiki",
      copy:
        "A gentle energy-based approach that supports relaxation and natural balance.",
      img: "/images/reiki-suggestion.png",
      to: "/support/programs/relaxation/reiki",
    },
  ],
};

export default function TherapeuticTouchPage() {
  return <ProgramTemplate config={therapeuticTouchConfig} />;
}
