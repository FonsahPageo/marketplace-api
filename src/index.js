import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/', async(req, res) => {
    const currentDb = await pool.query('SELECT current_database()');
    res.send(`Connected to ${currentDb.rows[0].current_database} database succesffuly`);
})

app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
})