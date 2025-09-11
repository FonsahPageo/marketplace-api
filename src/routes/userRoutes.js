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
import {validate, userSchema} from '../middlewares/inputValidator.js';

const router = express.Router();

router.post('/register', validate(userSchema), createUser);
router.post('/login', validate, authMiddleware, loginUser);
router.post('/refresh', authMiddleware, refreshToken);
router.post('/logout', authMiddleware, logoutUser);

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:username', authMiddleware, findUser);

export default router;