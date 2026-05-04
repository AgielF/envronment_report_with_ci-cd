import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user (id, role) ke request untuk dipakai di controller
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak. Hanya Admin.' });
    }
    next();
};