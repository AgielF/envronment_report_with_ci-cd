import React, { useState, useEffect } from 'react';
import { getReports } from '../services/reportService';
import MapComponent from '../components/Map/MapComponent';

const PetaSebaran = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error("Gagal memuat peta", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold uppercase mb-6 border-b-4 border-black inline-block pb-2">
        Sebaran Laporan Insiden
      </h1>
      {loading ? <p className="font-bold animate-pulse">Memuat peta interaktif...</p> : <MapComponent dataTitik={reports} />}
    </div>
  );
};

export default PetaSebaran;