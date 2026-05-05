import pool from '../config/db.js';

export const createReport = async (userId, judul, deskripsi, longitude, latitude, fotoUrl) => {
    const query = `
        INSERT INTO reports (user_id, judul, deskripsi, longitude, latitude, foto_url, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING id
    `;
    const result = await pool.query(query, [userId, judul, deskripsi, longitude, latitude, fotoUrl]);
    return result.rows[0];
};
export const fetchAllReports = async () => {
    const query = `
        SELECT r.id, u.nama AS pelapor, r.judul, r.deskripsi, r.foto_url, r.status, r.created_at,
               r.longitude, r.latitude
        FROM reports r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const fetchReportsByUser = async (userId) => {
    const query = `
        SELECT id, judul, deskripsi, status, foto_url, created_at,
               longitude, latitude
        FROM reports
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};