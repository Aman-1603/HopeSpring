import { useState, useEffect, useMemo } from "react";
import UserLayout from "../UserLayout";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  MessageSquare,
  History,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const PastSessions = () => {
  const { token: ctxToken } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch past sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");

      // Token from context or localStorage (you used "hs_token" in Header)
      const storedToken =
        ctxToken || localStorage.getItem("hs_token") || localStorage.getItem("token");

      if (!storedToken) {
        setError("Login required");
        setLoading(false);
        return;
      }

      try {
        // ⬇️ CHANGE THIS URL IF YOUR ROUTE IS DIFFERENT
        const res = await fetch("/api/bookings/past", {
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
                "Failed to load past sessions. Please try again."
            );
          }
          setLoading(false);
          return;
        }

        console.log("Fetched past sessions:", data);

        // Backend might return { success, bookings: [...] } or { sessions: [...] } or just [...]
        const list =
          (Array.isArray(data) && data) ||
          data.bookings ||
          data.sessions ||
          [];

        setSessions(list);
      } catch (err) {
        console.error("Failed to load past sessions:", err);
        setError("Failed to load past sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [ctxToken]);

  // 🔹 Normalize one raw booking row into the shape the UI expects
  const normalizeSession = (row) => {
    const status = (row.attendance_status || row.status || "").toLowerCase();

    const start =
      row.session_date ||
      row.date ||
      row.start_time ||
      row.created_at ||
      new Date().toISOString();

    const title =
      row.program_title ||
      row.session_title ||
      row.title ||
      "Program session";

    const instructor =
      row.facilitator_name ||
      row.instructor_name ||
      row.leader_name ||
      row.host_name ||
      "Facilitator";

    const location =
      row.location ||
      row.room_name ||
      row.venue ||
      "HopeSpring";

    const rating =
      row.rating ||
      row.feedback_rating ||
      null;

    const notes =
      row.notes ||
      row.feedback_notes ||
      null;

    // Try to build a time/duration string
    let timeLabel = "";
    if (row.time) {
      timeLabel = row.time;
    } else if (row.start_time && row.end_time) {
      timeLabel = `${row.start_time} - ${row.end_time}`;
    }

    const duration =
      row.duration ||
      row.session_duration ||
      null;

    return {
      id: row.id || row.booking_id || row.session_id,
      title,
      date: start,
      time: timeLabel,
      duration,
      instructor,
      location,
      attendanceStatus:
        status === "attended" || status === "present"
          ? "attended"
          : status === "missed" || status === "no_show"
          ? "missed"
          : status || "unknown",
      rating,
      notes,
    };
  };

  const normalizedSessions = sessions.map(normalizeSession);

  // 🔹 Stats
  const {
    totalSessions,
    attendedSessions,
    attendanceRate,
    averageRating,
  } = useMemo(() => {
    const total = normalizedSessions.length;

    const attended = normalizedSessions.filter(
      (s) => s.attendanceStatus === "attended"
    ).length;

    const rate =
      total > 0 ? Math.round((attended / total) * 100) : 0;

    const rated = normalizedSessions.filter((s) => s.rating);
    const avg =
      rated.length > 0
        ? (
            rated.reduce((sum, s) => sum + s.rating, 0) /
            rated.length
          ).toFixed(1)
        : null;

    return {
      totalSessions: total,
      attendedSessions: attended,
      attendanceRate: rate,
      averageRating: avg,
    };
  }, [normalizedSessions]);

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Past Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Your session history and feedback
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-8 text-center">
            <p className="text-muted-foreground">Loading your past sessions...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-50 text-red-600 px-6 py-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && normalizedSessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Sessions */}
            <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <h3 className="text-2xl font-bold">{totalSessions}</h3>
                </div>
              </div>
            </div>

            {/* Attended */}
            <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attended</p>
                  <h3 className="text-2xl font-bold">{attendedSessions}</h3>
                </div>
              </div>
            </div>

            {/* Attendance Rate / Avg Rating */}
            <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Attendance Rate
                  </p>
                  <h3 className="text-2xl font-bold">
                    {attendanceRate}%
                  </h3>
                  {averageRating && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg rating: {averageRating}/5
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {!loading && !error && normalizedSessions.length > 0 && (
          <div className="space-y-4">
            {normalizedSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        {session.title}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.attendanceStatus === "attended"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {session.attendanceStatus === "attended"
                          ? "Attended"
                          : session.attendanceStatus === "missed"
                          ? "Missed"
                          : session.attendanceStatus}
                      </span>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(session.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {(session.time || session.duration) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {session.time}
                            {session.time && session.duration && " • "}
                            {session.duration}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{session.instructor}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    {session.attendanceStatus === "attended" && (
                      <div className="space-y-2 pt-3 border-top border-border/50">
                        {/* Rating */}
                        {session.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Your Rating:
                            </span>
                            {renderStars(session.rating)}
                          </div>
                        )}

                        {/* Notes */}
                        {session.notes && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm italic text-muted-foreground">
                              "{session.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rate Button (UI only for now) */}
                  {session.attendanceStatus === "attended" &&
                    !session.rating && (
                      <button className="border border-border/60 rounded-lg px-4 py-2 text-sm hover:bg-accent transition flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Rate Session
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          normalizedSessions.length === 0 && (
            <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-12 text-center">
              <History className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No past sessions</h3>
              <p className="text-muted-foreground">
                Your session history will appear here after you attend a program.
              </p>
            </div>
          )}
      </div>
    </UserLayout>
  );
};

export default PastSessions;
