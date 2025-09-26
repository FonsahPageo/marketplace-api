import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandling from './middlewares/errorHandling.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/', async (req, res, next) => {
  try {
    const currentDb = await pool.query('SELECT current_database()');
    res.send(`Connected to ${currentDb.rows[0].current_database} database successfully`);
  } catch (err) {
    next(err);
  }
});

// Error handling
app.use(errorHandling);

export default app;
