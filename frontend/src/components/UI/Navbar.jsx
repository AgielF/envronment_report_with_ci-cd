import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 md:px-8 bg-white border-b-4 border-black">
      <div>
        <Link to="/" className="text-2xl font-bold uppercase tracking-wider hover:underline">GeoLapor</Link>
      </div>
      <div className="flex gap-4 md:gap-6 items-center font-bold">
        <Link to="/" className="nav-logo">
          Home
        </Link>
        <Link to="/peta" className="hover:underline">Peta Sebaran</Link>
        {token ? (
            <>
                <Link to="/dashboard" className="hover:underline bg-[#ffeb3b] px-2 border-2 border-black">Dashboard</Link>
                <Link to="/lapor" className="hover:underline">Lapor</Link>
                <Link to="/riwayat" className="hover:underline">Riwayat</Link>
                <button 
                onClick={handleLogout}
                className="bg-black text-white px-3 py-1 border-2 border-black hover:bg-white hover:text-black transition-all cursor-pointer uppercase text-xs shadow-[2px_2px_0_0_#888]"
                >
                Logout
                </button>
            </>
            ) : (
            <Link to="/login" className="hover:underline">Login</Link>
            )}
      </div>
    </nav>
  );
};

export default Navbar;