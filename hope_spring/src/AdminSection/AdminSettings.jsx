import { Save, Upload, Download } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage system configuration and preferences
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
          <p className="text-sm text-gray-500">
            Update your organization's basic information
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Organization Name
            </label>
            <input
              type="text"
              defaultValue="HopeSpring Cancer Support Centre"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Contact Email
            </label>
            <input
              type="email"
              defaultValue="info@hopespring.org"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 123-4567"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Logo
            </label>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
              <Upload className="w-4 h-4" />
              Upload New Logo
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Appearance</h2>
          <p className="text-sm text-gray-500">
            Customize the look and feel of your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                defaultValue="#9b87f5"
                className="w-16 h-10 border rounded-xl"
              />
              <input
                type="text"
                defaultValue="#9b87f5"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 block">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                defaultValue="#67c6c6"
                className="w-16 h-10 border rounded-xl"
              />
              <input
                type="text"
                defaultValue="#67c6c6"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Backup & Restore</h2>
          <p className="text-sm text-gray-500">
            Manage your data backup and restoration preferences
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:opacity-90 transition-all">
            <Save className="w-4 h-4" />
            Save Backup
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" />
            Download Backup
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-all">
            <Upload className="w-4 h-4" />
            Restore Backup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;