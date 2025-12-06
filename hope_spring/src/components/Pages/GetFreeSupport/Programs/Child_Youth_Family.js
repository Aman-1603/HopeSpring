import ProgramTemplate from "../Programs/ProgramTemplate/ProgramTemplate";

const childrenProgramsConfig = {
  slug: "children-youth-families",

  // We are using ONLY category matching.
  // ProgramTemplate will load programs where
  // normalize(p.category) === normalize("Children").
  categoryName: "Children",
  // Empty subcategoryName => ignore subcategory filter.
  subcategoryName: "",

  /* ===== Hero ===== */
  heroImage: "/images/hopekidshero.svg",
  heroAlt: "Kids playing outdoors",
  heroTag: "Program – Children / Youth / Families",
  heroTitle: "Children, Youth & Families Programs",
  heroSubtitle:
    "Joyful programs designed for kids and teens to connect, create, move, and build resilience — with caregivers supported alongside.",
  heroCtaLabel: "View & register",

  /* ===== Intro ===== */
  introTitle: "How can these programs support my family?",
  introBody:
    "HopeKids and our youth and family offerings create a safe, engaging space where children, teens, and caregivers can play, create, move, and talk about big feelings. Programs mix games, art, movement, and mindful activities, and are adapted for energy levels during and after treatment.",

  /* ===== Benefits ===== */
  benefitsImage:
    "https://images.unsplash.com/photo-1490674459751-8b2b2d1a3da0?w=1200&q=80",
  benefitsAlt: "Kids playing outdoors",
  benefits: [
    {
      title: "Support for kids and teens",
      body:
        "Age-appropriate groups give children and youth a place to connect with peers who understand what they’re going through.",
    },
    {
      title: "Creative expression",
      body:
        "Art-based activities and youth programs help kids and teens express emotions that are hard to put into words.",
    },
    {
      title: "Caregiver support",
      body:
        "Parent and caregiver offerings provide practical tools, peer support, and links to local community resources.",
    },
  ],

  /* ===== Facilitators ===== */
  facilitators: [
    {
      name: "Youth & Family Program Facilitator",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=900&q=80",
    },
  ],

  /* ===== FAQ ===== */
  faqImage:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&q=80",
  faqAlt: "Kids playing with bubbles",
  faqItems: [
    {
      title: "Are these programs free?",
      content:
        "Yes—thanks to donors and partners, all programs are free for members.",
    },
    {
      title: "Are sessions online or in-person?",
      content:
        "We offer both on-site and Zoom options. Check the calendar for each program’s location.",
    },
    {
      title: "Can parents attend with their kids?",
      content:
        "Yes—caregivers are welcome. Some activities are youth-only to encourage peer connection; others are designed for families together.",
    },
  ],

  /* ===== Related programs ===== */
  relatedPrograms: [
    {
      title: "Gentle Exercise",
      copy:
        "Explore meditation, yoga, Tai Chi, and Qi Gong adapted for comfort and energy levels.",
      img:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
      to: "/support/programs/gentle-exercise/meditation",
    },
    {
      title: "Counselling",
      copy:
        "1:1 and family counselling to help navigate anxiety, grief, and major life changes during cancer.",
      img:
        "https://images.unsplash.com/photo-1526668974740-0f4bc0e51f97?w=900&q=80",
      to: "/book/cancer-care-counselling",
    },
    {
      title: "Support Groups",
      copy:
        "Peer groups for patients, survivors, and caregivers to share experiences in a safe environment.",
      img:
        "https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?w=900&q=80",
      to: "/support/programs/support-groups",
    },
  ],
};

export default function ChildrenYouthFamilyPage() {
  return <ProgramTemplate config={childrenProgramsConfig} />;
}
