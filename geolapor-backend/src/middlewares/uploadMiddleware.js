import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import path from 'path';

// Inisialisasi Google Cloud Storage
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'geolapor-storage-bucket';
const bucket = storage.bucket(bucketName);

// Simpan file di RAM sementara untuk di-stream ke GCS[cite: 4]
const multerStorage = multer.memoryStorage();

export const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB[cite: 4]
});

// Middleware untuk memindahkan file dari RAM ke Bucket GCS[cite: 4]
export const uploadToGCS = (req, res, next) => {
    if (!req.file) return next();

    const blobName = `insiden-${Date.now()}${path.extname(req.file.originalname)}`;
    const blob = bucket.file(blobName);

    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
    });

    blobStream.on('error', (err) => {
        next(err);
    });

    blobStream.on('finish', () => {
        // Nama objek inilah yang akan disimpan ke database PostgreSQL[cite: 4]
        req.file.gcsObjectName = blobName; 
        next();
    });

    blobStream.end(req.file.buffer);
};