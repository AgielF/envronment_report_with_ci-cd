CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'masyarakat'
);

CREATE TABLE laporan_spasial (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    kategori VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    lokasi GEOMETRY(Point, 4326) NOT NULL,
    foto_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'menunggu_validasi',
    waktu_lapor TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);