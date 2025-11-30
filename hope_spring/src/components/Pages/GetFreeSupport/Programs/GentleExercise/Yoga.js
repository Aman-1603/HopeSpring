import GentleExerciseTemplate from "../ProgramTemplate/ProgramTemplate";

const yogaConfig = {
  slug: "yoga",
  categoryName: "Gentle Exercise",
  subcategoryName: "Yoga",

  heroImage: "/images/yoga-banner.png", // use whatever you had, or keep null
  heroAlt: "Yoga practice",
  heroTag: "Program – Yoga",
  heroTitle: "Yoga",
  heroSubtitle:
    "Gentle yoga classes focused on comfort, breath, and supporting your body through and after cancer treatment.",
  heroCtaLabel: "View & register",

  introTitle: "How can yoga help me?",
  introBody:
    "Our yoga programs are designed specifically for people living with cancer, survivors, and caregivers. Classes focus on gentle movement, breath awareness, and relaxation rather than performance or intensity.",

  benefitsImage: "/images/yoga-benefits.png", // or reuse another image
  benefitsAlt: "Person practicing yoga",
  benefits: [
    {
      title: "Gentle movement",
      body: "Improve mobility and flexibility with movements adapted to your comfort level.",
    },
    {
      title: "Stress relief",
      body: "Breath and relaxation practices may reduce stress and anxiety.",
    },
    {
      title: "Supportive community",
      body: "Practice alongside others who understand the cancer journey.",
    },
  ],

  facilitators: [
    { name: "Yoga facilitator", img: "/images/facilitators/yoga-placeholder.png" },
    // update with real people/images later
  ],

  partnerPrograms: [],

  faqImage: "/images/faq-yoga.webp",
  faqAlt: "Yoga pose illustration",
  faqItems: [
    { title: "Do I need to be flexible?", content: "No. Classes are designed for all levels and abilities." },
    { title: "Can I participate during treatment?", content: "Speak with your healthcare team first; movements can often be adapted." },
    { title: "Is equipment provided?", content: "You can bring your own mat, but chairs and props may be available." },
    { title: "Is there a cost?", content: "Programs are free for members thanks to community support." },
  ],

  relatedPrograms: [
    {
      title: "Meditation",
      copy: "Build a regular mindfulness practice to support your emotional wellbeing.",
      img:
        "https://images.unsplash.com/photo-1518300671339-4b0d3d86bfaa?w=900&q=80",
      to: "/support/programs/gentle-exercise/meditation",
    },
    {
      title: "Tai Chi",
      copy: "Slow, flowing movements that combine balance, focus, and breath.",
      img:
        "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=900&q=80",
      to: "/support/programs/gentle-exercise/tai-chi",
    },
    {
      title: "Qi Gong",
      copy:
        "Gentle movements and breathwork intended to support calm and vitality.",
      img:
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
      to: "/support/programs/gentle-exercise/qigong",
    },
  ],
};

export default function YogaProgramPage() {
  return <GentleExerciseTemplate config={yogaConfig} />;
}
