import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ContactForm from "./pages/ContactForm.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ContactList from "./pages/ContactList.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/contact/manage"
          element={
            <ProtectedRoutes>
              <ContactList />
            </ProtectedRoutes>
          }
        />

        
      </Routes>
    </>
  );
}

export default App;
