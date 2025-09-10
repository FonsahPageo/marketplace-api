import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const createUserTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            fname VARCHAR(100) NOT NULL,
            lname VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `;
    try {
        pool.query(queryText);
        console.log('Users table created successfully');
    } catch (error) {
        console.log('Error creating users table', error)
    }
};

