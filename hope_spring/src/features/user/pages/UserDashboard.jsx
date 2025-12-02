import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import MyPrograms from "../components/MyPrograms";
import AnnouncementsFeed from "../components/AnnouncementsFeed";
import Recommendations from "../components/Recommendations";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserLayout from "../UserLayout";
import { useAuth } from "../../../contexts/AuthContext";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if(!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  console.log("UserDashboard rendered with user:", user);

  

  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Yoga & Meditation",
      date: "2024-01-20",
      time: "10:00 AM",
      instructor: "Sarah Johnson",
      location: "Room 101",
      status: "upcoming",
      zoomLink: "https://zoom.us/j/1234567890",
    },
    {
      id: 2,
      title: "Art Therapy Workshop",
      date: "2024-01-22",
      time: "2:00 PM",
      instructor: "Michael Chen",
      location: "Studio A",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Support Group Session",
      date: "2024-01-18",
      time: "6:00 PM",
      instructor: "Dr. Emily Roberts",
      location: "Conference Room",
      status: "completed",
    },
  ]);

  const [announcements] = useState([
    {
      id: 1,
      title: "New Wellness Program Launching",
      description:
        "Join our new holistic wellness program starting next month. Limited spots available!",
      link: "/programs",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Community Fundraiser Event",
      description:
        "Help us raise funds for our community support initiatives. Every contribution counts.",
      link: null,
      date: "2024-01-12",
    },
    {
      id: 3,
      title: "Updated Support Resources",
      description:
        "We've added new meditation guides and nutrition plans to our resources library.",
      link: "/resources",
      date: "2024-01-10",
    },
  ]);

  const [recommendations] = useState([
    {
      id: 4,
      title: "Mindfulness Workshop",
      category: "Wellness",
      date: "2024-01-25",
      time: "3:00 PM",
      instructor: "Lisa Anderson",
      location: "Wellness Center",
    },
    {
      id: 5,
      title: "Cooking Class",
      category: "Nutrition",
      date: "2024-01-28",
      time: "11:00 AM",
      instructor: "Chef David Martinez",
      location: "Kitchen Studio",
    },
    {
      id: 6,
      title: "Dance Therapy",
      category: "Movement",
      date: "2024-01-30",
      time: "4:00 PM",
      instructor: "Amanda Green",
      location: "Dance Studio",
    },
  ]);

  // 🔹 New state for popup
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleBookProgram = () => {
    navigate("/programs");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔹 Called when user clicks "Add" on a recommendation card
  const handleAddRecommendationClick = (recommendation) => {
    setSelectedProgram(recommendation);
    setIsAddModalOpen(true);
  };

  // 🔹 Confirm add program from modal
  const handleConfirmAddProgram = () => {
    if (!selectedProgram) return;

    const alreadyAdded = programs.some((p) => p.id === selectedProgram.id);
    if (alreadyAdded) {
      toast.error(`"${selectedProgram.title}" is already in your programs.`);
      setIsAddModalOpen(false);
      return;
    }

    const newProgram = {
      id: selectedProgram.id,
      title: selectedProgram.title,
      date: selectedProgram.date,
      time: selectedProgram.time,
      instructor: selectedProgram.instructor,
      location: selectedProgram.location,
      status: "upcoming",
    };

    setPrograms((prev) => [...prev, newProgram]);
    toast.success(`Added "${selectedProgram.title}" to your programs!`);
    setIsAddModalOpen(false);
    setSelectedProgram(null);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedProgram(null);
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserHeader
            name={user.fullName}
            onBook={handleBookProgram}
            onLogout={handleLogout}
          />

          <div className="mt-8 space-y-8">
            <MyPrograms programs={programs} />
            <AnnouncementsFeed announcements={announcements} />
            <Recommendations
              recommendations={recommendations}
              onAdd={handleAddRecommendationClick} // 🔹 use popup handler
            />
          </div>
        </div>
      </div>

      {/* 🔹 Add Program Modal */}
      {isAddModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 border border-gray-200 animate-fadeIn">
            {/* Modal Title */}
            {/* Modal Title */}
<h2 className="text-lg font-semibold text-gray-900">
  Add Program to My Programs
</h2>


            <p className="text-sm text-gray-500 mb-4">
              Please review the details below before confirming.
            </p>

            {/* Program Details */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Title</p>
                <p className="font-medium text-gray-800">
                  {selectedProgram.title}
                </p>
              </div>

              {selectedProgram.category && (
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.category}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {selectedProgram.date}
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              {/* Cancel */}
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 w-full sm:w-auto text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              {/* Add Program */}
              <button
                onClick={handleConfirmAddProgram}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 
             bg-gradient-to-r from-indigo-500 to-indigo-400 
             text-white font-medium rounded-lg 
             hover:from-indigo-600 hover:to-indigo-500 
             transition-all shadow-sm hover:shadow-md"
              >
                Add to My Programs
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserDashboard;
