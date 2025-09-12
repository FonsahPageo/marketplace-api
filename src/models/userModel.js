import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUserService = async (fname, lname, username, email, password, role) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
        `INSERT INTO users (fname, lname, username, email, password, role) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, fname, lname, username, email, role`,
        [fname, lname, username, email, hashedPassword, role]);
    return result.rows[0];
};

export const getAllUsersService = async () => {
    const result = await pool.query(
        'SELECT id, fname, lname, username, email, role FROM users');
    return result.rows;
};

export const getUserByIdentity = async (identity) => {
    const trimmed = identity.trim();
    const query = `
        SELECT *
        FROM users 
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1)
        LIMIT 1
        `;
    const result = await pool.query(query, [trimmed]);
    console.log('DB Result', result.rows);
    return result.rows[0] || null;
};

export const saveRefreshToken = async (userId, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await pool.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        [userId, token, expiresAt]
    );
};

export const deleteRefreshToken = async (token) => {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};

export const findRefreshToken = async (token) => {
    const result = await pool.query(
        "SELECT * FROM refresh_tokens WHERE token = $1 and expires_at > NOW()",
        [token]
    );
    return result.rows[0];
};

export const deleteExpiredTokens = async () => {
    await pool.query("DELETE FROM refresh_tokens WHERE expires_at < NOW()");
    console.log("Expired refresh tokens cleaned up");
};