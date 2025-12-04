// src/features/admin/pages/AdminWaitlist.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  Clock,
  ArrowUpCircle,
  UserX,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "../AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";

const PROGRAMS_API = "/api/programs";
const SUMMARY_API = "/api/bookings/programs";
const WAITLIST_API = "/api/waitlist";
const CAL_SLOTS_API = "/api/cal/programs";

/* ---------- small helpers ---------- */

function formatDateTime(iso) {
  if (!iso) return "";
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

function formatSlotLabel(slot) {
  if (!slot?.start) return "Unknown slot";
  try {
    const d = new Date(slot.start);
    const datePart = d.toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-CA", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart}`;
  } catch {
    return slot.start;
  }
}

/* ---------- small UI atoms ---------- */

const Pill = ({ children, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-rose-100 text-rose-800",
    orange: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-800",
  }[color];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors}`}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

/* ---------- Promote Modal ---------- */

function PromoteModal({
  open,
  onClose,
  entry,
  program,
  slots,
  summary,
  onConfirm,
  loading,
  error,
}) {
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedSlotId("");
    }
  }, [open, entry?.id, program?.id]);

  const futureSlots = useMemo(() => {
    if (!slots || slots.length === 0) return [];
    const now = new Date();
    return slots.filter((s) => {
      if (!s.start) return false;
      try {
        const d = new Date(s.start);
        return d >= now;
      } catch {
        return false;
      }
    });
  }, [slots]);

  const selectedSlot = useMemo(
    () => futureSlots.find((s) => String(s.id || s.start) === selectedSlotId),
    [futureSlots, selectedSlotId]
  );

  if (!open || !entry || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
            Promote from waitlist
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 text-sm">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <p className="font-medium text-emerald-900">
              {entry.attendee_name || "Unnamed attendee"}
            </p>
            <p className="text-xs text-emerald-800">{entry.attendee_email}</p>
            <p className="mt-1 text-xs text-emerald-800">
              Joined waitlist: {formatDateTime(entry.created_at)}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
            <div className="text-xs text-gray-700">
              <p className="font-semibold text-gray-900">{program.title}</p>
              {summary && (
                <p className="mt-1">
                  Capacity:{" "}
                  <span className="font-semibold">
                    {summary.capacity ?? "—"}
                  </span>{" "}
                  • Booked:{" "}
                  <span className="font-semibold">{summary.bookedCount}</span>{" "}
                  • Free now:{" "}
                  <span className="font-semibold">
                    {summary.freeSeats ?? "—"}
                  </span>
                </p>
              )}
            </div>
          </div>

          {futureSlots.length === 0 ? (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <div>
                <p className="font-semibold">No upcoming slots found.</p>
                <p>
                  Please update availability in Cal.com for this event type,
                  then refresh this page.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Choose a slot in Cal
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
              >
                <option value="">Select a time…</option>
                {futureSlots.map((slot, idx) => {
                  const key = String(slot.id || slot.start || idx);
                  return (
                    <option key={key} value={key}>
                      {formatSlotLabel(slot)}
                    </option>
                  );
                })}
              </select>
              <p className="text-[11px] text-gray-500">
                After confirming, a booking will be created in Cal. Cal will
                send the confirmation email and our system will sync it into the
                bookings table via webhook.
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-md px-3 py-1.5">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center border-t px-5 py-3 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || !selectedSlot}
            onClick={() => onConfirm(selectedSlot)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${
              loading || !selectedSlot
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading && (
              <RefreshCw className="w-3 h-3 animate-spin text-white/80" />
            )}
            Confirm & create booking
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- MAIN PAGE ---------- */

export default function AdminWaitlist() {
  const { token } = useAuth();
  const authToken = token || null;

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState(null);

  const [selectedProgramId, setSelectedProgramId] = useState("");

  const [summary, setSummary] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [promoteEntry, setPromoteEntry] = useState(null);
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState(null);

  // common axios config for protected endpoints
  const authConfig = authToken
    ? { headers: { Authorization: `Bearer ${authToken}` } }
    : {};

  /* ----- load programs with Cal integration ----- */
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const res = await axios.get(PROGRAMS_API); // public endpoint
        const all = res.data || [];

        const filtered = all.filter(
          (p) => p.cal_event_type_id && p.is_active !== false
        );

        setPrograms(filtered);
        setProgramsError(null);

        if (filtered.length > 0) {
          setSelectedProgramId(String(filtered[0].id));
        }
      } catch (err) {
        console.error("Error loading programs for waitlist:", err);
        setProgramsError("Unable to load programs.");
      } finally {
        setLoadingPrograms(false);
      }
    };

    loadPrograms();
  }, []);

  const selectedProgram = useMemo(() => {
    if (!selectedProgramId) return null;
    const pid = Number(selectedProgramId);
    return programs.find((p) => p.id === pid) || null;
  }, [programs, selectedProgramId]);

  /* helper to normalize waitlist response shape */
  function extractWaitlist(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.waitlist)) return data.waitlist;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.entries)) return data.entries;
    return [];
  }

  /* ----- load summary + waitlist + slots when program OR auth changes ----- */
  useEffect(() => {
    const load = async () => {
      if (!selectedProgramId) return;
      const pid = Number(selectedProgramId);
      if (!pid || !Number.isFinite(pid)) return;

      try {
        setLoadingData(true);
        setDataError(null);

        const [summaryRes, waitlistRes, slotsRes] = await Promise.all([
          axios.get(`${SUMMARY_API}/${pid}/summary`, authConfig),
          axios.get(`${WAITLIST_API}/program/${pid}`, authConfig),
          axios.get(`${CAL_SLOTS_API}/${pid}/slots`, authConfig),
        ]);

        setSummary(summaryRes.data || null);
        setWaitlist(extractWaitlist(waitlistRes.data));
        setSlots(slotsRes.data?.slots || []);
      } catch (err) {
        console.error("Error loading waitlist dashboard data:", err);
        setDataError(
          "Failed to load waitlist / booking info for this program."
        );
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [selectedProgramId, authToken]); // refetch if token changes

  const waitingEntries = useMemo(
    () => waitlist.filter((w) => w.status === "waiting"),
    [waitlist]
  );
  const promotedEntries = useMemo(
    () => waitlist.filter((w) => w.status === "promoted"),
    [waitlist]
  );
  const cancelledEntries = useMemo(
    () => waitlist.filter((w) => w.status === "cancelled"),
    [waitlist]
  );

  const handleRefresh = async () => {
    if (!selectedProgramId) return;
    const pid = Number(selectedProgramId);
    try {
      setLoadingData(true);
      setDataError(null);
      const [summaryRes, waitlistRes, slotsRes] = await Promise.all([
        axios.get(`${SUMMARY_API}/${pid}/summary`, authConfig),
        axios.get(`${WAITLIST_API}/program/${pid}`, authConfig),
        axios.get(`${CAL_SLOTS_API}/${pid}/slots`, authConfig),
      ]);

      setSummary(summaryRes.data || null);
      setWaitlist(extractWaitlist(waitlistRes.data));
      setSlots(slotsRes.data?.slots || []);
    } catch (err) {
      console.error("Error refreshing waitlist data:", err);
      setDataError("Failed to refresh data.");
    } finally {
      setLoadingData(false);
    }
  };

  const openPromoteModal = (entry) => {
    setPromoteEntry(entry);
    setPromoteError(null);
    setPromoteModalOpen(true);
  };

  const handlePromoteConfirm = async (slot) => {
    if (!selectedProgramId || !promoteEntry || !slot?.start) return;

    const pid = Number(selectedProgramId);
    setPromoteLoading(true);
    setPromoteError(null);

    try {
      const slotEnd = slot.endTime || slot.end || null;

      await axios.post(
        `${WAITLIST_API}/${promoteEntry.id}/promote`,
        {
          programId: pid,
          slotStart: slot.start,
          slotEnd: slotEnd,
        },
        authConfig
      );

      setPromoteModalOpen(false);
      setPromoteEntry(null);

      await handleRefresh();
    } catch (err) {
      console.error("Error promoting waitlist entry:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to promote this entry";
      setPromoteError(msg);
    } finally {
      setPromoteLoading(false);
    }
  };

  const handleCancelWaitlist = async (entryId) => {
    if (!entryId) return;
    try {
      await axios.post(`${WAITLIST_API}/${entryId}/cancel`, null, authConfig);
      await handleRefresh();
    } catch (err) {
      console.error("Error cancelling waitlist entry:", err);
      // silent
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Waitlist & Capacity
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              See how many seats are booked, how many are free, and manage the
              waitlist.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingData}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3 h-3 ${loadingData ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Program selector */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">
                Program linked to Cal
              </p>
              <select
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[220px]"
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                disabled={loadingPrograms}
              >
                {loadingPrograms && <option>Loading…</option>}
                {!loadingPrograms && programs.length === 0 && (
                  <option>No programs linked to Cal</option>
                )}
                {!loadingPrograms &&
                  programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (#{p.id})
                    </option>
                  ))}
              </select>
              {programsError && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {programsError}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Summary + quick stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Capacity
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.capacity ?? "—"}
              </p>
              <p className="text-[11px] text-gray-500">
                Participants field: {summary?.participants ?? 0}
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Booked
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.bookedCount ?? 0}
              </p>
              <p className="text-[11px] text-gray-500">
                Future bookings in our DB
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Free seats & waiting
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.freeSeats ?? "—"}{" "}
                <span className="text-xs text-gray-500">free</span>
              </p>
              <p className="text-[11px] text-gray-500">
                {summary?.waitlistWaiting ?? waitingEntries.length} on waitlist
              </p>
            </div>
          </Card>
        </div>

        {dataError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {dataError}
          </div>
        )}

        {/* Waitlist tables */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
          {/* Left: waiting + promoted */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Waiting list
                </h2>
                <Pill color="green">Waiting: {waitingEntries.length}</Pill>
              </div>

              {waitingEntries.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No one is currently waiting for this program.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b text-[11px] uppercase text-gray-500">
                        <th className="py-2 pr-2 text-left">Name</th>
                        <th className="py-2 px-2 text-left">Email</th>
                        <th className="py-2 px-2 text-left">Joined</th>
                        <th className="py-2 pl-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitingEntries.map((w) => (
                        <tr key={w.id} className="border-b last:border-0">
                          <td className="py-2 pr-2">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {w.attendee_name || "Unknown"}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                #{w.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-2 text-gray-700">
                            <span className="break-all text-[11px]">
                              {w.attendee_email}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-[11px] text-gray-500">
                            {formatDateTime(w.created_at)}
                          </td>
                          <td className="py-2 pl-2 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => openPromoteModal(w)}
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                              >
                                <ArrowUpCircle className="w-3 h-3" />
                                Promote
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelWaitlist(w.id)}
                                className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                              >
                                <UserX className="w-3 h-3" />
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  Promoted from waitlist
                </h2>
                <Pill color="blue">Promoted: {promotedEntries.length}</Pill>
              </div>
              {promotedEntries.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No entries have been promoted yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b text-[11px] uppercase text-gray-500">
                        <th className="py-2 pr-2 text-left">Name</th>
                        <th className="py-2 px-2 text-left">Email</th>
                        <th className="py-2 px-2 text-left">Joined</th>
                        <th className="py-2 pl-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotedEntries.map((w) => (
                        <tr key={w.id} className="border-b last:border-0">
                          <td className="py-2 pr-2">
                            <span className="font-medium text-gray-900">
                              {w.attendee_name || "Unknown"}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-gray-700">
                            <span className="break-all text-[11px]">
                              {w.attendee_email}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-[11px] text-gray-500">
                            {formatDateTime(w.created_at)}
                          </td>
                          <td className="py-2 pl-2 text-left">
                            <Pill color="green">Promoted</Pill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Right: cancelled + slots info */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  Cancelled / removed
                </h2>
                <Pill color="red">Cancelled: {cancelledEntries.length}</Pill>
              </div>
              {cancelledEntries.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No cancelled waitlist entries.
                </p>
              ) : (
                <div className="max-h-64 overflow-auto">
                  <ul className="space-y-2 text-xs">
                    {cancelledEntries.map((w) => (
                      <li
                        key={w.id}
                        className="flex justify-between items-start border-b last:border-0 pb-1"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {w.attendee_name || "Unknown"}
                          </p>
                          <p className="text-[11px] text-gray-500 break-all">
                            {w.attendee_email}
                          </p>
                        </div>
                        <Pill color="red">Cancelled</Pill>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  Upcoming slots (Cal)
                </h2>
                <Pill color="orange">{slots.length} total</Pill>
              </div>
              {slots.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No slots detected for this program. Make sure your Cal
                  schedule has availability configured.
                </p>
              ) : (
                <ul className="space-y-1 max-h-52 overflow-auto text-xs">
                  {slots.slice(0, 15).map((s, idx) => (
                    <li
                      key={String(s.id || s.start || idx)}
                      className="flex items-center justify-between text-gray-700"
                    >
                      <span>{formatSlotLabel(s)}</span>
                    </li>
                  ))}
                  {slots.length > 15 && (
                    <li className="text-[11px] text-gray-500">
                      + {slots.length - 15} more…
                    </li>
                  )}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>

      <PromoteModal
        open={promoteModalOpen}
        onClose={() => {
          setPromoteModalOpen(false);
          setPromoteEntry(null);
          setPromoteError(null);
        }}
        entry={promoteEntry}
        program={selectedProgram}
        slots={slots}
        summary={summary}
        onConfirm={handlePromoteConfirm}
        loading={promoteLoading}
        error={promoteError}
      />
    </AdminLayout>
  );
}
