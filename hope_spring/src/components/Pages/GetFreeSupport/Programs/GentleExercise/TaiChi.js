// src/components/Pages/GetFreeSupport/Programs/GentleExercise/TaiChi.js
import GentleExerciseTemplate from "../ProgramTemplate/ProgramTemplate";

const taiChiConfig = {
  slug: "tai-chi",
  categoryName: "Gentle Exercise",
  subcategoryName: "Tai Chi",

  heroImage: "/images/tai-chi-banner.png", // use your real banner or leave null
  heroAlt: "Person practising Tai Chi",
  heroTag: "Program – Tai Chi",
  heroTitle: "Tai Chi",
  heroSubtitle:
    "A mindful practice with flowing movements that combines balance, breath, and gentle strength.",
  heroCtaLabel: "View & register",

  introTitle: "How can Tai Chi help me?",
  introBody:
    "Tai Chi uses slow, flowing movements to support balance, coordination, and relaxation. It can be especially helpful for people who want gentle movement that respects fatigue, pain, or limited mobility.",

  benefitsImage: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80",
  benefitsAlt: "Tai Chi illustration",
  benefits: [
    {
      title: "Improved balance",
      body:
        "Regular practice can help with stability and may reduce the risk of falls.",
    },
    {
      title: "Gentle strengthening",
      body:
        "Low-impact movements can support joint mobility and overall strength.",
    },
    {
      title: "Calming routine",
      body:
        "The meditative pace of Tai Chi can support mental focus and calm.",
    },
  ],

  facilitators: [
    {
      name: "Tai Chi facilitator",
      img: "/images/facilitators/tai-chi-placeholder.png",
    },
    // swap to real people/images when you have them
  ],

  partnerPrograms: [],

  faqImage: "/images/faq-taichi.webp",
  faqAlt: "Tai Chi posture",
  faqItems: [
    {
      title: "Is Tai Chi safe if I have limited mobility?",
      content:
        "Movements can be done standing or seated; speak with your instructor about adaptations.",
    },
    {
      title: "What should I wear?",
      content:
        "Comfortable clothing that allows free movement; flat shoes or bare feet.",
    },
    {
      title: "Is experience required?",
      content:
        "No. Classes are beginner friendly and focus on learning the basics.",
    },
    {
      title: "Is there a cost?",
      content:
        "Programs are free for members thanks to generous community support.",
    },
  ],

  relatedPrograms: [
    {
      title: "Qi Gong",
      copy:
        "Gentle movements and breathwork intended to cultivate and balance life energy.",
      img:
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
      to: "/support/programs/gentle-exercise/qigong",
    },
    {
      title: "Yoga",
      copy:
        "Gentle, adaptable yoga classes to support strength and flexibility.",
      img:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
      to: "/support/programs/gentle-exercise/yoga",
    },
    {
      title: "Meditation",
      copy: "Mindfulness practices to support emotional resilience and calm.",
      img:
        "https://images.unsplash.com/photo-1518300671339-4b0d3d86bfaa?w=900&q=80",
      to: "/support/programs/gentle-exercise/meditation",
    },
  ],
};

export default function TaiChiProgramPage() {
  return <GentleExerciseTemplate config={taiChiConfig} />;
}
