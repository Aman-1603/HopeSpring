import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from './components/Auth/Login';
import Register from "./components/Auth/Register";
import Dashboard from "./components/Pages/Dashboard";
import Programs from "./components/Pages/Programs";
import Book_Program from "./components/Pages/Book_program";

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/bookProgram" element={<Book_Program />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
