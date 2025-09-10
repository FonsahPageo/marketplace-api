import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const createTables = async () => {
    const createUsersQuery = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            fname VARCHAR(100) NOT NULL,
            lname VARCHAR(100) NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;

    const createRefreshTokensQuery = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    try {
        await pool.query(createUsersQuery);
        console.log('Users table created successfully');

        await pool.query(createRefreshTokensQuery);
        console.log('Refresh tokens table created successfully');
    } catch (error) {
        console.log('Error creating tables', error);
    }
};
