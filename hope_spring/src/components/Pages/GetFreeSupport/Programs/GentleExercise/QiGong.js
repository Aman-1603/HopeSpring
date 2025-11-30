// src/components/Pages/GetFreeSupport/Programs/GentleExercise/QiGong.js
import GentleExerciseTemplate from "../ProgramTemplate/ProgramTemplate";

const qiGongConfig = {
  slug: "qi-gong",
  categoryName: "Gentle Exercise",
  subcategoryName: "Qi Gong",

  heroImage: "/images/qigong-banner.png", // use your real banner path
  heroAlt: "Qi Gong practice",
  heroTag: "Program – Qi Gong",
  heroTitle: "Qi Gong",
  heroSubtitle:
    "Ancient gentle movements and breathing techniques intended to cultivate and balance life energy.",
  heroCtaLabel: "View & register",

  introTitle: "How can Qi Gong help me?",
  introBody:
    "In this program, you'll explore gentle movement and breath work designed to support balance, calm, and overall wellbeing. Movements are adaptable and suitable for people with different energy levels and mobility.",

  benefitsImage: "/images/qigong-illustration.png", // this was on your old page
  benefitsAlt: "Qi Gong illustration",
  benefits: [
    {
      title: "Gentle full-body movement",
      body:
        "Simple, flowing movements can help reduce stiffness and support circulation.",
    },
    {
      title: "Breath-focused practice",
      body:
        "Coordinating breath and movement may support relaxation and focus.",
    },
    {
      title: "Grounding routine",
      body:
        "Regular practice can become a calming ritual during and after treatment.",
    },
  ],

  facilitators: [
    { name: "Joel", img: "/images/facilitators/Joel.png" }, // same as old page
  ],

  partnerPrograms: [
    {
      title: "Qi Gong with Joel",
      content:
        "Details and sign-up links are available through our partner organizations.",
    },
  ],

  faqImage: "/images/faq-qigong.webp", // or reuse /images/faq-med.webp if you don't have this
  faqAlt: "Qi Gong posture",
  faqItems: [
    {
      title: "Do I need prior experience?",
      content: "No — classes are beginner friendly and adaptable.",
    },
    {
      title: "What do I need to bring?",
      content:
        "Comfortable clothing and water; movements can often be done seated.",
    },
    {
      title: "Is this offered online?",
      content:
        "Some sessions may be offered online via Zoom; check the event listing.",
    },
    {
      title: "Is there a cost?",
      content:
        "Programs are free for members thanks to generous community support.",
    },
  ],

  relatedPrograms: [
    {
      title: "Tai Chi",
      copy: "Slow, flowing movements that support balance and coordination.",
      img:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80",
      to: "/support/programs/gentle-exercise/tai-chi",
    },
    {
      title: "Yoga",
      copy:
        "Gentle yoga to support strength and flexibility at your own pace.",
      img:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
      to: "/support/programs/gentle-exercise/yoga",
    },
    {
      title: "Meditation",
      copy:
        "Mindfulness practices that pair well with Qi Gong as part of a calming routine.",
      img:
        "https://images.unsplash.com/photo-1518300671339-4b0d3d86bfaa?w=900&q=80",
      to: "/support/programs/gentle-exercise/meditation",
    },
  ],
};

export default function QiGongProgramPage() {
  return <GentleExerciseTemplate config={qiGongConfig} />;
}
