import express from 'express';
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers, 
    findUser,
    refreshToken,
} from '../controllers/userController.js';
import { authMiddleware, authorizeRole } from '../middlewares/authMiddleware.js';
import {validate, registerSchema, loginSchema} from '../middlewares/inputValidator.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), createUser);
router.post('/login', validate(loginSchema), loginUser, authMiddleware);

// Authenticated routes
router.post('/logout', authMiddleware, logoutUser);

// Admin-only routes
router.post('/refresh', authMiddleware, authorizeRole('admin'), refreshToken);
router.get('/users', authMiddleware, authorizeRole('admin'),getAllUsers);
router.get('/users/:identity', authMiddleware, authorizeRole('admin'), findUser);

export default router;