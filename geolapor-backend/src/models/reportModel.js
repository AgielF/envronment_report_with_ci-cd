import pool from '../config/db.js';

export const createReport = async (userId, kategori, deskripsi, longitude, latitude, fotoUrl) => {
    const query = `
        INSERT INTO laporan_spasial (user_id, kategori, deskripsi, lokasi, foto_url, status)
        VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, 'menunggu_validasi')
        RETURNING id
    `;
    const result = await pool.query(query, [userId, kategori, deskripsi, longitude, latitude, fotoUrl]);
    return result.rows[0];
};

export const fetchAllReports = async () => {
    const query = `
        SELECT r.id, u.nama AS pelapor, r.kategori, r.deskripsi, r.foto_url, r.status, r.waktu_lapor,
               ST_X(r.lokasi) AS longitude, ST_Y(r.lokasi) AS latitude
        FROM laporan_spasial r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.waktu_lapor DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const fetchReportsByUser = async (userId) => {
    const query = `
        SELECT id, kategori, deskripsi, status, foto_url, waktu_lapor,
               ST_X(lokasi) AS longitude, ST_Y(lokasi) AS latitude
        FROM laporan_spasial
        WHERE user_id = $1
        ORDER BY waktu_lapor DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};