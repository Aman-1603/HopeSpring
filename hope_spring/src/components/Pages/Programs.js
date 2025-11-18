import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Users, Apple, Flower2, Leaf } from "lucide-react";

const API_BASE = "/api/programs";   // 👈 same proxy as admin

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(API_BASE);

      const mapped = res.data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        date: p.date,
        time: p.time,
        location: p.location,
        participants: p.participants || 0,
        maxCapacity: p.max_capacity,
        instructor: p.instructor,
        status: p.status,
        icon: <Leaf className="w-9 h-9 text-[#66c6c6]" /> // default icon
      }));

      setPrograms(mapped);
      setFilteredPrograms(mapped);

    } catch (err) {
      console.error("❌ Error fetching programs:", err);
    }
  };

  // ------------------------- SEARCH & FILTER -------------------------
  useEffect(() => {
    let list = [...programs];

    if (search.trim() !== "") {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      list = list.filter((p) => p.category === filterCategory);
    }

    setFilteredPrograms(list);
  }, [search, filterCategory, programs]);

  // ------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-[#f5f2fb] py-12 px-4 sm:px-8">

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

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 px-4 sm:px-10 lg:px-20">
        <input
          type="text"
          placeholder="🔍 Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 rounded-2xl border border-gray-200 bg-white/90 shadow-sm px-5 py-3"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto rounded-2xl border border-gray-200 bg-white/90 shadow-sm px-4 py-3"
        >
          <option value="All">All Programs</option>

          {[...new Set(programs.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}

        </select>
      </div>

      {/* Program Cards */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="bg-gradient-to-b from-[#fdfefd] to-[#f4fbfa] rounded-3xl border border-[#d9ebe8] shadow-md p-10"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#e6f8f7] rounded-full p-5">
                {program.icon}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {program.title}
            </h3>

            <p className="text-sm text-[#67c6c6] mb-4 font-medium text-center">
              {program.category}
            </p>

            <p className="text-gray-600 text-sm mb-6 text-center">
              {program.description}
            </p>

            <button className="mt-auto bg-[#67c6c6] hover:bg-[#5ab7b7] text-white font-semibold px-8 py-3 rounded-full text-sm self-center w-4/5">
              Book Now
            </button>
          </div>
        ))}

        {filteredPrograms.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No programs found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Programs;
