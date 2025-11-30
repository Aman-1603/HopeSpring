import GentleExerciseTemplate from "../ProgramTemplate/ProgramTemplate";

const meditationConfig = {
  slug: "meditation",
  categoryName: "Gentle Exercise",
  subcategoryName: "Meditation",

  heroImage: "/images/meditation-banner.png",
  heroAlt: "Person meditating on a beach at sunrise",
  heroTag: "Program – Meditation",
  heroTitle: "Meditation",
  heroSubtitle:
    "Meditation can help cultivate healthy thought management by exercising control over thoughts and emotions.",
  heroCtaLabel: "View & register",

  introTitle: "How can meditation help me?",
  introBody:
    "In this group program, cancer patients, survivors, and caregivers are taught mindfulness meditation exercises and are encouraged to practice meditation at home as a daily routine. This program is especially suited to members who are trying meditation for the first time.",

  benefitsImage: "/images/meditation-benefits.png",
  benefitsAlt: "Balanced stones near calm water",
  benefits: [
    {
      title: "Enhanced Emotional Resilience",
      body:
        "Mindfulness techniques can help you cope with stress, anxiety, and uncertainty more effectively.",
    },
    {
      title: "Enhanced Sleep Quality",
      body:
        "Regular meditation may support healthier sleep patterns leading to better vitality.",
    },
    {
      title: "Heightened Mind–Body Connection",
      body:
        "Becoming more attuned to your body's signals can aid in making informed health decisions and managing discomfort.",
    },
  ],

  facilitators: [
    { name: "Tammy", img: "/images/facilitators/Tammy.png" },
    { name: "Melissa", img: "/images/facilitators/Melissa.png" },
    { name: "Kris & Vani", img: "/images/facilitators/Kris-and-Vani-1.png" },
  ],

  partnerPrograms: [
    { title: "Mantra meditation with Kris and Vani" },
    { title: "Meditations for Breast Cancer" },
    { title: "Meditations made by Sonny" },
  ],

  faqImage: "/images/faq-med.webp",
  faqAlt: "Seated meditation posture",
  faqItems: [
    { title: "Do I need prior experience?", content: "No — classes are beginner friendly and adaptable." },
    { title: "What do I need to bring?", content: "A comfortable chair or cushion, water, and an open mind." },
    { title: "Is this offered online?", content: "Yes. Many sessions are offered via Zoom with closed captions." },
    { title: "Is there a cost?", content: "Programs are free for members thanks to community support." },
  ],

  relatedPrograms: [
    {
      title: "Yoga",
      copy:
        "Improve strength, flexibility, and overall wellbeing with welcoming classes adapted for comfort.",
      img:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
      to: "/support/programs/gentle-exercise/yoga",
    },
    {
      title: "Tai Chi",
      copy:
        "A mindful practice with flowing movements that combines balance and breath.",
      img:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80",
      to: "/support/programs/gentle-exercise/tai-chi",
    },
    {
      title: "Qi Gong",
      copy:
        "Ancient gentle movements and breathing techniques intended to cultivate and balance life energy.",
      img:
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
      to: "/support/programs/gentle-exercise/qigong",
    },
  ],
};

export default function MeditationProgramPage() {
  return <GentleExerciseTemplate config={meditationConfig} />;
}
