import pool from '../config/db.js';

export const createUser = async (nama, email, hashedPassword, role = 'masyarakat') => {
    const query = `
        INSERT INTO users (nama, email, password, role) 
        VALUES ($1, $2, $3, $4) RETURNING id, nama, email, role
    `;
    const result = await pool.query(query, [nama, email, hashedPassword, role]);
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};