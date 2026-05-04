import pool from '../config/db.js';

export const createReport = async (userId, kategori, deskripsi, longitude, latitude, fotoUrl) => {
    // ST_MakePoint menerima parameter (Longitude, Latitude)
    const query = `
        INSERT INTO laporan_spasial (user_id, kategori, deskripsi, lokasi, foto_url)
        VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6)
        RETURNING id
    `;
    const result = await pool.query(query, [userId, kategori, deskripsi, longitude, latitude, fotoUrl]);
    return result.rows[0];
};

export const fetchAllReports = async () => {
    // ST_X mengambil Longitude, ST_Y mengambil Latitude dari tipe Geometry
    const query = `
        SELECT l.id, u.nama AS pelapor, l.kategori, l.deskripsi, l.foto_url, l.status, l.waktu_lapor,
               ST_X(l.lokasi::geometry) AS longitude, 
               ST_Y(l.lokasi::geometry) AS latitude
        FROM laporan_spasial l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.waktu_lapor DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const fetchReportsByUser = async (userId) => {
    const query = `
        SELECT id, kategori, deskripsi, status, foto_url, waktu_lapor,
               ST_X(lokasi::geometry) AS longitude, 
               ST_Y(lokasi::geometry) AS latitude
        FROM laporan_spasial WHERE user_id = $1
        ORDER BY waktu_lapor DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};