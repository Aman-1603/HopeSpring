// src/features/admin/pages/AdminBoutiqueRequests.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ShoppingBag,
  Truck,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Filter,
  RefreshCw,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "/api/boutique/requests";

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

function StatusPill({ status }) {
  const s = (status || "").toLowerCase();
  let cls =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ";

  if (s === "new") {
    cls += "bg-amber-50 text-amber-800 border-amber-200";
  } else if (s === "in_progress") {
    cls += "bg-sky-50 text-sky-800 border-sky-200";
  } else if (s === "completed") {
    cls += "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (s === "cancelled") {
    cls += "bg-rose-50 text-rose-800 border-rose-200";
  } else {
    cls += "bg-slate-50 text-slate-700 border-slate-200";
  }

  const label =
    s === "in_progress"
      ? "In progress"
      : s
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : "Unknown";

  return (
    <span className={cls}>
      <Package className="w-3 h-3" />
      {label}
    </span>
  );
}

function MethodPill({ method }) {
  const m = (method || "").toLowerCase();
  if (m === "home_delivery") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium">
        <Truck className="w-3 h-3" />
        Home delivery
      </span>
    );
  }
  if (m === "clinic_pickup") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 text-[11px] font-medium">
        <Store className="w-3 h-3" />
        Clinic pickup
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 text-[11px] font-medium">
      <ShoppingBag className="w-3 h-3" />
      Not set
    </span>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
      {children}
    </span>
  );
}

