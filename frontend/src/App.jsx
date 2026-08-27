import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx"
import Navbar from './components/Navbar.jsx';
import ContactForm from './pages/ContactForm.jsx';

function App() {

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
    </>
  )
}

export default App
