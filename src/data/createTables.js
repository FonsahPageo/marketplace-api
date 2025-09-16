import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const createTables = async () => {
    const createUsersQuery = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            firstName VARCHAR(50) NOT NULL,
            lastName VARCHAR(50) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;

    const createBlacklistTableQuery = `
        CREATE TABLE IF NOT EXISTS blacklisted_tokens (
            id SERIAL PRIMARY KEY,
            token TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL
        )
    `;

    const createRefreshTokensQuery = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP NOT NULL
        )
    `;

    const createProductsQuery = `
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            image VARCHAR(100) NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    try {
        await pool.query(createUsersQuery);
        await pool.query(createBlacklistTableQuery);
        await pool.query(createRefreshTokensQuery);
        await pool.query(createProductsQuery);
    } catch (error) {
        console.log('Error creating tables', error);
    }
};
