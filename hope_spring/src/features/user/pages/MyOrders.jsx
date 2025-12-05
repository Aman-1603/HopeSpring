import { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  Calendar,
  Download,
  Package,
} from "lucide-react";
import UserLayout from "../UserLayout";
import { useAuth } from "../../../contexts/AuthContext";

const MyOrders = () => {
  const { token: ctxToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusStyles = {
    completed: "bg-green-500/10 text-green-600",
    pending: "bg-blue-500/10 text-blue-600",
    cancelled: "bg-red-500/10 text-red-600",
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");

      const storedToken = ctxToken || localStorage.getItem("token");
      if (!storedToken) {
        setError("Login required");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/boutique/requests/my", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Login required");
          } else {
            setError(
              (data && data.message) ||
                "Failed to load your requests. Please try again."
            );
          }
          setLoading(false);
          return;
        }

        console.log("Fetched boutique requests:", data);
        const reqs = Array.isArray(data) ? data : data.requests || [];
        setRequests(reqs);
      } catch (err) {
        console.error("Failed to load requests:", err);
        setError("Failed to load your requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [ctxToken]);

  // Count completed requests
  const completedCount = useMemo(
    () =>
      requests.filter(
        (r) => (r.status || "").toLowerCase() === "completed"
      ).length,
    [requests]
  );

  // Map DB row → UI-friendly object
  const normalizeRequest = (row) => {
    const items = [];

    if (row.wants_wig) items.push("Wig");
    if (row.wants_headcover) items.push("Headcover");
    if (row.wants_camisole) items.push("Camisole");
    if (row.other_items) items.push(`Other: ${row.other_items}`);

    return {
      id: row.id,
      date: row.created_at || row.updated_at || new Date().toISOString(),
      status: (row.status || "unknown").toLowerCase(),
      deliveryMethod: row.delivery_method || "Not specified",
      forWhom: row.for_whom || "self",
      recipientName: row.recipient_name || null,
      relationship: row.relationship || null,
      items,
    };
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Boutique Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            View and track your boutique item requests.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-8 text-center">
            <p className="text-muted-foreground">Loading your requests...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-50 text-red-600 px-6 py-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Summary + list */}
        {!loading && !error && requests.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Total Requests */}
              <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Requests
                    </p>
                    <h3 className="text-2xl font-bold">
                      {requests.length}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Completed Requests */}
              <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed
                    </p>
                    <h3 className="text-2xl font-bold">
                      {completedCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {requests.map((raw) => {
                const req = normalizeRequest(raw);

                return (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-lg transition p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left side: details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">
                              Request #{req.id}
                            </h3>

                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(req.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              Delivery method:{" "}
                              <span className="font-medium">
                                {req.deliveryMethod}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              statusStyles[req.status] ||
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Requested Items:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {req.items.length > 0 ? (
                              req.items.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))
                            ) : (
                              <li>No specific items selected</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Right side: actions */}
                      <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
                        <button className="w-full flex items-center justify-center gap-2 border border-border/60 rounded-lg px-3 py-2 text-sm hover:bg-accent transition">
                          <Download className="w-4 h-4" />
                          Request Summary
                        </button>
                        {/* In future, if you add cancel logic, put a button here */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && requests.length === 0 && (
          <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No boutique requests yet</h3>
            <p className="text-muted-foreground">
              Your boutique requests will appear here once you submit one.
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyOrders;
