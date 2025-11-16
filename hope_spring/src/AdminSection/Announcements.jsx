import { useState } from "react";
import { Megaphone, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";

// Mock announcements
const mockAnnouncements = [
  {
    id: 1,
    title: "New Yoga Program Starting Soon",
    description:
      "Join our new gentle yoga program designed specifically for wellness and recovery.",
    image: null,
    link: "/programs/yoga",
    expiryDate: "2024-05-30",
    published: true,
    createdDate: "2024-04-01",
  },
  {
    id: 2,
    title: "Community Fundraiser Event",
    description: "Help us reach our goal! Join our annual fundraising gala.",
    image: null,
    link: "/events/fundraiser",
    expiryDate: "2024-06-15",
    published: true,
    createdDate: "2024-04-05",
  },
  {
    id: 3,
    title: "Support Group Schedule Update",
    description:
      "Please note the new timing for our weekly support group meetings.",
    image: null,
    link: null,
    expiryDate: "2024-04-30",
    published: false,
    createdDate: "2024-04-10",
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    expiryDate: "",
    published: true,
  });

  const activeAnnouncements = announcements.filter((a) => a.published).length;

  const handleCreate = () => {
    if (!form.title || !form.description) {
      alert("Title and description are required");
      return;
    }

    const newAnnouncement = {
      id: announcements.length + 1,
      title: form.title,
      description: form.description,
      image: null,
      link: form.link || null,
      expiryDate: form.expiryDate || "",
      published: form.published,
      createdDate: new Date().toISOString().slice(0, 10),
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setShowForm(false);
    setForm({
      title: "",
      description: "",
      link: "",
      expiryDate: "",
      published: true,
    });
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Announcements & Ads
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage announcements for the homepage
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white hover:opacity-90 transition-all"
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
            <label className="text-sm font-medium block mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter title..."
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea
              placeholder="Enter description..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 min-h-[100px] focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Link (optional)
              </label>
              <input
                type="text"
                placeholder="/programs/..."
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiryDate: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>
          </div>

          <button
            className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Image
          </button>

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
              />
              Publish immediately
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="border rounded-xl px-4 py-2 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white px-4 py-2 hover:opacity-90"
              >
                Create Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border p-6 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
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
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Created: {a.createdDate}</span>
                  <span>Expires: {a.expiryDate}</span>
                  {a.link && <span>Link: {a.link}</span>}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2">
                <button className="border rounded-lg p-2 hover:bg-gray-50">
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
  );
};

export default Announcements;