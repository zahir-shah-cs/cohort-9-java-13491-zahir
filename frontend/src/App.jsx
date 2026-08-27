import { Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home.jsx";
import ContactForm from "./pages/public/ContactForm.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import ContactList from "./pages/ContactManage/ContactList.jsx";
import Profile from "./pages/profile/Profile";

import Navbar from "./components/Navbar.jsx";
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

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
        
      </Routes>
    </>
  );
}

export default App;
