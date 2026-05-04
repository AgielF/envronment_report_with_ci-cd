import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Resolve path untuk menyajikan folder uploads secara statis
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
// Membuat folder uploads bisa diakses publik secara statis via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routing API
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.json({ status: "OK", message: "API GeoLapor berjalan" });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server GeoLapor aktif di port ${port}`);
});