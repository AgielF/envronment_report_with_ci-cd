import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

// Memuat environment variables dari file .env untuk testing di lokal
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ==============================
// FITUR 2: Persiapan ConfigMap
// ==============================
// Kubernetes ConfigMap akan menyuntikkan nilainya sebagai Environment Variable.
// Di sisi backend NodeJS, kita cukup menangkapnya menggunakan process.env
const APP_NAME = process.env.APP_NAME || 'GeoLapor API';
const REGION_INFO = process.env.REGION_INFO || 'Lingkungan Lokal';

// ==============================
// 1. MIDDLEWARES GLOBAL
// ==============================
app.use(cors());
app.use(express.json());


if (process.env.STORAGE_MODE === 'local') {
    console.log("📁 Mode Penyimpanan Lokal aktif. Rute /uploads dibuka.");
    app.use('/uploads', express.static('uploads'));
}
// ==============================
// 2. ROUTING API
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// ==============================
// FITUR 3: Liveness & Readiness Probes
// ==============================
// Kubernetes akan memanggil endpoint ini terus-menerus untuk mengecek 
// apakah container sehat dan siap menerima traffic dari Load Balancer.
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        app_name: APP_NAME,
        region: REGION_INFO,
        message: "API Backend GeoLapor berjalan stabil dan siap.",
        timestamp: new Date().toISOString()
    });
});

// ==============================
// FITUR 1: Endpoint Khusus Stress Test (Pemicu HPA)
// ==============================
// Panggil endpoint ini via terminal saat demo rekaman evaluasi.
// Ini akan memaksa penggunaan CPU naik drastis.
app.get('/api/stress-test', (req, res) => {
    console.log("⚠️ PERINGATAN: Memulai Stress Test... Beban CPU akan naik!");
    
    let x = 0;
    // Looping dengan perhitungan matematika yang berat (Math.sqrt) 
    // agar CPU benar-benar bekerja keras, bukan sekadar perulangan kosong.
    for (let i = 0; i < 500000000; i++) {
        x += Math.sqrt(i); 
    }
    
    res.status(200).json({
        status: "OK",
        message: "Stress test selesai! Silakan cek metrik HPA di terminal.",
        computationResult: x
    });
});

// Endpoint dasar fallback
app.get('/', (req, res) => {
    res.json({ message: `Selamat datang di ${APP_NAME}` });
});

// ==============================
// 3. SERVER LISTENER
// ==============================
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server aktif di port ${port}`);
    console.log(`🌍 Sistem: ${APP_NAME} | Region: ${REGION_INFO}`);
});