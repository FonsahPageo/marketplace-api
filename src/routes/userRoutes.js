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
import {validate, userSchema} from '../middlewares/inputValidator.js';

const router = express.Router();

router.post('/register', validate(userSchema), createUser);
router.post('/login', authMiddleware, loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/refresh', authMiddleware, authorizeRole('admmin'), refreshToken);

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:username', authMiddleware, authorizeRole('admin'), findUser);

export default router;