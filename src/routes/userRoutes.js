import express from 'express';
import {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers, 
    findUser,
    regenerateRefreshToken,
    deleteUser,
} from '../controllers/userController.js';
import { authMiddleware, authorizeRole } from '../middlewares/authMiddleware.js';
import {validate, registerSchema, loginSchema} from '../middlewares/inputValidator.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), createUser);
router.post('/login', validate(loginSchema), loginUser, authMiddleware);
router.post('/logout', logoutUser);

// Admin-only routes
router.post('/refresh', authMiddleware, authorizeRole('admin'), regenerateRefreshToken);
router.get('/all-users', authMiddleware, authorizeRole('admin'),getAllUsers);
router.get('/find-user/:identity', authMiddleware, authorizeRole('admin'), findUser);
router.delete('/delete-user/:identity', authMiddleware, deleteUser);

export default router;