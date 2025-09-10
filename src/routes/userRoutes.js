import express from 'express';
import { createUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.get('/users', getAllUsers);

export default router;