import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUserService = async (fname, lname, username, email, password) => {
    const saltRounds = 10;
    const hasdhedPaswword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
        'INSERT INTO users (fname, lname, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, fname, lname, username, email ',
        [fname, lname, username, email, hasdhedPaswword]);
    return result.rows[0];
};

export const getAllUsersService = async () => {
    const result = await pool.query('SELECT id, fname, lname, username, email FROM users');
    return result.rows;
};

export const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT id, fname, lname, username, email FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

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