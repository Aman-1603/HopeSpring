// src/features/admin/pages/AdminPendingBookings.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Clock,
  CalendarDays,
  User,
  Mail,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const BOOKINGS_API = "/api/bookings";

function fmtDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }) {
  const s = (status || "").toUpperCase();
  let cls =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ";

  if (s === "PENDING") {
    cls += "bg-amber-50 text-amber-800 border-amber-200";
  } else if (s === "ACCEPTED") {
    cls += "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (s === "REJECTED" || s === "CANCELLED") {
    cls += "bg-rose-50 text-rose-800 border-rose-200";
  } else {
    cls += "bg-slate-50 text-slate-700 border-slate-200";
  }

  return (
    <span className={cls}>
      <Activity className="w-3 h-3" />
      {s || "UNKNOWN"}
    </span>
  );
}

export default function AdminPendingBookings() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionErr, setActionErr] = useState(null);

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  const loadPending = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(`${BOOKINGS_API}/pending`, authHeaders);
      setBookings(res.data?.bookings || []);
    } catch (e) {
      console.error("fetch pending bookings failed:", e);
      setErr("Unable to load pending bookings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Only counselling + PENDING (backend already gives pending, but we keep the category filter)
  const counsellingPending = useMemo(
    () =>
      bookings.filter((b) => {
        const status = (b.status || "").toUpperCase();
        const cat = (b.program_category || "").toLowerCase();
        return status === "PENDING" && cat === "counselling";
      }),
    [bookings]
  );

  const handleApprove = async (booking) => {
    if (!booking?.id) return;
    setActionErr(null);
    setActionLoadingId(booking.id);

    try {
      await axios.post(
        `${BOOKINGS_API}/${booking.id}/approve`,
        null,
        authHeaders
      );
      // After approving, Cal sends BOOKING_CREATED and webhook flips status to ACCEPTED.
      await loadPending();
    } catch (e) {
      console.error("approve booking failed:", e);
      setActionErr(
        e?.response?.data?.error ||
          e?.message ||
          "Failed to approve this booking."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (booking) => {
    if (!booking?.id) return;
    setActionErr(null);

    // Optional reason → goes into Cal decline payload
    const reason = window.prompt(
      "Optional: add a decline reason for the Cal notification email:",
      ""
    );
    setActionLoadingId(booking.id);

    try {
      await axios.post(
        `${BOOKINGS_API}/${booking.id}/reject`,
        reason ? { reason } : {},
        authHeaders
      );
      // Cal sends BOOKING_REJECTED; webhook flips status to REJECTED, and it disappears from pending.
      await loadPending();
    } catch (e) {
      console.error("reject booking failed:", e);
      setActionErr(
        e?.response?.data?.error ||
          e?.message ||
          "Failed to reject this booking."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Pending Counselling Requests
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              These are booking requests from Cal that are waiting for
              approval. Approve or reject them here — your action will call the
              Cal v2 API, Cal will send the email, and our webhook will update
              the status in the bookings table.
            </p>
          </div>
          <div className="flex flex-col items-end text-right gap-1">
            <p className="text-xs text-gray-500">
              Admin: {user?.fullName || user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-400">
              {counsellingPending.length} pending request
              {counsellingPending.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={loadPending}
              disabled={loading}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Status row / hint */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-amber-800 font-medium">
            Pending counselling
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-1.5 text-gray-500">
            Approved bookings move out of this list once Cal confirms them and
            our webhook syncs the status.
          </span>
        </div>

        {/* Loading / error / empty states */}
        {loading && (
          <p className="text-sm text-gray-500">Loading pending requests…</p>
        )}

        {err && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {err}
          </p>
        )}

        {actionErr && !loading && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
            {actionErr}
          </p>
        )}

        {!loading && !err && counsellingPending.length === 0 && (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-8 text-center text-sm text-emerald-900">
            No pending counselling requests right now.
          </div>
        )}

        {/* List of pending bookings */}
        {!loading && !err && counsellingPending.length > 0 && (
          <div className="space-y-3">
            {counsellingPending.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">
                      {b.program_title || "Counselling"}
                    </p>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-700 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      {b.attendee_name || "Unknown name"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {b.attendee_email || "No email"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      {fmtDateTime(b.event_start)}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    Booking UID (Cal): {b.cal_booking_id || "–"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    DB row id: #{b.id}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    Created: {fmtDateTime(b.created_at)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(b)}
                      disabled={actionLoadingId === b.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                    >
                      {actionLoadingId === b.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(b)}
                      disabled={actionLoadingId === b.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
