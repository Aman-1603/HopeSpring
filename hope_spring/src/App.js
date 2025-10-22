import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Meditation from "./pages/Programs/Meditation";
import Page from "./pages/Page"; // generic page template
import Register from "./components/Auth/Register"
import Dashboard from "./components/Pages/Dashboard"
import Login from "./components/Auth/Login";
import Book_Program from "./components/Pages/Book_program";
import Programs from "./components/Pages/Programs"


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="register" element={<Register />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login/>} />
          <Route path="bookprogram" element={<Book_Program/>} />
          <Route path="programs" element={<Programs/>} />




          {/* Get Started */}
          <Route path="/get-started/living-with-cancer" element={<Page title="I am living with cancer or I am a survivor" />} />
          <Route path="/get-started/caregiver-family" element={<Page title="I am a caregiver, supporter, or family member" />} />
          <Route path="/get-started/provider-partner" element={<Page title="I am a healthcare provider or community partner" />} />
          <Route path="/get-started/give-or-volunteer" element={<Page title="I want to give or volunteer" />} />

          {/* Get Free Support */}
          <Route path="/support/calendar" element={<Page title="View Calendar & Register" />} />
          <Route path="/support/programs" element={<Page title="Programs" />} />
          <Route path="/support/programs/support-groups" element={<Page title="Support Groups" />} />
          <Route path="/support/programs/gentle-exercise/meditation" element={<Page title="Meditation" />} />
          <Route path="/support/programs/gentle-exercise/yoga" element={<Page title="Yoga" />} />
          <Route path="/support/programs/gentle-exercise/tai-chi" element={<Page title="Tai Chi" />} />
          <Route path="/support/programs/gentle-exercise/qi-gong" element={<Page title="Qi Gong" />} />
          <Route path="/support/programs/children-youth-families" element={<Page title="Children / Youth / Families" />} />
          <Route path="/support/programs/coping/chemo-brain" element={<Page title="Chemo Brain" />} />
          <Route path="/support/programs/arts-creativity" element={<Page title="Arts & Creativity" />} />
          <Route path="/support/programs/arts-creativity/joyful-art-practice" element={<Page title="Joyful Art Practice" />} />
          <Route path="/support/programs/arts-creativity/joyful-art-skills" element={<Page title="Joyful Art Skills & Techniques" />} />
          <Route path="/support/programs/relaxation/massage-therapy" element={<Page title="Massage Therapy" />} />
          <Route path="/support/programs/relaxation/therapeutic-touch" element={<Page title="Therapeutic Touch" />} />
          <Route path="/support/programs/relaxation/reiki" element={<Page title="Reiki" />} />

          {/* Book a Service */}
          <Route path="/book/cancer-care-counselling" element={<Page title="Cancer Care Counselling" />} />
          <Route path="/book/wigs-camisoles-headcovers" element={<Page title="Wigs, Camisoles, Headcovers" />} />

          {/* Get Involved */}
          <Route path="/donate" element={<Page title="Donate" />} />
          <Route path="/become-a-member" element={<Page title="Become a Member" />} />
          <Route path="/volunteer" element={<Page title="Volunteer" />} />
          <Route path="/fundraise" element={<Page title="Fundraise" />} />
          <Route path="/fundraise/lifeafterme" element={<Page title="Lifeafterme" />} />
          <Route path="/legacy-giving" element={<Page title="Legacy Giving" />} />

          {/* About */}
          <Route path="/get-inspired" element={<Page title="Get Inspired" />} />
          <Route path="/contact-us" element={<Page title="Contact Us" />} />
          <Route path="/about" element={<Page title="About" />} />
          <Route path="/our-team" element={<Page title="Our Team" />} />
          <Route path="/board-of-directors" element={<Page title="Board of Directors" />} />
          <Route path="/donors-and-partners" element={<Page title="Donors & Partners" />} />
          <Route path="/reports" element={<Page title="Reports" />} />

          {/* 404 */}
          <Route path="*" element={<Page title="Page Not Found" intro="Sorry, we couldn’t find that page." />} />
          <Route path="/support/programs/gentle-exercise/meditation" element={<Meditation />} />

        </Routes>
      </main>
    </div>
  );
}
