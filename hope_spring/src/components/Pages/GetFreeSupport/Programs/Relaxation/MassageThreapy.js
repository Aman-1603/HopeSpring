import ProgramTemplate from "../ProgramTemplate/ProgramTemplate";
import {
  HeartPulse,
  Activity,
  MessageSquareHeart,
} from "lucide-react";

const massageTherapyConfig = {
  slug: "massage-therapy",

  // CATEGORY-ONLY MATCH:
  // Any program where normalize(category) === normalize("Massage Therapy")
  // will appear on this page.
  categoryName: "Massage Therapy",
  subcategoryName: "",

  /* ===== Hero ===== */
  heroImage: "/images/massage-therapy-banner.png",
  heroAlt: "Massage therapy session",
  heroTag: "Program – Massage Therapy",
  heroTitle: "Massage Therapy",
  heroSubtitle:
    "Massage therapy can aid in reducing muscle tension, improving circulation, and providing relief from pain and fatigue.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can Massage Therapy help me?",
  introBody:
    "Massage therapy is a hands-on technique that works with the soft tissues of the body to promote relaxation, ease muscle tension, reduce pain, and support overall well-being. It can benefit cancer patients, survivors, and caregivers by providing physical and emotional relief throughout the cancer journey.",

  /* ===== Benefits ===== */
  benefitsImage: "/images/massage-therapy-benefits.png",
  benefitsAlt: "Back massage",
  benefits: [
    {
      title: "Stress reduction",
      body:
        "Massage can help reduce stress and anxiety by promoting deep relaxation and calmness in a nurturing environment.",
      icon: <HeartPulse className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Pain alleviation",
      body:
        "Gentle techniques may decrease muscle tension, ease discomfort associated with treatment side effects, and support better sleep.",
      icon: <Activity className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Communication and connection",
      body:
        "Sessions offer a supportive space to share concerns and preferences, strengthening trust between participant and practitioner.",
      icon: <MessageSquareHeart className="h-5 w-5" aria-hidden />,
    },
  ],

  /* ===== Facilitators / Practitioners ===== */
  facilitators: [
    {
      name: "Ian",
      img: "/images/facilitators/Ian.png",
    },
    {
      name: "Christian",
      img: "/images/facilitators/Ian.png", // swap to Christian's photo when you have it
    },
  ],

  /* ===== FAQ ===== */
  faqImage: "/images/massage-therapy-suggestion.png",
  faqAlt: "Therapist preparing massage room",
  faqItems: [
    {
      title: "Is massage therapy safe during cancer treatment?",
      content:
        "When provided by trained practitioners familiar with oncology care, massage can be a safe and supportive option. Always consult your care team for personal guidance.",
    },
    {
      title: "Do I need a referral?",
      content:
        "Some programs or insurers may require one. HopeSpring programs typically do not, but verification is recommended for your situation.",
    },
    {
      title: "Can sessions be adapted for fatigue or limited mobility?",
      content:
        "Yes. Positioning, pressure, and session length can all be adjusted to your comfort and energy levels.",
    },
  ],

  /* ===== Related programs (You May Also Like) ===== */
  relatedPrograms: [
    {
      title: "Reiki",
      copy:
        "An energy-focused technique intended to support balance, relaxation, and well-being.",
      img: "/images/reiki-suggestion.png",
      to: "/support/programs/relaxation/reiki",
    },
    {
      title: "Therapeutic Touch",
      copy:
        "A gentle approach focused on supporting relaxation and balance, delivered by trained practitioners.",
      img: "/images/therupatic-theraphy.png",
      to: "/support/programs/relaxation/therapeutic-touch",
    },
    {
      title: "Meditation",
      copy:
        "Mindfulness exercises to reduce stress and support daily well-being; encouraged as a home practice.",
      img: "/images/yoga-suggestion.png",
      to: "/support/programs/gentle-exercise/meditation",
    },
  ],
};

export default function MassageTherapyPage() {
  return <ProgramTemplate config={massageTherapyConfig} />;
}
