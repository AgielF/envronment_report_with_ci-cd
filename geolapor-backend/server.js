import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

// Memuat environment variables dari file .env (sangat berguna untuk testing di lokal)
dotenv.config();

const app = express();
// Cloud Run akan menyuntikkan PORT dinamis (biasanya 8080), namun kita beri fallback 3000 untuk lokal
const port = process.env.PORT || 3000;

// ==============================
// 1. MIDDLEWARES GLOBAL
// ==============================
app.use(cors());
app.use(express.json()); // Memungkinkan Express membaca payload JSON dari frontend

/* 
  Catatan: 
  Konfigurasi `express.static` untuk folder lokal /uploads telah dihapus.
  Sistem sekarang menggunakan layanan Google Cloud Storage (GCS) dan Cloud CDN 
  secara penuh untuk manajemen berkas foto.
*/

// ==============================
// 2. ROUTING API
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Endpoint dasar (Health Check) - Digunakan oleh Load Balancer / Cloud Run 
// untuk memastikan container sudah berjalan dengan sehat
app.get('/', (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API Backend GeoLapor berjalan stabil",
        timestamp: new Date().toISOString()
    });
});

// ==============================
// 3. SERVER LISTENER
// ==============================
// Wajib menggunakan '0.0.0.0' agar container Docker di Cloud Run dapat terekspos ke Load Balancer
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server GeoLapor aktif di port ${port}`);
});