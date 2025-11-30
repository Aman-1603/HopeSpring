// src/components/Pages/GetFreeSupport/Programs/Support_group.js
import React from "react";
import ProgramTemplate from "../Programs/ProgramTemplate/ProgramTemplate";

export default function SupportGroups() {
  const benefits = [
    {
      title: "Mental health support",
      body:
        "Emotional and mental well-being are vital parts of the cancer journey. Our support groups provide a safe, confidential space facilitated by trained professionals.",
    },
    {
      title: "A beacon of hope",
      body:
        "Through shared stories and lived experiences, members remind each other to regain a sense of control and resilience during the cancer journey.",
    },
    {
      title: "Spark a connection",
      body:
        "Whether in-person or remote, our groups help form bonds that carry beyond the session. We celebrate wins and provide a safe and welcoming place whenever you need to connect.",
    },
  ];

  const facilitators = [
    { name: "Barbara", img: "/images/facilitators/barbara.png" },
    { name: "Christine", img: "/images/facilitators/christina.png" },
    { name: "Suzy", img: "/images/facilitators/suzy.png" },
    { name: "Tammy", img: "/images/facilitators/Tammy.png" },
  ];

  const faqItems = [
    {
      title: "Do I need to be a HopeSpring member?",
      content:
        "No cost to join groups. Registration helps us send reminders and secure meeting links. Membership is free and open to everyone affected by cancer.",
    },
    {
      title: "Are groups virtual or in-person?",
      content:
        "Both options are available. Many programs offer remote sessions for flexibility. Check the calendar for exact format, dates, and times.",
    },
    {
      title: "Is what I share confidential?",
      content:
        "Yes. Our groups follow confidentiality guidelines. We create a respectful, non-judgmental environment so everyone can feel safe to participate.",
    },
  ];

  const relatedPrograms = [
    {
      title: "Cancer Care Counselling",
      img: "/images/Cancer-care-counselling-suggestion.png",
      to: "/book/cancer-care-counselling",
      copy: "",
    },
    {
      title: "Reiki",
      img: "/images/reiki-suggestion.png",
      to: "/support/programs/relaxation/reiki",
      copy: "",
    },
    {
      title: "Yoga",
      img: "/images/yoga-suggestion.png",
      to: "/support/programs/gentle-exercise/yoga",
      copy: "",
    },
  ];

  const config = {
    slug: "support-groups",
    categoryName: "support_group",
    subcategoryName: "",

    layout: "support-groups",     // 2-column layout with day/time labels
    fetchMode: "support-groups",  // use /api/programs/support-groups + Cal slots

    heroImage: "/images/support-group-banner.png",
    heroAlt: "HopeSpring Support Groups",
    heroTag: "Programs",
    heroTitle: "Support Groups",
    heroSubtitle:
      "Free, professionally facilitated groups for patients, survivors, and caregivers. Connect with others, share experiences, and build resilience — at any stage of the cancer journey.",
    heroCtaLabel: "View & register",

    introTitle:
      "Free Support for Cancer Patients, survivors, and Caregivers Guiding Any Step of the Journey",
    introBody:
      "Each of our support groups is facilitated by trained professionals, focusing on connection, education, and practical tools for navigating the cancer experience.",

    benefitsImage: "/images/support-group-benefits.png",
    benefitsAlt: "Support group members",
    benefits,

    facilitators,

    faqItems,
    faqImage: "/images/faq-support.png",
    faqAlt: "Person receiving support",

    relatedPrograms,
    programsTitle: "Support Groups Programs For The Cancer Community",
  };

  return <ProgramTemplate config={config} />;
}
