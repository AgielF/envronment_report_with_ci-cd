import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import { BlobServiceClient } from '@azure/storage-blob'; // Siapkan ini untuk integrasi Azure nanti

// Menangkap mode penyimpanan dari environment variable (default: local)
const storageMode = process.env.STORAGE_MODE || 'local';

// ==========================================
// A. KONFIGURASI LOKAL (DISK STORAGE)
// ==========================================
const uploadDir = 'uploads/';
// Folder akan dibuat otomatis di dalam sistem Linux/Docker jika belum ada
if (storageMode === 'local' && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // PERBAIKAN: Gunakan 'file.originalname', BUKAN 'req.file.originalname'
        cb(null, `insiden-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// ==========================================
// B. KONFIGURASI CLOUD (MEMORY STORAGE)
// ==========================================
// File disimpan di RAM sementara sebelum didorong (push) ke Azure Blob Storage
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
// Nama fungsi diubah agar tidak lagi terikat pada kata "GCS"
export const processCloudUpload = (req, res, next) => {
    if (!req.file) return next();

    // 1. JIKA MODE LOKAL: Langsung teruskan nama file ke Controller
    if (storageMode === 'local') {
        // Tetap menggunakan variabel 'gcsObjectName' agar logika Controller Anda tidak perlu diubah sama sekali
        req.file.gcsObjectName = req.file.filename; 
        return next();
    }

    // 2. JIKA MODE AZURE:
    if (storageMode === 'azure') {
        console.log("☁️ Memproses unggahan ke Azure Blob Storage...");
        const blobName = `insiden-${Date.now()}${path.extname(req.file.originalname)}`;
        
        /* // ========================================================
        // TODO: KODE AZURE BLOB STORAGE (Buka komentar ini nanti)
        // ========================================================
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        // Upload buffer ke Azure
        blockBlobClient.uploadData(req.file.buffer).then(() => {
            req.file.gcsObjectName = blobName;
            next();
        }).catch(err => {
            console.error("Gagal mengunggah ke Azure:", err);
            next(err);
        });
        return; // Hentikan eksekusi di sini agar menunggu proses upload selesai
        */

        // Simulasi Bypass sementara (agar aplikasi tidak crash jika mode azure tidak sengaja dihidupkan)
        req.file.gcsObjectName = blobName;
        next();
    }
};