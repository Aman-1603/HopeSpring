import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Eye,
  X,
  Video,
  CalendarPlus,
} from "lucide-react";

const MyPrograms = ({ programs, loadingPrograms, onCancelProgram }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const hasPrograms = Array.isArray(programs) && programs.length > 0;

  const handleViewDetails = (program) => {
    if (!program) return;
    setSelectedProgram(program);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProgram(null);
  };

  const handleJoinZoom = () => {
    if (!selectedProgram?.zoomLink) return;
    window.open(selectedProgram.zoomLink, "_blank", "noopener,noreferrer");
  };

  const handleAddToGoogleCalendar = () => {
    if (!selectedProgram) return;

    const title = encodeURIComponent(
      selectedProgram.title || "HopeSpring Program"
    );
    const details = encodeURIComponent(
      `Instructor: ${selectedProgram.instructor || "N/A"}\nLocation: ${
        selectedProgram.location || "HopeSpring"
      }`
    );

    let googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;

    // Try to construct a Date from either ISO start or date + time
    let startDate = null;

    if (selectedProgram.startDateTime) {
      // if you later map a raw ISO string from backend
      startDate = new Date(selectedProgram.startDateTime);
    } else if (selectedProgram.date && selectedProgram.time) {
      // This can be flaky because date is already "12/05/2025" style,
      // but we still try.
      startDate = new Date(`${selectedProgram.date} ${selectedProgram.time}`);
    } else if (selectedProgram.date) {
      startDate = new Date(selectedProgram.date);
    }

    if (startDate && !isNaN(startDate.getTime())) {
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1h

      const formatForGoogle = (d) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const start = formatForGoogle(startDate);
      const end = formatForGoogle(endDate);

      googleUrl += `&dates=${start}/${end}`;
    }
    // ❗ IMPORTANT: even if date parsing fails, we still open the URL
    window.open(googleUrl, "_blank", "noopener,noreferrer");
  };

  const handleCancelBooking = async (program) => {
    if (!program || !program.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel "${program.title}"?`
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("hs_token");

      const res = await fetch(`/api/bookings/${program.id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (!data.success) {
        console.error("Cancel booking error:", data);
        alert(data.message || "Failed to cancel booking");
        return;
      }

      // update state in parent
      if (onCancelProgram) {
        onCancelProgram(program.id);
      }
    } catch (err) {
      console.error("Cancel booking request failed:", err);
      alert("Something went wrong cancelling this program.");
    }
  };

  // 🔹 Loading state
  if (loadingPrograms) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 animate-pulse space-y-3"
            >
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-9 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 🔹 No programs
  if (!hasPrograms) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Programs
        </h2>
        <p className="text-gray-600">You have no programs scheduled.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        My Programs
      </h2>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{program.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  program.status === "upcoming"
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {program.status || "upcoming"}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{program.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{program.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{program.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{program.location}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {/* date, time, instructor, location */}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => handleViewDetails(program)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>

              {(program.status === "upcoming" ||
                program.status === "ACCEPTED") && (
                <button
                  onClick={() => handleCancelBooking(program)}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm hover:bg-red-50 transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isDetailsOpen && selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 border border-gray-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedProgram.title}
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                selectedProgram.status === "upcoming"
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {selectedProgram.status || "upcoming"}
            </span>

            {/* Optional category/description if provided */}
            {selectedProgram.category && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {selectedProgram.category}
              </p>
            )}
            {selectedProgram.description && (
              <p className="mt-1 text-sm text-gray-600">
                {selectedProgram.description}
              </p>
            )}

            <div className="space-y-3 text-sm mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.date || "TBD"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.time || "TBD"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.instructor || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.location || "HopeSpring"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              {/* Close */}
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 w-full sm:w-auto text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>

              {/* Add to Calendar */}
              <button
                onClick={handleAddToGoogleCalendar}
                className="px-3 py-2 w-full sm:w-auto text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </button>

              {/* Join Zoom */}
              <button
                onClick={selectedProgram.zoomLink ? handleJoinZoom : undefined}
                disabled={!selectedProgram.zoomLink}
                className={`px-4 py-2 w-full sm:w-auto text-sm rounded-lg flex items-center justify-center gap-2 transition 
                  ${
                    selectedProgram.zoomLink
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <Video className="w-4 h-4" />
                Join Zoom
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyPrograms;