export default function AdminBoutiqueRequests() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [search, setSearch] = useState("");

  // which row is currently being PATCHed
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Accept either { items: [...] }, { requests: [...] } or a raw array
        const raw = res.data;
        let list = [];
        if (Array.isArray(raw)) list = raw;
        else if (Array.isArray(raw?.items)) list = raw.items;
        else if (Array.isArray(raw?.requests)) list = raw.requests;
        else if (Array.isArray(raw?.data)) list = raw.data;
        else if (Array.isArray(raw?.rows)) list = raw.rows;

        setItems(list || []);
      } catch (e) {
        console.error("fetch boutique requests failed:", e);
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e.message ||
          "Unable to load boutique requests.";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return items.filter((r) => {
      const status = (r.status || "").toLowerCase();
      const method = (r.delivery_method || "").toLowerCase();

      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (methodFilter !== "all" && method !== methodFilter) return false;

      if (!q) return true;

      const haystack = [
        r.requester_name,
        r.requester_email,
        r.requester_phone,
        r.recipient_name,
        r.relationship,
        r.city,
        r.notes,
        r.other_items,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [items, statusFilter, methodFilter, search]);

  const stats = useMemo(() => {
    const total = items.length;
    const byStatus = items.reduce(
      (acc, r) => {
        const s = (r.status || "unknown").toLowerCase();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      {}
    );
    const home = items.filter(
      (r) => (r.delivery_method || "").toLowerCase() === "home_delivery"
    ).length;
    const pickup = items.filter(
      (r) => (r.delivery_method || "").toLowerCase() === "clinic_pickup"
    ).length;

    return { total, byStatus, home, pickup };
  }, [items]);

  const handleRefresh = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data?.items)) list = res.data.items;
      else if (Array.isArray(res.data?.requests)) list = res.data.requests;
      else if (Array.isArray(res.data?.data)) list = res.data.data;
      else if (Array.isArray(res.data?.rows)) list = res.data.rows;

      setItems(list || []);
    } catch (e) {
      console.error("refresh boutique requests failed:", e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Failed to refresh.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---- STATUS UPDATE ----
  const updateStatus = async (id, nextStatus) => {
    if (!token) return;
    setErr(null);
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${API_URL}/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data?.request || null;

      setItems((prev) =>
        prev.map((r) =>
          r.id === id
            ? updated
              ? { ...r, ...updated }
              : { ...r, status: nextStatus, updated_at: new Date().toISOString() }
            : r
        )
      );
    } catch (e) {
      console.error("update boutique status failed:", e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e.message ||
        "Failed to update status.";
      setErr(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusButtons = (r) => {
    const s = (r.status || "").toLowerCase();
    const disabled = updatingId === r.id;

    if (s === "completed" || s === "cancelled") {
      // nothing to do, just show disabled label
      return (
        <span className="text-[11px] text-gray-400">
          Status locked ({s === "completed" ? "completed" : "cancelled"})
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {s === "new" && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => updateStatus(r.id, "in_progress")}
            className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
          >
            {disabled ? "Updating…" : "Mark in progress"}
          </button>
        )}

        {(s === "new" || s === "in_progress") && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => updateStatus(r.id, "completed")}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
          >
            {disabled ? "Updating…" : "Mark completed"}
          </button>
        )}

        {(s === "new" || s === "in_progress") && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => updateStatus(r.id, "cancelled")}
            className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            {disabled ? "Updating…" : "Cancel request"}
          </button>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Boutique Requests (Wigs, Camisoles &amp; Headcovers)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              View and manage requests for wigs, camisoles and headcovers
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-gray-500">
              Admin: {user?.name || user?.fullName || user?.email}
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Total requests
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.total}
              </p>
              <p className="text-[11px] text-gray-500">
                New: {stats.byStatus["new"] || 0} • In progress:{" "}
                {stats.byStatus["in_progress"] || 0}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sky-50 flex items-center justify-center">
              <Truck className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Home delivery
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.home}
              </p>
              <p className="text-[11px] text-gray-500">
                Clinic pickup: {stats.pickup}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Completed / Cancelled
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {(stats.byStatus["completed"] || 0) +
                  (stats.byStatus["cancelled"] || 0)}
              </p>
              <p className="text-[11px] text-gray-500">
                Completed: {stats.byStatus["completed"] || 0} • Cancelled:{" "}
                {stats.byStatus["cancelled"] || 0}
              </p>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
              <Filter className="w-3 h-3" />
              Filters
            </span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All methods</option>
              <option value="home_delivery">Home delivery</option>
              <option value="clinic_pickup">Clinic pickup</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search name, email, city, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* ERROR / EMPTY / LIST */}
        {err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>{err}</p>
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Loading boutique requests…</p>
        )}

        {!loading && !err && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-8 text-center text-sm text-emerald-900">
            No requests match your filters.
          </div>
        )}

        {!loading && !err && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((r) => {
              const wants = [];
              if (r.wants_wig) wants.push("Wig");
              if (r.wants_headcover) wants.push("Headcover");
              if (r.wants_camisole) wants.push("Camisole");
              if (r.other_items) wants.push("Other");

              const forWhom =
                r.for_whom === "self"
                  ? "For self"
                  : r.for_whom === "family"
                  ? "For family member"
                  : r.for_whom === "friend"
                  ? "For friend"
                  : r.for_whom
                  ? `For ${r.for_whom}`
                  : null;

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3 sm:flex-row sm:justify-between"
                >
                  {/* LEFT SIDE */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        Boutique request #{r.id}
                      </p>
                      <StatusPill status={r.status} />
                      <MethodPill method={r.delivery_method} />
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        {r.requester_name || "Unknown requester"}
                      </span>
                      {r.requester_email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {r.requester_email}
                        </span>
                      )}
                      {r.requester_phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {r.requester_phone}
                        </span>
                      )}
                    </div>

                    {forWhom && (
                      <p className="text-[11px] text-gray-500">
                        {forWhom}
                        {r.recipient_name
                          ? ` — recipient: ${r.recipient_name}${
                              r.relationship ? ` (${r.relationship})` : ""
                            }`
                          : ""}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mt-1">
                      {wants.map((w) => (
                        <Chip key={w}>{w}</Chip>
                      ))}
                      {r.other_items && <Chip>Details in notes</Chip>}
                    </div>

                    {r.notes && (
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        Notes: {r.notes}
                      </p>
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-end justify-between gap-2 text-xs">
                    <div className="text-right space-y-1">
                      <p className="text-[11px] text-gray-500">
                        Created: {fmtDateTime(r.created_at)}
                      </p>
                      {r.updated_at && (
                        <p className="text-[11px] text-gray-400">
                          Updated: {fmtDateTime(r.updated_at)}
                        </p>
                      )}
                      {r.delivery_method === "home_delivery" && (
                        <div className="mt-1 text-[11px] text-gray-600 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                          <div>
                            {r.address_line1 && <div>{r.address_line1}</div>}
                            {r.address_line2 && <div>{r.address_line2}</div>}
                            {(r.city || r.province || r.postal_code) && (
                              <div>
                                {[r.city, r.province, r.postal_code]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}
                            {r.in_local_delivery_area && (
                              <div className="mt-0.5 text-emerald-700">
                                In local delivery area
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    {renderStatusButtons(r)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
