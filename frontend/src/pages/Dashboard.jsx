import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyReports } from '../services/reportService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, waiting: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data profil dari storage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    // 2. Ambil data statistik laporan dari database
    const fetchStats = async () => {
      try {
        const reports = await getMyReports();
        const waiting = reports.filter(r => r.status === 'menunggu_validasi').length;
        setStats({ total: reports.length, waiting });
      } catch (error) {
        console.error("Gagal memuat stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Info Profil */}
        <div className="md:col-span-1">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
            <div className="w-24 h-24 bg-[#ffeb3b] border-4 border-black mb-6 mx-auto flex items-center justify-center text-4xl font-bold">
              {user.nama.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold uppercase text-center border-b-4 border-black pb-4 mb-4">
              Profil Pengguna
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase font-bold text-gray-500">Nama Lengkap</p>
                <p className="font-bold text-lg">{user.nama}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-500">Email</p>
                <p className="font-bold">{user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-500">Peran Sistem</p>
                <span className="bg-black text-white px-2 py-1 text-xs uppercase">{user.role}</span>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="w-full mt-8 bg-red-500 text-white border-4 border-black p-2 font-bold uppercase hover:bg-red-600 shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Statistik & Aksi Cepat */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Header Greeting */}
          <div className="bg-[#ffeb3b] border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
            <h1 className="text-3xl font-bold uppercase">Halo, {user.nama.split(' ')[0]}!</h1>
            <p className="mt-2 font-bold">Selamat datang kembali di Dashboard GeoLapor. Pantau kontribusi spasial Anda di sini.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
              <p className="uppercase font-bold text-sm text-gray-600">Total Laporan Anda</p>
              <h3 className="text-5xl font-bold mt-2">{loading ? "..." : stats.total}</h3>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
              <p className="uppercase font-bold text-sm text-gray-600">Menunggu Validasi</p>
              <h3 className="text-5xl font-bold mt-2 text-orange-500">{loading ? "..." : stats.waiting}</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_0_#ffeb3b]">
            <h3 className="text-xl font-bold uppercase mb-4">Aksi Cepat</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/lapor" className="bg-white text-black px-6 py-3 border-2 border-white font-bold uppercase hover:bg-[#ffeb3b] transition-colors">
                Buat Laporan Baru
              </Link>
              <Link to="/riwayat" className="border-2 border-white text-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors">
                Buka Riwayat
              </Link>
              <Link to="/peta" className="border-2 border-white text-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors">
                Eksplor Peta
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;