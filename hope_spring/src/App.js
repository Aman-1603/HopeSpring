import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";    
import Newsletter from "./components/Newsletter";        

import Home from "./components/Pages/Home";
import Page from "./pages/Page";                     
//import Meditation from "./pages/Programs/Meditation";

import Register from "./components/Auth/Register";
import Dashboard from "./components/Pages/Dashboard";
import Login from "./components/Auth/Login";
import Book_Program from "./components/Pages/Book_program";
import Programs from "./components/Pages/Programs";
import LivingWithCancer from "./components/Pages/GetStarted/LivingwithCancer";
import CaregiverFamily from "./components/Pages/GetStarted/CaregiverFamily";
import ProviderPartner from "./components/Pages/GetStarted/ProviderPartner";
import GiveOrVolunteer from "./components/Pages/GetStarted/GiveOrVolunteer";
import Donate from "./components/Pages/GetInvolved/Donate";
import Resources from "./components/Pages/Resources";
import SupportGroups from "./components/Pages/GetFreeSupport/Programs/Support_group";
import MeditationProgramPage from "./components/Pages/GetFreeSupport/Programs/GentleExercise/Meditation";
import YogaProgramPage from "./components/Pages/GetFreeSupport/Programs/GentleExercise/Yoga";
import TaiChiProgramPage from "./components/Pages/GetFreeSupport/Programs/GentleExercise/TaiChi";
import QiGongProgramPage from "./components/Pages/GetFreeSupport/Programs/GentleExercise/QiGong";
import ChildrenYouthFamilyPage from "./components/Pages/GetFreeSupport/Programs/Child_Youth_Family";
import ChemoBrainProgramPage from "./components/Pages/GetFreeSupport/Programs/Coping/ChemoBrain";
import JoyfulArtPracticePage from "./components/Pages/GetFreeSupport/Programs/ArtandCreativity/Joyful_Art_Practice";
import JoyfulArtSkillsTechniquesPage from "./components/Pages/GetFreeSupport/Programs/ArtandCreativity/Joyful_Art_And_Techniques";
import MassageTherapy from "./components/Pages/GetFreeSupport/Programs/Relaxation/MassageThreapy";
import TherapeuticTouch from "./components/Pages/GetFreeSupport/Programs/Relaxation/TheraoeuticTouch";
import Reiki from "./components/Pages/GetFreeSupport/Programs/Relaxation/Reiki";
import CancerCareCounselling from "./components/Pages/GetFreeSupport/BookaService/Career_Care_Counselling";
import BecomeMember from "./components/Pages/GetInvolved/Become_A_Member";
import Volunteer from "./components/Pages/GetInvolved/Volunteer";
import Fundraising from "./components/Pages/GetInvolved/Fundraise/Fundraising";
import LifeAfterMe from "./components/Pages/GetInvolved/Fundraise/LifeAfterMe";
import LegacyGiving from "./components/Pages/GetInvolved/LegacyGiving";
import ContactUs from "./components/Pages/About/Contact";
import AboutUs from "./components/Pages/About/About";
import OurTeam from "./components/Pages/About/Team";
import BoardOfDirectors from "./components/Pages/About/BDirector";
import DonorPartners from "./components/Pages/About/Donor";
import Reports from "./components/Pages/About/Report";
import AdminDashboard from "./AdminSection/AdminDashboard";
import UsersPage from "./AdminSection/UsersPage";




export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth / misc */}
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookprogram" element={<Book_Program />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UsersPage />} />



          {/* Get Started */}
          <Route path="/get-started/living-with-cancer" element={<LivingWithCancer />}/>
          <Route path="/get-started/caregiver-family" element={<CaregiverFamily />} />
          <Route path="/get-started/provider-partner" element={<ProviderPartner />} />
          <Route path="/get-started/give-or-volunteer" element={<GiveOrVolunteer />} />

          {/* Get Free Support */}
          <Route path="/support/calendar" element={<Page title="View Calendar & Register" />} />
          <Route path="/support/programs" element={<Page title="Programs" />} />
          <Route path="/support/programs/support-groups" element={<SupportGroups/>} />
          <Route path="/support/programs/gentle-exercise/meditation" element={<MeditationProgramPage />} /> {/* real page */}
          <Route path="/support/programs/gentle-exercise/yoga" element={<YogaProgramPage />} />
          <Route path="/support/programs/gentle-exercise/tai-chi" element={<TaiChiProgramPage />} />
          <Route path="/support/programs/gentle-exercise/qi-gong" element={<QiGongProgramPage />} />
          <Route path="/support/programs/children-youth-families" element={<ChildrenYouthFamilyPage />} />
          <Route path="/support/programs/coping/chemo-brain" element={<ChemoBrainProgramPage />} />
          <Route path="/support/programs/arts-creativity/joyful-art-practice" element={<JoyfulArtPracticePage />} />
          <Route path="/support/programs/arts-creativity/joyful-art-skills" element={<JoyfulArtSkillsTechniquesPage />} />
          <Route path="/support/programs/relaxation/massage-therapy" element={<MassageTherapy />} />
          <Route path="/support/programs/relaxation/therapeutic-touch" element={<TherapeuticTouch />} />
          <Route path="/support/programs/relaxation/reiki" element={<Reiki />} />
          <Route path="/resources" element={<Resources />} />


          {/* Book a Service */}
          <Route path="/book/cancer-care-counselling" element={<CancerCareCounselling />} />
          <Route path="/book/wigs-camisoles-headcovers" element={<Page title="Wigs, Camisoles, Headcovers" />} />

          {/* Get Involved */}
          <Route path="/donate" element={<Donate />} />
          <Route path="/become-a-member" element={<BecomeMember />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/fundraise" element={<Fundraising />} />
          <Route path="/fundraise/lifeafterme" element={<LifeAfterMe />} />
          <Route path="/legacy-giving" element={<LegacyGiving />} />

          {/* About */}
          <Route path="/get-inspired" element={<Page title="Get Inspired" />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/board-of-directors" element={<BoardOfDirectors />} />
          <Route path="/donors-and-partners" element={<DonorPartners />} />
          <Route path="/reports" element={<Reports />} />

          {/* 404 */}
          <Route path="*" element={<Page title="Page Not Found" intro="Sorry, we couldn’t find that page." />} />
        </Routes>
      </main>

      <Newsletter />
      <Footer />   
    </div>
  );
}
