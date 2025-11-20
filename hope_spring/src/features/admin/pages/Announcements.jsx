// src/admin/Announcements.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Megaphone, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import AdminLayout from "../AdminLayout";

const API_BASE = "/api/announcements";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    expiryDate: "",
    published: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const res = await axios.get(API_BASE);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error loading announcements:", err);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.description) {
      alert("Title and description are required");
      return;
    }

    try {
      const res = await axios.post(API_BASE, {
        title: form.title,
        description: form.description,
        link: form.link || null,
        expiryDate: form.expiryDate || null,
        published: form.published,
        image: null,
      });

      setAnnouncements((prev) => [res.data, ...prev]);
      setShowForm(false);

      setForm({
        title: "",
        description: "",
        link: "",
        expiryDate: "",
        published: true,
      });
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Failed to add announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete");
    }
  };

  const activeAnnouncements = announcements.filter((a) => a.published).length;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Announcements & Ads
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage homepage announcements
            </p>
          </div>

          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">Total</p>
            <h3 className="text-2xl font-bold mt-1">{announcements.length}</h3>
          </div>
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">Published</p>
            <h3 className="text-2xl font-bold text-indigo-500 mt-1">
              {activeAnnouncements}
            </h3>
          </div>
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-gray-500">Draft</p>
            <h3 className="text-2xl font-bold text-purple-500 mt-1">
              {announcements.length - activeAnnouncements}
            </h3>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="rounded-2xl border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create New Announcement</h2>

            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2"
                placeholder="Enter description..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block">Link (optional)</label>
                <input
                  value={form.link}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, link: e.target.value }))
                  }
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="/programs/yoga"
                />
              </div>
              <div>
                <label className="text-sm font-medium block">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="w-full border rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm pt-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
              />
              Publish immediately
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="border rounded-xl px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="rounded-xl bg-indigo-500 text-white px-4 py-2"
              >
                Create Announcement
              </button>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Megaphone className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        a.published
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{a.description}</p>

                  <div className="text-sm text-gray-500 space-x-4">
                    <span>Created: {a.created_date?.slice(0, 10)}</span>
                    {a.expiry_date && <span>Expires: {a.expiry_date}</span>}
                    {a.link && <span>Link: {a.link}</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="border rounded-lg p-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="border rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};

export default Announcements;
