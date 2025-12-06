import ProgramTemplate from "../ProgramTemplate/ProgramTemplate";
import { Brain, BookOpen, MessageSquareText } from "lucide-react";

const chemoBrainConfig = {
  slug: "chemo-brain",

  // Use ChemoBrain as the root category
  categoryName: "Chemo Brain",
  subcategoryName: "",  // ignore subcategory completely

  /* ===== Hero ===== */
  heroImage: "/images/chemo-banner.png",
  heroAlt: "Person reflecting on a sofa",
  heroTag: "Program – Chemo Brain",
  heroTitle: "Chemo Brain",
  heroSubtitle:
    "Understand cognitive changes during and after treatment, and learn practical strategies for memory, focus, and daily life.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can Chemo Brain programs help me?",
  introBody:
    "This workshop explains treatment-related cognitive effects (attention, memory), why they occur, and simple tools to manage them. Participants leave with strategies to track tasks, conserve energy, and communicate needs effectively.",

  /* ===== Benefits ===== */
  benefitsImage: "/images/chemo-brain-benefits.png",
  benefitsAlt: "Caregiver with child smiling",
  benefits: [
    {
      title: "Validation of experience",
      body:
        "You are not alone. Many individuals experience chemo brain symptoms during or after treatment.",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: "Practical coping tools",
      body:
        "Concrete techniques help manage forgetfulness, task overload, and difficulty sustaining attention.",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Improved communication",
      body:
        "Learn how to explain your cognitive challenges clearly to caregivers, employers, and healthcare teams.",
      icon: <MessageSquareText className="h-5 w-5" />,
    },
  ],

  /* ===== Facilitators ===== */
  facilitators: [
    {
      name: "Michaela",
      img: "/images/facilitators/Michaela.png",
    },
  ],

  /* ===== FAQ ===== */
  faqImage: "/images/Chemo-suggestion.png",
  faqAlt: "Person sitting and reflecting",
  faqItems: [
    {
      title: "Can caregivers attend?",
      content: "Yes, caregivers often find the strategies helpful for supporting loved ones.",
    },
    {
      title: "Do I need materials?",
      content: "A notebook is optional, and a quiet space is helpful for Zoom attendees.",
    },
    {
      title: "Are handouts provided?",
      content: "Yes — digital worksheets and tools are included.",
    },
  ],

  /* ===== Related programs ===== */
  relatedPrograms: [
    {
      title: "Support Groups",
      copy: "Groups offering shared experience, empathy, and emotional support.",
      img: "/images/support-groups-suggestion.png",
      to: "/support/programs/support-groups",
    },
    {
      title: "Therapeutic Touch",
      copy: "A gentle session focused on restoring relaxation and balance.",
      img: "/images/therupatic-theraphy.png",
      to: "/support/programs/relaxation/therapeutic-touch",
    },
    {
      title: "Cancer Care Counselling",
      copy: "1:1 support to navigate stress, anxiety, and cognitive changes.",
      img: "/images/Cancer-care-counselling-suggestion.png",
      to: "/book/cancer-care-counselling",
    },
  ],
};

export default function ChemoBrainProgramPage() {
  return <ProgramTemplate config={chemoBrainConfig} />;
}
