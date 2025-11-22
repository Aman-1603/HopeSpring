// AddProgram.js - FULL UPDATED FILE (support_group + occurrences + Cal integration)
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { CalendarDays, MapPin, Users, User, PlusCircle, Tag, Link2, CheckCircle2, Loader2 } from "lucide-react";
// Use relative path for proxy
const API_BASE = "/api/programs";
const CAL_BASE = "/api/cal";

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  // track which program is creating Cal event right now
  const [calLoadingId, setCalLoadingId] = useState(null);

  const emptyForm = {
    id: null, // for edit
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxCapacity: "",
    instructor: "",
    status: "upcoming",

    // support groups only
    day_label: "",
    time_label: "",
    column_index: 1, // 1 left, 2 right
    sort_order: 0,
    is_active: true,

    // extra sessions (datetime-local strings)
    additionalDates: [""],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch programs & categories on mount
  useEffect(() => {
    fetchPrograms();
    fetchCategories();
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
        status: p.status,
        instructor: p.instructor,

        // support groups
        day_label: p.day_label,
        time_label: p.time_label,
        column_index: p.column_index,
        sort_order: p.sort_order,
        is_active: p.is_active,

        // Cal fields
        cal_event_type_id: p.cal_event_type_id,
        cal_slug: p.cal_slug,
        cal_user: p.cal_user,
      }));
      setPrograms(mapped);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories/all`);
      setCategories(res.data.map((c) => c.name));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openAddProgramModal = () => {
    setEditMode(false);
    setFormData(emptyForm);
    setShowAddProgram(true);
  };

  // fetch occurrences on edit and prefill additionalDates
  const openEditProgram = async (program) => {
    setEditMode(true);

    let additionalDatesPrefill = [""];

    try {
      const occRes = await axios.get(
        `${API_BASE}/${program.id}/occurrences`
      );

      const occs = occRes.data || [];
      occs.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));

      const extra = occs.slice(1).map((o) => {
        const d = new Date(o.starts_at);
        return d.toISOString().slice(0, 16);
      });

      additionalDatesPrefill = extra.length ? extra : [""];
    } catch (e) {
      console.warn("Could not prefill occurrences, using empty extras.");
    }

    setFormData({
      id: program.id,
      title: program.title,
      description: program.description,
      category: program.category,
      date: program.date,
      time: program.time,
      location: program.location,
      maxCapacity: program.maxCapacity,
      instructor: program.instructor,
      status: program.status,

      day_label: program.day_label || "",
      time_label: program.time_label || "",
      column_index: program.column_index || 1,
      sort_order: program.sort_order || 0,
      is_active: program.is_active ?? true,

      additionalDates: additionalDatesPrefill,
    });

    setShowAddProgram(true);
  };

  // Create Cal event-type for a program
  // quiet=true means "don’t alert"
  const handleCreateCalEvent = async (programId, { quiet = false } = {}) => {
    try {
      setCalLoadingId(programId);
      const res = await axios.post(`${CAL_BASE}/event-types/${programId}`);
      await fetchPrograms();

      if (!quiet) {
        alert(
          `Cal event linked.\nID: ${res.data.cal_event_type_id}\nSlug: ${res.data.cal_slug}`
        );
      }

      return res.data;
    } catch (err) {
      console.error("Cal create error:", err);
      if (!quiet) {
        alert(err?.response?.data?.error || "Failed to create Cal event type.");
      }
      throw err;
    } finally {
      setCalLoadingId(null);
    }
  };

  const handleAddOrUpdateProgram = async () => {
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

    if (formData.category === "support_group") {
      if (!formData.day_label || !formData.time_label) {
        alert("Please fill Day Label and Time Label for support groups");
        return;
      }
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      maxCapacity: parseInt(formData.maxCapacity, 10),
      instructor: formData.instructor,
      status: formData.status,

      day_label: formData.day_label || null,
      time_label: formData.time_label || null,
      column_index: formData.column_index || 1,
      sort_order: formData.sort_order || 0,
      is_active: formData.is_active ?? true,

      additionalDates: (formData.additionalDates || []).filter(Boolean),
    };

    try {
      setIsSaving(true);

      if (editMode && formData.id) {
        const res = await axios.put(
          `${API_BASE}/${formData.id}`,
          payload
        );

        // ✅ If already linked support_group, refresh Cal so dates match DB
        if (
          payload.category === "support_group" &&
          res.data.cal_event_type_id
        ) {
          await axios.post(
            `${CAL_BASE}/event-types/${formData.id}/refresh`
          );
          await fetchPrograms();
        } else {
          // normal refresh
          await fetchPrograms();
        }
      } else {
        const res = await axios.post(API_BASE, payload);
        const createdId = res.data.id;

        // ✅ Auto-link Cal for support groups
        if (payload.category === "support_group") {
          await handleCreateCalEvent(createdId, { quiet: true });
        } else {
          await fetchPrograms();
        }
      }

      setShowAddProgram(false);
      setEditMode(false);
      setFormData(emptyForm);
    } catch (err) {
      console.error("Error saving program:", err);
      alert("Something went wrong while saving the program.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?"))
      return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program.");
    }
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/categories`, { name });
      if (res.data.existing) {
        alert("Category already exists");
      } else {
        setCategories((prev) => [...prev, res.data.name]);
      }
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(
        `${API_BASE}/categories/${encodeURIComponent(cat)}`
      );
      setCategories((prev) => prev.filter((c) => c !== cat));
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category.");
    }
  };

  const totalParticipants = programs.reduce(
    (sum, p) => sum + (p.participants || 0),
    0
  );
  const upcomingCount = programs.filter(
    (p) => p.status === "upcoming"
  ).length;
  const completedCount = programs.filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6 bg-gradient-to-b from-[#f7f5fb] to-[#f1f5ff] rounded-3xl p-6">
        {/* header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Program Management
            </h1>
            <p className="text-gray-500 text-sm">
              Create and manage HopeSpring support programs and wellness events.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategories(true)}
              className="flex items-center gap-1 border border-[#d0c8ff] text-[#6b5df5] px-3 py-2 rounded-xl text-sm bg-white hover:bg-[#f4f1ff] shadow-sm"
            >
              <Tag className="w-4 h-4" />
              Manage Categories
            </button>
            <button
              onClick={openAddProgramModal}
              className="flex items-center gap-1 bg-gradient-to-r from-[#9b87f5] to-[#6b5df5] text-white px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add Program
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 border border-[#e5e0ff] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Programs</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-semibold text-gray-800">
                {programs.length}
              </p>
              <CalendarDays className="w-6 h-6 text-[#9b87f5]" />
            </div>
          </div>
          <div className="bg-white/80 border border-[#e0f5f3] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Upcoming</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-semibold text-gray-800">
                {upcomingCount}
              </p>
              <Users className="w-6 h-6 text-[#67c6c6]" />
            </div>
          </div>
          <div className="bg-white/80 border border-[#fde2e2] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Completed</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-semibold text-gray-800">
                {completedCount}
              </p>
              <CalendarDays className="w-6 h-6 text-[#f97373]" />
            </div>
          </div>
          <div className="bg-white/80 border border-[#e5e7eb] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Participants</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-semibold text-gray-800">
                {totalParticipants}
              </p>
              <Users className="w-6 h-6 text-[#6b5df5]" />
            </div>
          </div>
        </div>

        {/* program cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => {
            const linked = !!program.cal_event_type_id;
            const bookingUrl =
              linked && program.cal_user && program.cal_slug
                ? `https://cal.com/${program.cal_user}/${program.cal_slug}`
                : null;

            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl border border-[#e5e0ff] shadow-sm p-5 space-y-3 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {program.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-[#6b5df5] mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4f1ff] border border-[#e0d8ff]">
                        <Tag className="w-3 h-3" />
                        {program.category || "Uncategorized"}
                      </span>

                      {linked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Cal linked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {program.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      program.status === "upcoming"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {program.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-[#9b87f5]" />
                    <span>
                      {program.date} {program.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#67c6c6]" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#6b5df5]" />
                    <span>
                      {program.participants}/{program.maxCapacity} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#f97373]" />
                    <span>{program.instructor}</span>
                  </div>
                </div>

                {/* Support group meta */}
                {program.category === "support_group" && (
                  <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      Day: {program.day_label || "-"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      TimeLabel: {program.time_label || "-"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      Column: {program.column_index === 2 ? "Right" : "Left"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      Order: {program.sort_order}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      Active: {program.is_active ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {/* ✅ Cal actions (support groups only) */}
                {program.category === "support_group" && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {!linked ? (
                      <button
                        onClick={() => handleCreateCalEvent(program.id)}
                        disabled={calLoadingId === program.id}
                        className="inline-flex items-center gap-1 border border-[#c7d2fe] px-3 py-1.5 rounded-xl text-sm text-[#4338ca] bg-[#eef2ff] hover:bg-[#e0e7ff] disabled:opacity-60"
                      >
                        {calLoadingId === program.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Link2 className="w-4 h-4" />
                        )}
                        Create Cal Event
                      </button>
                    ) : bookingUrl ? (
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 border border-emerald-200 px-3 py-1.5 rounded-xl text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        <Link2 className="w-4 h-4" />
                        Open Booking Link
                      </a>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Cal linked, but missing user/slug.
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEditProgram(program)}
                    className="border border-[#d0c8ff] px-3 py-1.5 rounded-xl text-sm text-[#6b5df5] bg-white hover:bg-[#f5f3ff]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(program.id)}
                    className="border border-[#fecaca] px-3 py-1.5 rounded-xl text-sm text-[#b91c1c] bg-white hover:bg-[#fee2e2]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {programs.length === 0 && (
            <div className="text-center text-gray-500 text-sm col-span-full py-10">
              No programs created yet. Click <strong>Add Program</strong> to
              create your first event.
            </div>
          )}
        </div>

        {/* Add / Edit Program modal */}
        {showAddProgram && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => {
                  setShowAddProgram(false);
                  setEditMode(false);
                }}
                className="absolute top-4 right-6 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {editMode ? "Edit Program" : "Add New Program"}
              </h2>

              <div className="grid gap-4">
                {/* title */}
                <div>
                  <label className="text-sm font-medium">Program Title *</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.title}
                    onChange={(e) =>
                      handleInputChange("title", e.target.value)
                    }
                  />
                </div>

                {/* description */}
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>

                {/* category + instructor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2 text-sm"
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
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.instructor}
                      onChange={(e) =>
                        handleInputChange("instructor", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Support group conditional fields */}
                {formData.category === "support_group" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Day Label *
                      </label>
                      <input
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.day_label}
                        onChange={(e) =>
                          handleInputChange("day_label", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Time Label *
                      </label>
                      <input
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.time_label}
                        onChange={(e) =>
                          handleInputChange("time_label", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Column</label>
                      <select
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.column_index}
                        onChange={(e) =>
                          handleInputChange(
                            "column_index",
                            parseInt(e.target.value, 10)
                          )
                        }
                      >
                        <option value={1}>Left</option>
                        <option value={2}>Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Sort Order</label>
                      <input
                        type="number"
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.sort_order}
                        onChange={(e) =>
                          handleInputChange(
                            "sort_order",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          handleInputChange("is_active", e.target.checked)
                        }
                      />
                      <label className="text-sm font-medium">Active</label>
                    </div>
                  </div>
                )}

                {/* main date + time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date *</label>
                    <input
                      type="date"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time *</label>
                    <input
                      type="time"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Additional session dates */}
                <div>
                  <label className="text-sm font-medium">
                    Additional Session Dates (optional)
                  </label>

                  {formData.additionalDates.map((d, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <input
                        type="datetime-local"
                        value={d}
                        onChange={(e) => {
                          const copy = [...formData.additionalDates];
                          copy[i] = e.target.value;
                          handleInputChange("additionalDates", copy);
                        }}
                        className="flex-1 border rounded-xl px-3 py-2 text-sm"
                      />

                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...formData.additionalDates];
                            copy.splice(i, 1);
                            handleInputChange("additionalDates", copy);
                          }}
                          className="px-3 py-2 text-xs border rounded-xl"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("additionalDates", [
                        ...formData.additionalDates,
                        "",
                      ])
                    }
                    className="mt-2 text-xs px-3 py-2 border rounded-xl bg-gray-50"
                  >
                    + Add another date
                  </button>
                </div>

                {/* location + capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location *</label>
                    <input
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Max Capacity *
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.maxCapacity}
                      onChange={(e) =>
                        handleInputChange("maxCapacity", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* status */}
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowAddProgram(false);
                      setEditMode(false);
                    }}
                    className="border px-4 py-2 rounded-xl text-sm bg-gray-50 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdateProgram}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#9b87f5] to-[#6b5df5] text-white px-5 py-2 rounded-xl text-sm shadow-md hover:shadow-lg disabled:opacity-60"
                  >
                    {isSaving
                      ? "Saving..."
                      : editMode
                      ? "Save Changes"
                      : "Add Program"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage categories modal */}
        {showCategories && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                onClick={() => setShowCategories(false)}
                className="absolute top-4 right-6 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Manage Categories
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  className="flex-1 border rounded-xl px-3 py-2 text-sm"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#6b5df5] text-white px-4 py-2 rounded-xl text-sm shadow-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between border border-[#e5e0ff] rounded-xl px-3 py-2 text-sm bg-[#fcfbff]"
                  >
                    <span>{cat}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-500 text-xs hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-gray-500">
                    No categories yet. Add one above to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProgramManagement;
