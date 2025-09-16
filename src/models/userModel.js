import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUserService = async (firstName, lastName, username, email, password, role) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
        `INSERT INTO users (firstName, lastName, username, email, password, role) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, firstName, lastName, username, email, role`,
        [firstName, lastName, username, email, hashedPassword, role]);
    return result.rows[0];
};

export const getAllUsersService = async () => {
    const result = await pool.query(
        'SELECT id, firstName, lastName, username, email, role FROM users');
    return result.rows;
};

export const getUserByIdentity = async (identity) => {
    const trimmed = identity.trim();
    const query = `
        SELECT id, firstName, lastName, username, email, role, password
        FROM users 
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1)
        LIMIT 1
        `;
    const result = await pool.query(query, [trimmed]);
    return result.rows[0] || null;
};