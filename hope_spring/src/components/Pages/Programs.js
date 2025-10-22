import React from "react";
import { Heart, Users, Apple, Flower2, Leaf } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      title: "Yoga for Wellness",
      category: "Wellness",
      description:
        "Gentle yoga sessions designed to improve flexibility, reduce stress, and promote overall well-being for cancer patients and survivors.",
      icon: <Leaf className="w-9 h-9 text-[#66c6c6]" />,
    },
    {
      title: "Peer Support Circles",
      category: "Support",
      description:
        "Connect with others who understand your journey. Share experiences, find strength, and build lasting friendships in a safe space.",
      icon: <Users className="w-9 h-9 text-[#66c6c6]" />,
    },
    {
      title: "Meditation & Mindfulness",
      category: "Wellness",
      description:
        "Learn mindfulness techniques to manage anxiety, improve sleep, and find peace during challenging times.",
      icon: <Heart className="w-9 h-9 text-[#66c6c6]" />,
    },
    {
      title: "Caregiver Support Group",
      category: "Support",
      description:
        "A safe and compassionate space for caregivers to share, learn, and support one another through their experiences.",
      icon: <Flower2 className="w-9 h-9 text-[#66c6c6]" />,
    },
    {
      title: "Nutrition Workshops",
      category: "Nutrition",
      description:
        "Educational sessions on healthy eating and nutritional strategies to support healing and overall wellness.",
      icon: <Apple className="w-9 h-9 text-[#66c6c6]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-[#f5f2fb] py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Empowering Hope Through Connection
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
          Discover programs designed to support your journey with compassion,
          community, and care.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 px-4 sm:px-10 lg:px-20">
        <input
          type="text"
          placeholder="🔍 Search programs..."
          className="w-full sm:flex-1 rounded-2xl border border-gray-200 bg-white/90 shadow-sm px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] text-gray-700 placeholder-gray-400"
        />
        <select className="w-full sm:w-auto rounded-2xl border border-gray-200 bg-white/90 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] text-gray-700">
          <option>All Programs</option>
          <option>Wellness</option>
          <option>Support</option>
          <option>Nutrition</option>
        </select>
      </div>

      {/* Program Cards */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs.map((program, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-[#fdfefd] to-[#f4fbfa] rounded-3xl border border-[#d9ebe8] shadow-md hover:shadow-xl transition-all duration-300 p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#e6f8f7] rounded-full p-5 shadow-sm">
                  {program.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                {program.title}
              </h3>
              <p className="text-sm text-[#67c6c6] mb-4 font-medium text-center">
                {program.category}
              </p>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed text-center">
                {program.description}
              </p>
            </div>

            <button className="mt-auto bg-[#67c6c6] hover:bg-[#5ab7b7] text-white font-semibold px-8 py-3 rounded-full text-sm transition duration-200 shadow-sm hover:shadow-lg self-center w-4/5">
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-16 max-w-[1500px] mx-auto">
        <button className="bg-white/80 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium px-5 py-2 rounded-xl shadow-sm transition">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Programs;
