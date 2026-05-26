import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ dataTitik }) => {
  const center = [-6.8977, 107.6335]; 
  
  // PERBAIKAN: Mengambil URL dasar murni dari Environment Variable
  const CDN_BASE_URL = import.meta.env.VITE_CDN_URL; 

  return (
    <div className="h-[500px] w-full border-4 border-black shadow-[8px_8px_0_0_#000] bg-white z-0 relative">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dataTitik.map((titik) => (
          <Marker key={titik.id} position={[titik.latitude, titik.longitude]}>
            <Popup>
              <strong className="text-lg font-bold block">{titik.kategori}</strong>
              <p className="my-2 text-sm">{titik.deskripsi}</p>
              <small className="block mb-2 font-mono">Pelapor: {titik.pelapor}</small>
              <img 
                src={`${CDN_BASE_URL}/${titik.foto_url}`} 
                alt="Bukti Laporan" 
                className="w-full border-2 border-black"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Gambar+CDN'; }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;