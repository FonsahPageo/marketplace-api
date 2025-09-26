import dotenv from 'dotenv';
import app from './app.js';
import { createTables, createDatabase } from './data/createTables.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await createDatabase();
    await createTables(); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();