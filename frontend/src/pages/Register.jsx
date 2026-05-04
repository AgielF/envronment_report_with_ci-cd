import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'masyarakat'
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Registrasi berhasil! Silakan login untuk melanjutkan.");
      navigate('/login');
    } catch (error) {
      // 1. Cek apakah error berasal dari express-validator (format array "errors")
      if (error.response?.data?.errors) {
        // Menggabungkan semua pesan error jika ada lebih dari satu
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n- ');
        alert(`Registrasi gagal karena:\n- ${errorMessages}`);
      } 
      // 2. Cek apakah error dari respon manual backend (format "message" tunggal)
      else if (error.response?.data?.message) {
        alert(`Registrasi gagal: ${error.response.data.message}`);
      } 
      // 3. Fallback jika server terputus sama sekali
      else {
        alert("Terjadi kesalahan jaringan atau server tidak merespon.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b-4 border-black pb-2 text-center">Buat Akun Baru</h2>
        
        <form onSubmit={handleRegister} className="flex flex-col">
          <label className="font-bold mb-2">Nama Lengkap</label>
          <input 
            type="text" className="w-full p-4 mb-6 border-4 border-black focus:outline-none focus:bg-[#ffeb3b] font-mono text-base transition-colors" required
            value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} 
          />

          <label className="font-bold mb-2">Email Pengguna</label>
          <input 
            type="email" className="w-full p-4 mb-6 border-4 border-black focus:outline-none focus:bg-[#ffeb3b] font-mono text-base transition-colors" required
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <label className="font-bold mb-2">Kata Sandi</label>
          <input 
            type="password" className="w-full p-4 mb-8 border-4 border-black focus:outline-none focus:bg-[#ffeb3b] font-mono text-base transition-colors" required
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <button type="submit" className="bg-black text-white px-8 py-4 border-4 border-black font-bold uppercase text-lg tracking-wider shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-6 text-center font-bold">
          Sudah punya akun? <br/>
          <Link to="/login" className="underline hover:bg-black hover:text-white px-1">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;