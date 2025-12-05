import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import {
  CalendarDays,
  MapPin,
  Users,
  User,
  PlusCircle,
  Tag,
  CheckCircle2,
  Loader2,
  Link2,
  Pencil,
  Trash2,
  Timer,
} from "lucide-react";

const API_BASE = "/api/programs";
const CAL_BASE = "/api/cal";

/** simple slugger used both in UI + save */
const normalizeCategory = (v) =>
  (v || "").trim().toLowerCase().replace(/\s+/g, "_");

/** subcategories for Gentle Exercise */
const GENTLE_EXERCISE_SUBCATS = ["Meditation", "Yoga", "Tai Chi", "Qi Gong"];

const emptyForm = {
  id: null,
  title: "",
  description: "",
  category: "",
  subcategory: "",

  location: "",
  maxCapacity: "",
  instructor: "",
  status: "upcoming",

  // support group only (but fields exist for all)
  day_label: "",
  time_label: "",
  column_index: 1,
  sort_order: 0,
  is_active: true,

  // duration in minutes (maps to duration_minutes in DB)
  durationMinutes: "",
};

function formatDuration(mins) {
  const m = Number(mins);
  if (!m || m <= 0) return null;
  const hours = Math.floor(m / 60);
  const minutes = m % 60;

  if (hours && minutes)
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
  if (hours) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${minutes} min`;
}

export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [calLoadingId, setCalLoadingId] = useState(null);

  /* --------------------------- fetchers --------------------------- */
  useEffect(() => {
    fetchPrograms();
    fetchCategories();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(API_BASE);
      setPrograms(res.data || []);
    } catch (e) {
      console.error("fetchPrograms:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories/all`);
      setCategories((res.data || []).map((c) => c.name));
    } catch (e) {
      console.error("fetchCategories:", e);
    }
  };
  /* --------------------------------------------------------------- */

  const openAdd = () => {
    setEditMode(false);
    setFormData({ ...emptyForm });
    setShowProgramModal(true);
  };

  const openEdit = async (p) => {
    setEditMode(true);

    // still fetch occurrences for legacy/analytics, but not shown in form
    try {
      await axios.get(`${API_BASE}/${p.id}/occurrences`);
    } catch {
      // ignore
    }

    setFormData({
      id: p.id,
      title: p.title || "",
      description: p.description || "",
      category: p.category || "",
      subcategory: p.subcategory || "",
      location: p.location || "",
      maxCapacity: p.max_capacity ?? "",
      instructor: p.instructor || "",
      status: p.status || "upcoming",

      day_label: p.day_label || "",
      time_label: p.time_label || "",
      column_index: p.column_index || 1,
      sort_order: p.sort_order || 0,
      is_active: p.is_active ?? true,

      durationMinutes:
        p.duration_minutes !== null && p.duration_minutes !== undefined
          ? String(p.duration_minutes)
          : "",
    });

    setShowProgramModal(true);
  };

  const closeProgramModal = () => {
    setShowProgramModal(false);
    setEditMode(false);
    setFormData(emptyForm);
  };

  /* --------------------------- Cal --------------------------- */
  const createCalEventType = async (programId, quiet = false) => {
    try {
      setCalLoadingId(programId);

      const res = await axios.post(`${CAL_BASE}/event-types/${programId}`);
      // backend: { linked, program, cal: { eventTypeId, scheduleId, slug, user } }
      const body = res.data || {};
      const calInfo = body.cal || {};

      await fetchPrograms();

      if (!quiet) {
        alert(
          `Cal linked.\nID: ${calInfo.eventTypeId ?? "?"}\nSlug: ${
            calInfo.slug ?? "?"
          }`
        );
      }
    } catch (e) {
      console.error("createCalEventType:", e);
      if (!quiet) alert(e?.response?.data?.error || "Cal linking failed");
      throw e;
    } finally {
      setCalLoadingId(null);
    }
  };

  // sync Cal duration (duration_minutes -> lengthInMinutes)
  const syncCalDuration = async (programId) => {
    try {
      await axios.post(`${CAL_BASE}/programs/${programId}/sync-duration`);
    } catch (e) {
      console.error("syncCalDuration:", e);
      // silent; Cal may not be linked yet
    }
  };
  /* ---------------------------------------------------------- */

  /* ---------------------- save/delete programs ---------------------- */
  const saveProgram = async () => {
    const normalizedCategoryValue = normalizeCategory(formData.category);
    const isSupportGroup = normalizedCategoryValue === "support_group";
    const isGentleExercise = normalizedCategoryValue === "gentle_exercise";
   // const isCounselling = normalizedCategoryValue === "counselling";

    // any category that should automatically be wired to Cal
    // NOTE: counselling uses Cal as a request system, but we don't
    // auto-create/update its event type on save to avoid surprises.
    const wantsCalIntegration =
      isSupportGroup || isGentleExercise; // NOT counselling

    const storedCategory = isSupportGroup
      ? "support_group"
      : formData.category;

    const baseRequired = [
      "title",
      "description",
      "category",
      "location",
      "maxCapacity",
      "instructor",
      "durationMinutes", // duration required so Cal length is never undefined
    ];

    for (const f of baseRequired) {
      if (!formData[f]) return alert("Fill all required fields.");
    }

    if (isSupportGroup) {
      if (!formData.day_label || !formData.time_label) {
        return alert("Support group needs Day Label and Time Label.");
      }
    }

    if (isGentleExercise && !formData.subcategory) {
      return alert("Select a subcategory for Gentle Exercise.");
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: storedCategory,
      subcategory: isGentleExercise ? formData.subcategory || null : null,

      // scheduling is handled by Cal – keep these null
      date: null,
      time: null,

      location: formData.location.trim(),
      maxCapacity: parseInt(formData.maxCapacity, 10),
      instructor: formData.instructor.trim(),
      status: formData.status,

      day_label: formData.day_label || null,
      time_label: formData.time_label || null,
      column_index: formData.column_index || 1,
      sort_order: formData.sort_order || 0,
      is_active: formData.is_active ?? true,

      additionalDates: [],

      durationMinutes:
        formData.durationMinutes !== ""
          ? parseInt(formData.durationMinutes, 10)
          : null,
    };

    try {
      setIsSaving(true);

      if (editMode && formData.id) {
        // UPDATE
        await axios.put(`${API_BASE}/${formData.id}`, payload);
        await fetchPrograms();

        if (wantsCalIntegration) {
          // Only duration is synced. Seats are managed in Cal dashboard UI.
          await syncCalDuration(formData.id);
        }
      } else {
        // CREATE
        const res = await axios.post(API_BASE, payload);
        const createdId = res.data?.id;

        if (wantsCalIntegration && createdId) {
          // 1) Create Cal schedule + event type
          await createCalEventType(createdId, true);
          // 2) Sync duration from DB → Cal eventType.lengthInMinutes
          await syncCalDuration(createdId);
        } else {
          await fetchPrograms();
        }
      }

      closeProgramModal();
    } catch (e) {
      console.error("saveProgram:", e);
      alert("Save failed. Check backend logs.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("deleteProgram:", e);
      alert("Delete failed.");
    }
  };
  /* ------------------------------------------------------------------ */

  /* ---------------------- categories CRUD ---------------------- */
  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;

    try {
      const res = await axios.post(`${API_BASE}/categories`, { name });
      if (!res.data.existing) {
        setCategories((prev) => [...prev, res.data.name]);
      }
      setNewCategory("");
    } catch (e) {
      console.error("addCategory:", e);
      alert("Category add failed.");
    }
  };

  const deleteCategory = async (cat) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE}/categories/${encodeURIComponent(cat)}`);
      setCategories((prev) => prev.filter((c) => c !== cat));
    } catch (e) {
      console.error("deleteCategory:", e);
      alert("Category delete failed.");
    }
  };
  /* ------------------------------------------------------------ */

  const stats = useMemo(() => {
    const total = programs.length;
    const upcoming = programs.filter((p) => p.status === "upcoming").length;
    const completed = programs.filter((p) => p.status === "completed").length;
    const participants = programs.reduce(
      (s, p) => s + (p.participants || 0),
      0
    );
    return { total, upcoming, completed, participants };
  }, [programs]);

  const normalizedCategoryValue = normalizeCategory(formData.category);
  const isSupportGroup = normalizedCategoryValue === "support_group";
  const isGentleExercise = normalizedCategoryValue === "gentle_exercise";
  // const isCounselling = normalizedCategoryValue === "counselling"; // ready if we want conditional UI later

  return (
    <AdminLayout>
      <div className="space-y-6 bg-gradient-to-b from-[#f7f5fb] to-[#f1f5ff] rounded-3xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Program Management
            </h1>
            <p className="text-gray-500 text-sm">
              Create programs and link Cal booking. Scheduling is managed in
              Cal.com.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoriesModal(true)}
              className="flex items-center gap-1 border border-[#d0c8ff] text-[#6b5df5] px-3 py-2 rounded-xl text-sm bg:white hover:bg-[#f4f1ff]"
            >
              <Tag className="w-4 h-4" />
              Categories
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-gradient-to-r from-[#9b87f5] to-[#6b5df5] text-white px-4 py-2 rounded-xl text-sm shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              Add Program
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Programs"
            value={stats.total}
            icon={<CalendarDays className="w-6 h-6 text-[#9b87f5]" />}
          />
          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            icon={<Users className="w-6 h-6 text-[#67c6c6]" />}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<CalendarDays className="w-6 h-6 text-[#f97373]" />}
          />
          <StatCard
            label="Participants"
            value={stats.participants}
            icon={<Users className="w-6 h-6 text-[#6b5df5]" />}
          />
        </div>

        {/* Programs list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {programs.map((p) => {
            const pNormCategory = normalizeCategory(p.category);
            const isSupportGroupRow = pNormCategory === "support_group";

            const linked = !!p.cal_event_type_id;
            const bookingUrl =
              linked && p.cal_user && p.cal_slug
                ? `https://cal.com/${p.cal_user}/${p.cal_slug}`
                : null;

            const durationLabel = formatDuration(p.duration_minutes);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#e5e0ff] shadow-sm p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.title}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4f1ff] border border-[#e0d8ff] text-[#6b5df5]">
                        <Tag className="w-3 h-3" />
                        {p.category || "uncategorized"}
                      </span>
                      {p.subcategory && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfeff] border border-[#bae6fd] text-[#0284c7]">
                          {p.subcategory}
                        </span>
                      )}
                      {linked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Cal linked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {p.description}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      p.status === "upcoming"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-[#9b87f5]" />
                    <span>
                      {/* date/time kept only for legacy display; schedule is Cal-only */}
                      {p.date} {p.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#67c6c6]" />
                    <span>{p.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#6b5df5]" />
                    <span>
                      {p.participants || 0}/{p.max_capacity} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-[#f97373]" />
                    <span>{p.instructor}</span>
                  </div>
                  {durationLabel && (
                    <div className="flex items-center gap-1 col-span-2">
                      <Timer className="w-4 h-4 text-[#9b87f5]" />
                      <span>Duration: {durationLabel}</span>
                    </div>
                  )}
                </div>

                {/* Column / ordering / active shown for ALL programs.
                    Day/Time only really meaningful for support groups. */}
                <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                  {isSupportGroupRow && (
                    <>
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                        Day: {p.day_label || "-"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                        TimeLabel: {p.time_label || "-"}
                      </span>
                    </>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                    Column: {p.column_index === 2 ? "Right" : "Left"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                    Order: {p.sort_order || 0}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                    Active: {p.is_active ? "Yes" : "No"}
                  </span>
                </div>

                {/* Cal link / button for ALL programs */}
                <div className="pt-2">
                  {!linked ? (
                    <button
                      onClick={() => createCalEventType(p.id)}
                      disabled={calLoadingId === p.id}
                      className="inline-flex items-center gap-1 border border-[#c7d2fe] px-3 py-1.5 rounded-xl text-sm text-[#4338ca] bg-[#eef2ff] hover:bg-[#e0e7ff] disabled:opacity-60"
                    >
                      {calLoadingId === p.id ? (
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
                    <p className="text-xs text-gray-500">
                      Cal linked but missing user/slug.
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="inline-flex items-center gap-1 border border-[#d0c8ff] px-3 py-1.5 rounded-xl text-sm text-[#6b5df5] bg-white hover:bg-[#f5f3ff]"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProgram(p.id)}
                    className="inline-flex items-center gap-1 border border-[#fecaca] px-3 py-1.5 rounded-xl text-sm text-[#b91c1c] bg-white hover:bg-[#fee2e2]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {programs.length === 0 && (
            <div className="text-center text-gray-500 text-sm col-span-full py-10">
              No programs yet. Click <strong>Add Program</strong>.
            </div>
          )}
        </div>

        {/* Program modal */}
        {showProgramModal && (
          <Modal onClose={closeProgramModal}>
            <h2 className="text-xl font-semibold text-gray-800">
              {editMode ? "Edit Program" : "Add New Program"}
            </h2>

            <div className="grid gap-4 mt-4">
              <Field label="Program Title *">
                <input
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </Field>

              <Field label="Description *">
                <textarea
                  rows={3}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        category: e.target.value,
                        subcategory: "",
                      }))
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Instructor *">
                  <input
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        instructor: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              {isGentleExercise && (
                <Field label="Subcategory *">
                  <select
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        subcategory: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select subcategory</option>
                    {GENTLE_EXERCISE_SUBCATS.map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Support-group-only labels */}
              {isSupportGroup && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Day Label *">
                    <input
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.day_label}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          day_label: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="Time Label *">
                    <input
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      value={formData.time_label}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          time_label: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              )}

              {/* Column / sort / active – for ALL categories */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Column">
                  <select
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.column_index}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        column_index: parseInt(e.target.value, 10),
                      }))
                    }
                  >
                    <option value={1}>Left</option>
                    <option value={2}>Right</option>
                  </select>
                </Field>

                <Field label="Sort Order">
                  <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        sort_order: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                  />
                </Field>

                <label className="col-span-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        is_active: e.target.checked,
                      }))
                    }
                  />
                  Active
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Location *">
                  <input
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, location: e.target.value }))
                    }
                  />
                </Field>

                <Field label="Max Capacity *">
                  <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        maxCapacity: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <Field label="Program Duration (minutes) *">
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      durationMinutes: e.target.value,
                    }))
                  }
                  placeholder="e.g. 60"
                />
              </Field>

              <Field label="Status">
                <select
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={closeProgramModal}
                  className="border px-4 py-2 rounded-xl text-sm bg-gray-50 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProgram}
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
          </Modal>
        )}

        {/* Categories modal */}
        {showCategoriesModal && (
          <Modal onClose={() => setShowCategoriesModal(false)}>
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Categories
            </h2>

            <div className="flex gap-2 mt-4">
              <input
                className="flex-1 border rounded-xl px-3 py-2 text-sm"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <button
                onClick={addCategory}
                className="bg-gradient-to-r from-[#9b87f5] to-[#6b5df5] text-white px-4 py-2 rounded-xl text-sm"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between border border-[#e5e0ff] rounded-xl px-3 py-2 text-sm bg-[#fcfbff]"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}

              {categories.length === 0 && (
                <p className="text-xs text-gray-500">No categories yet.</p>
              )}
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------------------- tiny presentational bits ---------------------- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/80 border rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
      </div>
      {icon}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
