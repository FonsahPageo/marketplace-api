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
        'SELECT id, firstName, lastName, username, email, role, status FROM users');
    return result.rows;
};

export const getUserByIdentityService = async (identity) => {
    const trimmed = identity.trim();
    const query = `
        SELECT id, firstName, lastName, username, email, role, password, status
        FROM users 
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1)
        LIMIT 1
        `;
    const result = await pool.query(query, [trimmed]);
    return result.rows[0] || null;
};

export const activateUserService = async (identity) => {
    const trimmed = identity.trim();
    const result = await pool.query(`
        UPDATE users 
        SET status = 'active'
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1) 
        `,
        [trimmed]
    );
    return result.rows[0] || null;
};

export const deactivateUserService = async (identity) => {
    const trimmed = identity.trim();
    const result = await pool.query(`
        UPDATE users 
        SET status = 'deactivated'
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1) 
        `,
        [trimmed]
    );
    return result.rows[0] || null;
};

export const deleteUserService = async (identity) => {
    const trimmed = identity.trim();
    const result = await pool.query(`
        DELETE FROM users 
        WHERE LOWER(username) = LOWER($1) or LOWER(email) = LOWER($1) 
        `,
        [trimmed]
    );
};

export const checkUserLoginService = async (identity) => {
    const trimmed = identity.trim();
    const result = await pool.query(`
            SELECT 1
            FROM users u
            INNER JOIN refresh_tokens r  
                ON u.id = r.user_id
            WHERE (LOWER(u.username) = LOWER($1) or LOWER(u.email) = LOWER($1)) 
                AND r.expires_at > NOW()
            LIMIT 1
        `,
        [trimmed]
    );
    return result.rowCount > 0;
};

export const listLoggedInUsersService = async () => {
    const result = await pool.query(`
        SELECT DISTINCT
            u.username
        FROM users u
        INNER JOIN refresh_tokens r
            ON u.id = r.user_id
        WHERE r.expires_at > NOW()
    `);
    return result.rows;
};