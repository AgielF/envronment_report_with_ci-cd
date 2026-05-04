import React, { useState, useEffect } from 'react';
import { getMyReports } from '../services/reportService';

const Riwayat = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PERBAIKAN: Mengambil URL dari env Vite, fallback ke GCS public URL
  const CDN_BASE_URL = import.meta.env.VITE_CDN_URL || 'https://storage.googleapis.com/geolapor-storage-bucket';

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const data = await getMyReports();
        setReports(data);
      } catch (error) {
        console.error("Gagal memuat riwayat laporan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold uppercase mb-8 border-b-4 border-black inline-block pb-2">
        Riwayat Laporan Saya
      </h1>

      {loading ? (
        <p className="font-bold animate-pulse text-xl">Memuat data riwayat...</p>
      ) : reports.length === 0 ? (
        <div className="bg-[#ffeb3b] border-4 border-black p-8 shadow-[8px_8px_0_0_#000] text-center">
          <h2 className="text-xl font-bold uppercase">Belum ada laporan</h2>
          <p className="mt-2">Anda belum pernah membuat laporan insiden ruang publik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border-4 border-black p-4 flex flex-col shadow-[8px_8px_0_0_#000]">
              <div className="flex justify-between items-start mb-4 border-b-4 border-black pb-4">
                <h3 className="text-xl font-bold uppercase">{report.kategori}</h3>
                <span className={`px-3 py-1 border-2 border-black font-bold text-xs uppercase ${
                  report.status === 'menunggu_validasi' ? 'bg-yellow-300' : 
                  report.status === 'valid' ? 'bg-green-400' : 'bg-gray-300'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
              
              <p className="font-mono mb-4 flex-grow">{report.deskripsi}</p>
              
              <div className="text-sm font-mono mb-4 bg-gray-200 p-2 border-2 border-black">
                <p>Lat: {report.latitude}</p>
                <p>Lng: {report.longitude}</p>
                <p>Waktu: {new Date(report.waktu_lapor).toLocaleDateString('id-ID')}</p>
              </div>

              <img 
                // PERBAIKAN: Menghapus '/uploads/' karena file kini langsung berada di root bucket GCS/CDN[cite: 3, 4]
                src={`${CDN_BASE_URL}/${report.foto_url}`} 
                alt="Bukti Insiden" 
                className="w-full h-48 object-cover border-4 border-black"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Memuat+Gambar+CDN...'; }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Riwayat;