import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import errorHandling from './middlewares/errorHandling.js';
import { createUserTable } from './data/createTables.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/', userRoutes);

// Error handling middleware
app.use(errorHandling);

// Create database with tables before starting server
createUserTable();

app.get('/', async (req, res) => {
    const currentDb = await pool.query('SELECT current_database()');
    res.send(`Connected to ${currentDb.rows[0].current_database} database succesffuly`);
})


app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
})