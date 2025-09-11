import express from 'express';
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers, 
    findUser,
    refreshToken,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', authMiddleware, loginUser);
router.post('/refresh', authMiddleware, refreshToken);
router.post('/logout', authMiddleware, logoutUser);

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:username', authMiddleware, findUser);

export default router;