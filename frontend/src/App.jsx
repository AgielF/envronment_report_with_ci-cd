import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import Landing from './pages/Landing'; 
import PetaSebaran from './pages/PetaSebaran';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Lapor from './pages/Lapor';
import Riwayat from './pages/Riwayat';
import Dashboard from './pages/Dashboard';
import './assets/style.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />           {/* Halaman Utama */}
        <Route path="/peta" element={<PetaSebaran />} />   {/* Peta Sebaran Umum */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  
        <Route path="/lapor" element={<Lapor />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;