// src/app/App.js
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Newsletter from "../components/shared/Newsletter";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Public Pages
import Home from "../components/Pages/Home";
import Page from "../features/user/pages/Page";
import Register from "../auth/pages/Register";
import Dashboard from "../components/Pages/Dashboard";
import Login from "../auth/pages/Login";
import Book_Program from "../components/Pages/Book_program";
import Programs from "../components/Pages/Programs";
import LivingWithCancer from "../components/Pages/GetStarted/LivingwithCancer";
import CaregiverFamily from "../components/Pages/GetStarted/CaregiverFamily";
import ProviderPartner from "../components/Pages/GetStarted/ProviderPartner";
import GiveOrVolunteer from "../components/Pages/GetStarted/GiveOrVolunteer";
import Donate from "../components/Pages/GetInvolved/Donate";
import Resources from "../components/Pages/Resources";
import SupportGroups from "../components/Pages/GetFreeSupport/Programs/Support_group";
import MeditationProgramPage from "../components/Pages/GetFreeSupport/Programs/GentleExercise/Meditation";
import YogaProgramPage from "../components/Pages/GetFreeSupport/Programs/GentleExercise/Yoga";
import TaiChiProgramPage from "../components/Pages/GetFreeSupport/Programs/GentleExercise/TaiChi";
import QiGongProgramPage from "../components/Pages/GetFreeSupport/Programs/GentleExercise/QiGong";
import ChildrenYouthFamilyPage from "../components/Pages/GetFreeSupport/Programs/Child_Youth_Family";
import ChemoBrainProgramPage from "../components/Pages/GetFreeSupport/Programs/Coping/ChemoBrain";
import JoyfulArtPracticePage from "../components/Pages/GetFreeSupport/Programs/ArtandCreativity/Joyful_Art_Practice";
import JoyfulArtSkillsTechniquesPage from "../components/Pages/GetFreeSupport/Programs/ArtandCreativity/Joyful_Art_And_Techniques";
import MassageTherapy from "../components/Pages/GetFreeSupport/Programs/Relaxation/MassageThreapy";
import TherapeuticTouch from "../components/Pages/GetFreeSupport/Programs/Relaxation/TheraoeuticTouch";
import Reiki from "../components/Pages/GetFreeSupport/Programs/Relaxation/Reiki";
import CancerCareCounselling from "../components/Pages/GetFreeSupport/BookaService/Career_Care_Counselling";
import BecomeMember from "../components/Pages/GetInvolved/Become_A_Member";
import Volunteer from "../components/Pages/GetInvolved/Volunteer";
import Fundraising from "../components/Pages/GetInvolved/Fundraise/Fundraising";
import LifeAfterMe from "../components/Pages/GetInvolved/Fundraise/LifeAfterMe";
import LegacyGiving from "../components/Pages/GetInvolved/LegacyGiving";
import ContactUs from "../components/Pages/About/Contact";
import AboutUs from "../components/Pages/About/About";
import OurTeam from "../components/Pages/About/Team";
import BoardOfDirectors from "../components/Pages/About/BDirector";
import DonorPartners from "../components/Pages/About/Donor";
import Reports from "../components/Pages/About/Report";
import WigsCamisolesHeadcovers from "../components/Pages/GetFreeSupport/BookaService/WigsCamisolesHeadcovers";
import SupportCalendar from "../components/Pages/GetFreeSupport/SupportCalendar";

// Admin Section
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import UsersPage from "../features/admin/pages/UsersPage";
import ProgramManagement from "../features/admin/pages/AddProgram";
import ActiveProgramsPage from "../features/admin/pages/ActiveProgramsPage";
import AdminEventCalendar from "../features/admin/pages/AdminEventCalendar";
import AdminSettings from "../features/admin/pages/AdminSettings";
import Announcements from "../features/admin/pages/Announcements";
import DonateSuccess from "../components/Pages/DonateSuccess";
import AdminWaitlist from "../features/admin/pages/AdminWaitlist";
import AdminPendingBookings from "../features/admin/pages/AdminPendingBooking";
import AdminBoutiqueRequests from "../features/admin/pages/AdminBoutiqueRequests";


