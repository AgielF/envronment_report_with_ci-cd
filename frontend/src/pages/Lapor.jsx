import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../services/reportService';

const Lapor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ kategori: 'Jalan Rusak', deskripsi: '' });
  const [lokasi, setLokasi] = useState({ latitude: '', longitude: '' });
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLokasi({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert("Mohon izinkan akses lokasi (GPS) pada browser untuk mengirim laporan spasial.");
          console.error("Error GPS:", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto) return alert("Foto bukti wajib diunggah!");
    if (!lokasi.latitude) return alert("Menunggu deteksi lokasi GIS...");

    const data = new FormData();
    data.append('kategori', formData.kategori);
    data.append('deskripsi', formData.deskripsi);
    data.append('latitude', lokasi.latitude);
    data.append('longitude', lokasi.longitude);
    
    // PERBAIKAN DI SINI: Ubah 'foto_bukti' menjadi 'foto' agar sesuai dengan backend Multer
    data.append('foto', foto); 

    try {
      await createReport(data);
      alert("Laporan berhasil dikirim!");
      navigate('/');
    } catch (error) {
      alert("Gagal mengirim laporan. Pastikan server berjalan.");
      console.error(error); // Tambahan agar error-nya terlihat jelas di console jika gagal
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0_0_#000]">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b-4 border-black pb-2">Buat Laporan Spasial</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="font-bold mb-2">Kategori Insiden</label>
          <select 
            className="w-full p-4 mb-6 border-4 border-black bg-white focus:outline-none focus:bg-gray-100 font-mono text-base cursor-pointer"
            value={formData.kategori} 
            onChange={(e) => setFormData({...formData, kategori: e.target.value})}
          >
            <option value="Jalan Rusak">Jalan Rusak</option>
            <option value="Kecelakaan">Kecelakaan Lalu Lintas</option>
            <option value="Kemacetan">Kemacetan Parah</option>
          </select>

          <label className="font-bold mb-2">Deskripsi Kejadian</label>
          <textarea 
            className="w-full p-4 mb-6 border-4 border-black focus:outline-none focus:bg-gray-100 font-mono text-base resize-y" 
            rows="4" required
            value={formData.deskripsi}
            onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
          ></textarea>

          <label className="font-bold mb-2">Koordinat (Otomatis dari GPS)</label>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input type="text" className="w-full p-4 border-4 border-black bg-gray-200 cursor-not-allowed font-mono text-base" value={lokasi.latitude} readOnly placeholder="Menunggu Latitude..." />
            <input type="text" className="w-full p-4 border-4 border-black bg-gray-200 cursor-not-allowed font-mono text-base" value={lokasi.longitude} readOnly placeholder="Menunggu Longitude..." />
          </div>

          <label className="font-bold mb-2">Unggah Foto Bukti (Wajib)</label>
          <input 
            type="file" className="w-full p-3 mb-8 border-4 border-black font-mono file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-black file:text-white file:font-bold file:cursor-pointer hover:file:bg-gray-800" 
            accept="image/*" required
            onChange={(e) => setFoto(e.target.files[0])}
          />

          <button type="submit" className="bg-white text-black px-8 py-4 border-4 border-black font-bold uppercase text-lg tracking-wider shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer mt-2">
            Kirim Laporan
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lapor;