import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import AdminLayout from "../AdminLayout";

// Recharts imports
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = process.env.REACT_APP_API_URL;

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  /* ================================
        FETCH DONATIONS FROM DB
  ================================== */
  const loadDonations = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/donations`);
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("❌ Error loading donations:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
       SUMMARY CALCULATIONS
  ================================== */
  const totalAmount = donations.reduce((sum, d) => sum + d.amount_cents, 0);
  const completed = donations.filter((d) => d.status === "completed").length;
  const pending = donations.filter((d) => d.status !== "completed").length;

  /* ================================
          GRAPH DATA FORMAT
  ================================== */
  const chartData = donations.map((d) => ({
    date: new Date(d.created_at).toLocaleDateString(),
    amount: d.amount_cents / 100,
  }));

  if (loading) {
    return <div className="p-6 text-gray-500">Loading donations...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">

        {/* ---------------------- PAGE HEADER ---------------------- */}
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Donation Management
        </h1>

        {/* ---------------------- SUMMARY CARDS ---------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-600 font-medium">Total Donations</h3>
            <p className="text-4xl mt-2 font-bold text-purple-600">
              {donations.length}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-600 font-medium">Total Amount</h3>
            <p className="text-4xl mt-2 font-bold text-blue-600">
              ${(totalAmount / 100).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-600 font-medium">Completed / Pending</h3>
            <p className="text-xl mt-3">
              <span className="text-green-600 font-semibold">{completed} Completed</span>{" "}
              •{" "}
              <span className="text-yellow-600 font-semibold">{pending} Pending</span>
            </p>
          </div>

        </div>

        {/* ---------------------- DONATION GRAPH ---------------------- */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Donation Trend
          </h3>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------------- DONATION TABLE ---------------------- */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">STRIPE SESSION</th>
                <th className="p-4">AMOUNT</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">EMAIL</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">DATE</th>
                <th className="p-4">EXPAND</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((d) => (
                <React.Fragment key={d.id}>
                  
                  {/* MAIN ROW */}
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold">{d.stripe_session_id}</td>
                    <td className="p-4">${(d.amount_cents / 100).toFixed(2)}</td>
                    <td className="p-4">{d.category}</td>

                    <td className="p-4">
                      {d.donor_email ? (
                        <span className="flex items-center gap-2">
                          <Mail size={16} />
                          {d.donor_email}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Not provided</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          d.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(d.created_at).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === d.id ? null : d.id)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {openRow === d.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDABLE ROW */}
                  {openRow === d.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="7" className="p-6">

                        <h3 className="font-semibold text-gray-700 text-lg mb-3">
                          Donation Details
                        </h3>

                        <div className="text-sm text-gray-700 space-y-2">
                          <p><strong>Stripe Session ID:</strong> {d.stripe_session_id}</p>
                          <p><strong>Amount:</strong> ${(d.amount_cents/100).toFixed(2)} CAD</p>
                          <p><strong>Category:</strong> {d.category}</p>
                          <p><strong>Email:</strong> {d.donor_email || "Not provided"}</p>
                          <p><strong>Status:</strong> {d.status}</p>
                          <p><strong>Currency:</strong> {d.currency}</p>
                          <p><strong>Date:</strong> {new Date(d.created_at).toLocaleString()}</p>
                        </div>

                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
