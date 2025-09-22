import pool from "../src/config/db.js";

beforeAll(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS blacklisted_tokens (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image VARCHAR(100) NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

    await pool.query('TRUNCATE TABLE users CASCADE');
    await pool.query('TRUNCATE TABLE refresh_tokens CASCADE');
    await pool.query('TRUNCATE TABLE blacklisted_tokens CASCADE');
    await pool.query('TRUNCATE TABLE products CASCADE');
});