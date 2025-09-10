import pool from '../config/db.js';

export const createUserService = async (fname, lname, email, password) => {
    const result = await pool.query(
        'INSERT INTO users (fname, lname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [fname, lname, email, password]);
    return result.rows;
};

export const getAllUsersService = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

