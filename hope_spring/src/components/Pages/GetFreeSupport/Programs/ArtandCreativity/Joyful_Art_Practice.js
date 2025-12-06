import ProgramTemplate from "../ProgramTemplate/ProgramTemplate";
import { Palette, Sparkles, Users } from "lucide-react";

const joyfulArtPracticeConfig = {
  slug: "joyful-art-practice",

  // CATEGORY-ONLY MATCH
  // Any program where normalize(category) === normalize("Art")
  // will show on this page.
  categoryName: "Art",
  subcategoryName: "",

  /* ===== Hero ===== */
  heroImage: "/images/art-practice-banner.png",
  heroAlt: "Coloured pencils",
  heroTag: "Program – Joyful art practice",
  heroTitle: "Joyful Art Practice",
  heroSubtitle:
    "A soft, loving, and encouraging space to process whatever you are facing through art, mindfulness, and gentle community.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can Joyful Art Practice help me?",
  introBody:
    "This monthly class provides a creative outlet for relaxation and joy. Each session explores drawing, painting, and collage alongside simple mindfulness and breathing exercises to help reduce stress and anxiety. All levels are welcome—from new-to-art to more experienced artists.",

  /* ===== Benefits (Objectives) ===== */
  benefitsImage: "/images/art-benefits.png",
  benefitsAlt: "Paint brushes with orange paint",
  benefits: [
    {
      title: "Find your artistic style",
      body:
        "Encourages participants to explore and develop their own unique artistic voice in a safe, non-judgmental environment.",
      icon: <Sparkles className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Relieve stress",
      body:
        "Art techniques paired with mindful exercises support relaxation, grounding, and emotional regulation.",
      icon: <Palette className="h-5 w-5" aria-hidden />,
    },
    {
      title: "Connect with your community",
      body:
        "Group classes foster gentle connection and a sense of belonging through shared creative expression.",
      icon: <Users className="h-5 w-5" aria-hidden />,
    },
  ],

  /* ===== Facilitator ===== */
  facilitators: [
    {
      name: "Char Heaman",
      img: "/images/facilitators/Char.png",
    },
  ],

  /* ===== FAQ ===== */
  faqImage: "/images/joyful-suggestion.png",
  faqAlt: "Assorted art brushes",
  faqItems: [
    {
      title: "Do I need art experience?",
      content:
        "No—this class welcomes all levels and focuses on joyful making rather than perfection.",
    },
    {
      title: "Are materials provided?",
      content:
        "A simple materials list is sent before class. You’re encouraged to use whatever you already have at home.",
    },
    {
      title: "Can I join online?",
      content:
        "Yes—most sessions are hybrid with Zoom access so you can join from home.",
    },
    {
      title: "How often does this run?",
      content:
        "Joyful Art Practice is typically offered as a monthly 90-minute session. Check the calendar for upcoming dates.",
    },
  ],

  /* ===== Related programs ===== */
  relatedPrograms: [
    {
      title: "Joyful art skills and techniques",
      copy:
        "Learn a variety of art techniques including drawing, painting, and collage, plus mindfulness and breathing exercises.",
      img: "/images/art-skills-placeholder.png", // replace with real asset later
      to: "/support/programs/arts-creativity/joyful-art-skills",
    },
    {
      title: "Cancer Care Counselling",
      copy:
        "Guidance and strategies to navigate the emotional and practical challenges that come with a cancer diagnosis.",
      img: "/images/Cancer-care-counselling-suggestion.png",
      to: "/book/cancer-care-counselling",
    },
    {
      title: "Art Night for kids after school",
      copy:
        "A playful creative space for children to express emotions and connect through art.",
      img: "/images/art-night-kids-placeholder.png", // replace with real asset later
      to: "/support/programs/children-youth-families",
    },
  ],
};

export default function JoyfulArtPracticePage() {
  return <ProgramTemplate config={joyfulArtPracticeConfig} />;
}
