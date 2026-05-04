import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan Link di sini
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      alert("Login gagal. Periksa email dan password.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b-4 border-black pb-2 text-center">Otentikasi Sistem</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="font-bold mb-2">Email Pengguna</label>
          <input 
            type="email" className="w-full p-4 mb-6 border-4 border-black focus:outline-none focus:bg-[#ffeb3b] font-mono text-base transition-colors" required
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
          
          <label className="font-bold mb-2">Kata Sandi</label>
          <input 
            type="password" className="w-full p-4 mb-8 border-4 border-black focus:outline-none focus:bg-[#ffeb3b] font-mono text-base transition-colors" required
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />
          
          <button type="submit" className="bg-white text-black px-8 py-4 border-4 border-black font-bold uppercase text-lg tracking-wider shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer mt-2">
            Akses Masuk
          </button>
        </form>

        {/* Tautan ke halaman Register */}
        <p className="mt-8 text-center font-bold border-t-4 border-black pt-6">
          Belum punya akun? <br/>
          <Link to="/register" className="underline hover:bg-black hover:text-white px-1 mt-2 inline-block transition-colors">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;