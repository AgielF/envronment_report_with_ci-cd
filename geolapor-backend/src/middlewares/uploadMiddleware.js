import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { BlobServiceClient } from '@azure/storage-blob'; // <-- SUDAH DIAKTIFKAN

// Menangkap mode penyimpanan dari environment variable (default: local)
const storageMode = process.env.STORAGE_MODE || 'local';

// ==========================================
// A. KONFIGURASI LOKAL (DISK STORAGE)
// ==========================================
const uploadDir = 'uploads/';
if (storageMode === 'local' && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `insiden-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// ==========================================
// B. KONFIGURASI CLOUD (MEMORY STORAGE)
// ==========================================
const memoryStorage = multer.memoryStorage();

// ==========================================
// C. PEMILIHAN ENGINE DINAMIS
// ==========================================
export const upload = multer({
    storage: storageMode === 'local' ? diskStorage : memoryStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});

// ==========================================
// D. MIDDLEWARE EKSEKUSI (LOKAL / AZURE)
// ==========================================
export const processCloudUpload = (req, res, next) => {
    if (!req.file) return next();

    // 1. JIKA MODE LOKAL
    if (storageMode === 'local') {
        req.file.gcsObjectName = req.file.filename; 
        return next();
    }

    // 2. JIKA MODE AZURE (SUDAH DIAKTIFKAN)
    if (storageMode === 'azure') {
        console.log("☁️ Memproses unggahan ke Azure Blob Storage...");
        const blobName = `insiden-${Date.now()}${path.extname(req.file.originalname)}`;
        
        try {
            // Membuka koneksi menggunakan Connection String dari GitHub Secrets
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
            
            // Langsung arahkan ke container 'uploads' sesuai di Portal Azure Anda
            const containerClient = blobServiceClient.getContainerClient('uploads');
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Upload buffer foto dari RAM langsung ke Azure
            blockBlobClient.uploadData(req.file.buffer).then(() => {
                req.file.gcsObjectName = blobName; // Nama file diteruskan ke controller
                next();
            }).catch(err => {
                console.error("Gagal mengunggah ke Azure:", err);
                res.status(500).json({ message: 'Gagal mengunggah gambar ke Cloud Storage' });
            });
        } catch (error) {
            console.error("Kesalahan konfigurasi Azure:", error);
            res.status(500).json({ message: 'Kesalahan pada sistem Cloud Storage' });
        }
    }
};