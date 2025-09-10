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
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:username', findUser);

export default router;