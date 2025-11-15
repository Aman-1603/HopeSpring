import { useState } from "react";
import AdminLayout from "./NavSection/AdminLayout";

// mock data
const initialCategories = [
  "Wellness & Yoga",
  "Support Groups",
  "Art Therapy",
  "Nutrition",
  "Counseling",
  "Exercise",
];



const mockPrograms = [
  {
    id: 1,
    title: "Gentle Yoga for Wellness",
    description: "A calming yoga session designed for all fitness levels",
    date: "2024-04-15",
    time: "10:00 AM",
    location: "Main Hall",
    participants: 24,
    maxCapacity: 30,
    status: "upcoming",
    instructor: "Sarah Johnson",
  },
  {
    id: 2,
    title: "Support Group Meeting",
    description: "Weekly support group for patients and families",
    date: "2024-04-18",
    time: "2:00 PM",
    location: "Room 201",
    participants: 15,
    maxCapacity: 20,
    status: "upcoming",
    instructor: "Dr. Mike Chen",
  },
  {
    id: 3,
    title: "Art Therapy Workshop",
    description: "Creative expression through art",
    date: "2024-03-28",
    time: "1:00 PM",
    location: "Art Studio",
    participants: 12,
    maxCapacity: 15,
    status: "completed",
    instructor: "Emily Davis",
  },
];

const ProgramManagement = () => {
  const [programs, setPrograms] = useState(mockPrograms);
  const [categories, setCategories] = useState(initialCategories);

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxCapacity: "",
    instructor: "",
    status: "upcoming",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProgram = () => {
    // basic validation
    const required = [
      "title",
      "description",
      "category",
      "date",
      "time",
      "location",
      "maxCapacity",
      "instructor",
    ];
    for (let f of required) {
      if (!formData[f]) {
        alert("Please fill in all required fields");
        return;
      }
    }

    const newProgram = {
      id: programs.length + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      participants: 0,
      maxCapacity: parseInt(formData.maxCapacity, 10),
      status: formData.status,
      instructor: formData.instructor,
    };

    setPrograms((prev) => [...prev, newProgram]);
    setShowAddProgram(false);
    // reset
    setFormData({
      title: "",
      description: "",
      category: "",
      date: "",
      time: "",
      location: "",
      maxCapacity: "",
      instructor: "",
      status: "upcoming",
    });
  };

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) {
      alert("Category name cannot be empty");
      return;
    }
    if (categories.includes(name)) {
      alert("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, name]);
    setNewCategory("");
  };

  const handleDeleteCategory = (cat) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Program Management</h1>
          <p className="text-gray-500">
            Create and manage support programs and events
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategories(true)}
            className="border px-3 py-2 rounded-md text-sm"
          >
            Manage Categories
          </button>
          <button
            onClick={() => setShowAddProgram(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
          >
            + Add Program
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Programs</p>
          <p className="text-2xl font-semibold mt-1">{programs.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">Upcoming</p>
          <p className="text-2xl font-semibold mt-1">
            {programs.filter((p) => p.status === "upcoming").length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Participants</p>
          <p className="text-2xl font-semibold mt-1">
            {programs.reduce((sum, p) => sum + p.participants, 0)}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs text-gray-500">Avg. Attendance</p>
          <p className="text-2xl font-semibold mt-1">84%</p>
        </div>
      </div>

      {/* list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-lg font-semibold">{program.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {program.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  program.status === "upcoming"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {program.status}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <strong>Date:</strong> {program.date} {program.time}
              </p>
              <p>
                <strong>Location:</strong> {program.location}
              </p>
              <p>
                <strong>Participants:</strong>{" "}
                {program.participants}/{program.maxCapacity}
              </p>
              <p>
                <strong>Instructor:</strong> {program.instructor}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded-md text-sm">
                Edit
              </button>
              <button className="border px-3 py-1 rounded-md text-sm text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* add program modal (simple) */}
      {showAddProgram && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Program</h2>
              <button onClick={() => setShowAddProgram(false)}>✕</button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Program Title *</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Morning Yoga Session"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description *</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the program"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Instructor *</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.instructor}
                    onChange={(e) =>
                      handleInputChange("instructor", e.target.value)
                    }
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time *</label>
                  <input
                    type="time"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location *</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Main Hall"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Capacity *</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      handleInputChange("maxCapacity", e.target.value)
                    }
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange("status", e.target.value)
                  }
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddProgram(false)}
                  className="border px-3 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgram}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Add Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* manage categories modal */}
      {showCategories && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage Categories</h2>
              <button onClick={() => setShowCategories(false)}>✕</button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default ProgramManagement;
