import { useState } from "react";
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

const PastSessions = () => {
  const [sessions] = useState([
    {
      id: 1,
      title: "Support Group Session",
      date: "2024-01-18",
      time: "6:00 PM",
      duration: "90 minutes",
      instructor: "Dr. Emily Roberts",
      location: "Conference Room",
      attendanceStatus: "attended",
      rating: 5,
      notes: "Great session, very supportive environment",
    },
    {
      id: 2,
      title: "Yoga & Meditation",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "60 minutes",
      instructor: "Sarah Johnson",
      location: "Room 101",
      attendanceStatus: "attended",
      rating: 5,
      notes: "Relaxing and rejuvenating",
    },
    {
      id: 3,
      title: "Nutrition Workshop",
      date: "2024-01-12",
      time: "2:00 PM",
      duration: "120 minutes",
      instructor: "Chef David Martinez",
      location: "Kitchen Studio",
      attendanceStatus: "attended",
      rating: 4,
      notes: "Learned great healthy recipes",
    },
    {
      id: 4,
      title: "Art Therapy Workshop",
      date: "2024-01-10",
      time: "3:00 PM",
      duration: "90 minutes",
      instructor: "Michael Chen",
      location: "Studio A",
      attendanceStatus: "missed",
      rating: null,
      notes: null,
    },
    {
      id: 5,
      title: "Mindfulness Workshop",
      date: "2024-01-08",
      time: "11:00 AM",
      duration: "75 minutes",
      instructor: "Lisa Anderson",
      location: "Wellness Center",
      attendanceStatus: "attended",
      rating: 5,
      notes: "Very peaceful and enlightening",
    },
    {
      id: 6,
      title: "Dance Therapy",
      date: "2024-01-05",
      time: "4:00 PM",
      duration: "60 minutes",
      instructor: "Amanda Green",
      location: "Dance Studio",
      attendanceStatus: "attended",
      rating: 4,
      notes: "Fun and energizing",
    },
  ]);

  const totalSessions = sessions.length;
  const attendedSessions = sessions.filter(
    (s) => s.attendanceStatus === "attended"
  ).length;
  const attendanceRate = ((attendedSessions / totalSessions) * 100).toFixed(0);

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

      {/* Summary Stats */}
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

        {/* Attendance Rate */}
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <h3 className="text-2xl font-bold">{attendanceRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Left Section */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{session.title}</h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.attendanceStatus === "attended"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {session.attendanceStatus === "attended"
                      ? "Attended"
                      : "Missed"}
                  </span>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {session.time} • {session.duration}
                    </span>
                  </div>

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
                  <div className="space-y-2 pt-3 border-t border-border/50">
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

              {/* Rate Button */}
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

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm p-12 text-center">
          <History className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No past sessions</h3>
          <p className="text-muted-foreground">
            Your session history will appear here
          </p>
        </div>
      )}
    </div>
    </UserLayout>
  );
};

export default PastSessions;
