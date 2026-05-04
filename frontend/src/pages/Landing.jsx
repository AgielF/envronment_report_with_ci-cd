import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  // Mengecek apakah pengguna sudah login
  const token = localStorage.getItem('token');

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 font-mono">
      {/* Hero Section */}
      <div className="bg-[#ffeb3b] border-4 border-black p-8 md:p-16 shadow-[12px_12px_0_0_#000] mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6 tracking-tight leading-tight">
          Pantau & Lapor <br /> Kondisi Jalanan
        </h1>
        <p className="text-lg md:text-xl font-bold mb-8 max-w-2xl mx-auto">
          Sistem informasi geografis partisipatif. Laporkan jalan rusak, kemacetan, hingga kecelakaan langsung dari titik lokasi Anda.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* Logika Redirect Dinamis */}
          <Link 
            to={token ? "/lapor" : "/login"} 
            className="bg-white text-black px-8 py-4 border-4 border-black font-bold uppercase text-xl shadow-[6px_6px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center"
          >
            Lapor Sekarang
          </Link>
          <Link 
            to="/peta" 
            className="bg-black text-white px-8 py-4 border-4 border-black font-bold uppercase text-xl shadow-[6px_6px_0_0_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center"
          >
            Lihat Peta
          </Link>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <h3 className="text-2xl font-bold uppercase border-b-4 border-black pb-2 mb-4">📍 Drop Pin Presisi</h3>
          <p>Tandai lokasi kejadian secara langsung menggunakan sistem pemetaan GPS interaktif untuk akurasi data.</p>
        </div>
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <h3 className="text-2xl font-bold uppercase border-b-4 border-black pb-2 mb-4">📸 Bukti Visual</h3>
          <p>Unggah foto kejadian secara real-time yang akan tersimpan aman dan terdistribusi via infrastruktur Cloud.</p>
        </div>
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          <h3 className="text-2xl font-bold uppercase border-b-4 border-black pb-2 mb-4">✅ Validasi Publik</h3>
          <p>Seluruh laporan dipetakan secara transparan untuk memantau sebaran titik rawan dan insiden di kota Anda.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;