// User Section
import UserDashboard from "../features/user/pages/UserDashboard";
import Profile from "../features/user/pages/Profile";
import MyOrders from "../features/user/pages/MyOrders";
import PastSessions from "../features/user/pages/PastSessions";
import Support from "../components/Pages/Support/UsersSupport";
import AdminSupport from "../features/admin/pages/AdminSupport";
import AdminBookings from "../features/admin/pages/AdminBookingFetch";
import FaciliatorDashboard from "../features/facilitator/FacilitatorDashboard.js"
import AdminDonations from "../features/admin/pages/AdminDonation";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load logged-in user once (for dashboards etc.)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hsUser");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setLoggedInUser(parsed);
    } catch (err) {
      console.error("Failed to parse hsUser from localStorage:", err);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/bookprogram" element={<Book_Program />} />
          <Route path="/programs" element={<Programs />} />

          {/* Get Started */}
          <Route
            path="/get-started/living-with-cancer"
            element={<LivingWithCancer />}
          />
          <Route
            path="/get-started/caregiver-family"
            element={<CaregiverFamily />}
          />
          <Route
            path="/get-started/provider-partner"
            element={<ProviderPartner />}
          />
          <Route
            path="/get-started/give-or-volunteer"
            element={<GiveOrVolunteer />}
          />

          {/* Get Free Support */}
          <Route path="/support/programs" element={<Page title="Programs" />} />
          <Route
            path="/support/programs/support-groups"
            element={<SupportGroups />}
          />
          <Route
            path="/support/programs/gentle-exercise/meditation"
            element={<MeditationProgramPage />}
          />
          <Route
            path="/support/programs/gentle-exercise/yoga"
            element={<YogaProgramPage />}
          />
          <Route
            path="/support/programs/gentle-exercise/tai-chi"
            element={<TaiChiProgramPage />}
          />
          <Route
            path="/support/programs/gentle-exercise/qi-gong"
            element={<QiGongProgramPage />}
          />
          <Route
            path="/support/programs/children-youth-families"
            element={<ChildrenYouthFamilyPage />}
          />
          <Route
            path="/support/programs/coping/chemo-brain"
            element={<ChemoBrainProgramPage />}
          />
          <Route
            path="/support/programs/arts-creativity/joyful-art-practice"
            element={<JoyfulArtPracticePage />}
          />
          <Route
            path="/support/programs/arts-creativity/joyful-art-skills"
            element={<JoyfulArtSkillsTechniquesPage />}
          />
          <Route
            path="/support/programs/relaxation/massage-therapy"
            element={<MassageTherapy />}
          />
          <Route
            path="/support/programs/relaxation/therapeutic-touch"
            element={<TherapeuticTouch />}
          />
          <Route
            path="/support/programs/relaxation/reiki"
            element={<Reiki />}
          />
          <Route path="/resources" element={<Resources />} />

          {/* Book a Service */}
          <Route
            path="/book/cancer-care-counselling"
            element={<CancerCareCounselling />}
          />

          {/* Get Involved */}
          <Route path="/donate" element={<Donate />} />
          <Route path="/become-a-member" element={<BecomeMember />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/fundraise" element={<Fundraising />} />
          <Route path="/fundraise/lifeafterme" element={<LifeAfterMe />} />
          <Route path="/legacy-giving" element={<LegacyGiving />} />

          {/* About */}
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/board-of-directors" element={<BoardOfDirectors />} />
          <Route path="/donors-and-partners" element={<DonorPartners />} />
          <Route path="/reports" element={<Reports />} />

          {/* Users Support */}
          <Route path="/support" element={<Support />} />

          <Route path="/faciliator" element={<FaciliatorDashboard />} />


          {/* ===== ADMIN ROUTES ===== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

<Route
  path="/admin/AdminSupport"
  element={
    <ProtectedRoute role="admin">
      <AdminSupport />
    </ProtectedRoute>
  }
/>


          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route path="/AdminSupport" element={<AdminSupport/>} />
          <Route
            path="/admin/add-programs"
            element={
              <ProtectedRoute role="admin">
                <ProgramManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activeprogram"
            element={
              <ProtectedRoute role="admin">
                <ActiveProgramsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/EventCalendar"
            element={
              <ProtectedRoute role="admin">
                <AdminEventCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />

                    <Route
            path="/admin/waitlist"
            element={
              <ProtectedRoute role="admin">
                <AdminWaitlist />
              </ProtectedRoute>
            }
          />

        

          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute role="admin">
                <Announcements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/FetchBooking"
            element={
              <ProtectedRoute role="admin">
                <AdminBookings/>
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/donation"
            element={
              <ProtectedRoute role="admin">
               <AdminDonations/>
              </ProtectedRoute>
            }
          />

          {/* ===== User ROUTES ===== */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="member">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute role="member">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/past-sessions"
            element={
              <ProtectedRoute role="member">
                <PastSessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute role="member">
                <MyOrders />
              </ProtectedRoute>
            }
          />
          

          <Route
  path="/admin/pending-bookings"
  element={<AdminPendingBookings />}
/>

<Route
  path="/book/wigs-camisoles-headcovers"
  element={<WigsCamisolesHeadcovers />}
/>

<Route path="/support/calendar" element={<SupportCalendar />} />

<Route
  path="/admin/boutique-requests"
  element={<AdminBoutiqueRequests />}
/>



          {/* For payment success page */}
          <Route path="/donate/success" element={<DonateSuccess />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Page
                title="Page Not Found"
                intro="Sorry, we couldn’t find that page."
              />
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Newsletter />
          <Footer />
        </>
      )}
    </div>
  );
}
