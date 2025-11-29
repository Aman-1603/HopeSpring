import { useState } from "react";
import { Calendar, Clock, MapPin, User, Eye, X, Video, CalendarPlus } from "lucide-react";

const MyPrograms = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (program) => {
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

    const title = encodeURIComponent(selectedProgram.title);
    const details = encodeURIComponent(
      `Instructor: ${selectedProgram.instructor}\nLocation: ${selectedProgram.location}`
    );

    const dateObj = new Date(selectedProgram.date + " " + selectedProgram.time);
    const start = dateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = new Date(dateObj.getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;

    window.open(googleUrl, "_blank", "noopener,noreferrer");
  };

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
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  program.status === "upcoming"
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {program.status}
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

            <button
              onClick={() => handleViewDetails(program)}
              className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
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
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedProgram.status === "upcoming"
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {selectedProgram.status}
            </span>

            <div className="space-y-3 text-sm mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedProgram.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.time}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.instructor}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.location}
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

              {/* Small Google Calendar Button */}
              <button
                onClick={handleAddToGoogleCalendar}
                className="px-3 py-2 w-full sm:w-auto text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </button>

              {/* Blue Active Zoom Button */}
              <button
                onClick={selectedProgram.zoomLink ? handleJoinZoom : null}
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
