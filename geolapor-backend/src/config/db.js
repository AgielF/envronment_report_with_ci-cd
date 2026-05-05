import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD || ''),
    port: process.env.DB_PORT,
});

// Fungsi untuk mengecek koneksi secara aktif saat server menyala
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ DATABASE ERROR: Gagal terhubung ke PostgreSQL!');
        console.error('Pesan Error:', err.message);
    } else {
        console.log('✅ DATABASE OK: Berhasil terhubung ke PostgreSQL pada:', res.rows[0].now);
    }
});

export default pool;