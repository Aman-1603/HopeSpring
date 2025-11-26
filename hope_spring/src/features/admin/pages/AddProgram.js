import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
//import { CalendarDays, MapPin, Users, User, PlusCircle, Tag, Link2, CheckCircle2, Loader2 } from "lucide-react";
// Use relative path for proxy
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
} from "lucide-react";

const API_BASE = "/api/programs";
const CAL_BASE = "/api/cal";

/* ---------------------- date helpers (no deps) ---------------------- */
const pad2 = (n) => String(n).padStart(2, "0");
const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const getMonthMatrix = (year, monthIndex0) => {
  const first = new Date(year, monthIndex0, 1);
  const last = new Date(year, monthIndex0 + 1, 0);
  const startWeekday = first.getDay();
  const daysInMonth = last.getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, monthIndex0, d));
  }
  while (cells.length < 42) cells.push(null);

  const rows = [];
  for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7));
  return rows;
};
/* ------------------------------------------------------------------- */

const emptyForm = {
  id: null,
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  maxCapacity: "",
  instructor: "",
  status: "upcoming",

  // support group
  day_label: "",
  time_label: "",
  column_index: 1,
  sort_order: 0,
  is_active: true,

  // occurrences extras (date-only strings)
  additionalDates: [],

  // month picker cursor YYYY-MM
  monthCursor: "",
};

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
    const now = new Date();
    const ym = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
    setEditMode(false);
    setFormData({ ...emptyForm, monthCursor: ym });
    setShowProgramModal(true);
  };

  const openEdit = async (p) => {
    setEditMode(true);

    let primaryDate = p.date || "";
    let primaryTime = p.time || "";
    let extras = [];

    try {
      const occRes = await axios.get(`${API_BASE}/${p.id}/occurrences`);
      const occs = (occRes.data || []).sort(
        (a, b) => new Date(a.starts_at) - new Date(b.starts_at)
      );

      if (occs.length) {
        const first = new Date(occs[0].starts_at);
        primaryDate = toYMD(first);
        primaryTime = `${pad2(first.getHours())}:${pad2(
          first.getMinutes()
        )}`;
      }
      extras = occs.slice(1).map((o) => toYMD(new Date(o.starts_at)));
    } catch {
      // fall back to programs table values
    }

    const monthCursor =
      primaryDate?.slice(0, 7) ||
      `${new Date().getFullYear()}-${pad2(new Date().getMonth() + 1)}`;

    setFormData({
      id: p.id,
      title: p.title || "",
      description: p.description || "",
      category: p.category || "",
      date: primaryDate,
      time: primaryTime,
      location: p.location || "",
      maxCapacity: p.max_capacity ?? "",
      instructor: p.instructor || "",
      status: p.status || "upcoming",

      day_label: p.day_label || "",
      time_label: p.time_label || "",
      column_index: p.column_index || 1,
      sort_order: p.sort_order || 0,
      is_active: p.is_active ?? true,

      additionalDates: extras,
      monthCursor,
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
      await fetchPrograms();
      if (!quiet) {
        alert(
          `Cal linked.\nID: ${res.data.cal_event_type_id}\nSlug: ${res.data.cal_slug}`
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
  /* ---------------------------------------------------------- */

  /* ---------------------- save/delete programs ---------------------- */
  const saveProgram = async () => {
    // normalize category -> support_group / yoga / whatever
    const normalizedCategory = (formData.category || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    const isSupportGroup = normalizedCategory === "support_group";

    // base required for all programs
    const baseRequired = [
      "title",
      "description",
      "category",
      "location",
      "maxCapacity",
      "instructor",
    ];

    // non-support groups still require date+time
    const required = isSupportGroup
      ? baseRequired
      : [...baseRequired, "date", "time"];

    for (const f of required) {
      if (!formData[f]) return alert("Fill all required fields.");
    }

    if (isSupportGroup) {
      if (!formData.day_label || !formData.time_label) {
        return alert("Support group needs Day Label and Time Label.");
      }
    }

    const extras = Array.from(new Set(formData.additionalDates || []))
      .filter(Boolean)
      .filter((d) => d !== formData.date);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      // support_group -> no admin date/time, Cal owns schedule
      date: isSupportGroup ? null : formData.date,
      time: isSupportGroup ? null : formData.time,
      location: formData.location.trim(),
      maxCapacity: parseInt(formData.maxCapacity, 10),
      instructor: formData.instructor.trim(),
      status: formData.status,

      day_label: formData.day_label || null,
      time_label: formData.time_label || null,
      column_index: formData.column_index || 1,
      sort_order: formData.sort_order || 0,
      is_active: formData.is_active ?? true,

      // support_group -> no occurrences created from admin
      additionalDates: isSupportGroup ? [] : extras,
    };

    try {
      setIsSaving(true);
      if (editMode && formData.id) {
        await axios.put(`${API_BASE}/${formData.id}`, payload);
        await fetchPrograms();
      } else {
        const res = await axios.post(API_BASE, payload);
        const createdId = res.data?.id;
        if (normalizedCategory === "support_group" && createdId) {
          await createCalEventType(createdId, true);
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

  /* ---------------------- multi-date picker ---------------------- */
  const monthCursor = formData.monthCursor;
  const [cursorYear, cursorMonthIndex0] = useMemo(() => {
    if (!monthCursor) {
      const now = new Date();
      return [now.getFullYear(), now.getMonth()];
    }
    const [y, m] = monthCursor.split("-").map(Number);
    return [y, m - 1];
  }, [monthCursor]);

  const monthRows = useMemo(
    () => getMonthMatrix(cursorYear, cursorMonthIndex0),
    [cursorYear, cursorMonthIndex0]
  );

  const toggleExtraDate = (ymd) => {
    setFormData((prev) => {
      const set = new Set(prev.additionalDates || []);
      if (set.has(ymd)) set.delete(ymd);
      else set.add(ymd);
      return { ...prev, additionalDates: Array.from(set).sort() };
    });
  };

  const removeExtraDate = (ymd) => {
    setFormData((prev) => ({
      ...prev,
      additionalDates: (prev.additionalDates || []).filter(
        (d) => d !== ymd
      ),
    }));
  };
  /* ------------------------------------------------------------------ */

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

  // UI-level normalization for deciding whether to hide date/time UI
  const normalizedCategory = (formData.category || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const isSupportGroup = normalizedCategory === "support_group";

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
              Create programs, set multiple monthly sessions, and link Cal
              booking.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoriesModal(true)}
              className="flex items-center gap-1 border border-[#d0c8ff] text-[#6b5df5] px-3 py-2 rounded-xl text-sm bg-white hover:bg-[#f4f1ff]"
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
            const linked = !!p.cal_event_type_id;
            const bookingUrl =
              linked && p.cal_user && p.cal_slug
                ? `https://cal.com/${p.cal_user}/${p.cal_slug}`
                : null;

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
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4f1ff] border border-[#e0d8ff] text-[#6b5df5]">
                        <Tag className="w-3 h-3" />
                        {p.category || "uncategorized"}
                      </span>
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
                </div>

                {/* Support group meta */}
                {p.category === "support_group" && (
                  <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      Day: {p.day_label || "-"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 border">
                      TimeLabel: {p.time_label || "-"}
                    </span>
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
                )}

                {/* Cal actions for support groups */}
                {p.category === "support_group" && (
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
                )}

                {/* actions */}
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
                      setFormData((p) => ({ ...p, category: e.target.value }))
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

              {/* support group fields */}
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
                          sort_order: parseInt(e.target.value, 10),
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
              )}

              {/* primary date/time + extra dates
                  shown ONLY for non-support-group programs */}
              {!isSupportGroup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Primary Date *">
                      <input
                        type="date"
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            date: e.target.value,
                            monthCursor: e.target.value
                              ? e.target.value.slice(0, 7)
                              : p.monthCursor,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Primary Time *">
                      <input
                        type="time"
                        className="w-full border rounded-xl px-3 py-2 text-sm"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, time: e.target.value }))
                        }
                      />
                    </Field>
                  </div>

                  {/* multi-date picker */}
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <label className="text-sm font-medium block">
                          Extra session dates (optional)
                        </label>
                        <p className="text-xs text-slate-500">
                          Click multiple dates. All extras use Primary Time.
                        </p>
                      </div>
                      <input
                        type="month"
                        className="border rounded-xl px-3 py-2 text-sm bg-white"
                        value={formData.monthCursor}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            monthCursor: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mt-3 bg-white rounded-xl border p-3">
                      <div className="grid grid-cols-7 text-xs font-semibold text-slate-500 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (w) => (
                            <div key={w} className="text-center">
                              {w}
                            </div>
                          )
                        )}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {monthRows.flat().map((cell, idx) => {
                          if (!cell) return <div key={idx} className="h-9" />;

                          const ymd = toYMD(cell);
                          const selected = (
                            formData.additionalDates || []
                          ).includes(ymd);
                          const isPrimary = ymd === formData.date;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                !isPrimary && toggleExtraDate(ymd)
                              }
                              className={[
                                "h-9 rounded-lg text-sm flex items-center justify-center border",
                                isPrimary
                                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 cursor-not-allowed"
                                  : selected
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                  : "bg-white border-slate-200 hover:bg-slate-50",
                              ].join(" ")}
                              title={
                                isPrimary
                                  ? "Primary date"
                                  : selected
                                  ? "Remove extra"
                                  : "Add extra"
                              }
                            >
                              {cell.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3">
                      {(formData.additionalDates || []).length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No extra dates selected.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.additionalDates.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white border text-xs"
                            >
                              {d}
                              <button
                                type="button"
                                onClick={() => removeExtraDate(d)}
                                title="Remove"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* location/capacity */}
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

              {/* actions */}
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
