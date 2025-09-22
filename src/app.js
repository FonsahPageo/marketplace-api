import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandling from './middlewares/errorHandling.js';
import { createTables } from './data/createTables.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/', userRoutes);
app.use('/', productRoutes);

// Error handling
app.use(errorHandling);

// Initialize tables
createTables();

app.get('/', async (req, res) => {
  const currentDb = await pool.query('SELECT current_database()');
  res.send(`Connected to ${currentDb.rows[0].current_database} database succesffuly`);
});

export default app;
