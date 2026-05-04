import { body, validationResult } from 'express-validator';

// Middleware untuk mengecek hasil validasi
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Aturan validasi untuk Laporan
export const reportValidationRules = [
    body('kategori').notEmpty().withMessage('Kategori wajib diisi').trim().escape(),
    body('deskripsi').isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter').trim().escape(),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
];

// Aturan validasi untuk Registrasi
export const registerValidationRules = [
    body('email').isEmail().withMessage('Format email salah').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('nama').notEmpty().withMessage('Nama wajib diisi').trim().escape(),
];