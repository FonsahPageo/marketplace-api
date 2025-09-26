import {
    blacklistToken,
    deleteRefreshToken,
    validateRefreshToken,
    saveRefreshToken,
} from "../models/tokenModel.js";
import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdentity,
} from "../models/userModel.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const handleResponse = (res, status, message, data = {}) => {
    res.status(status).json({
        status,
        message,
        ...data,
    });
};

const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
};

const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const createUser = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return handleResponse(res, 400, 'Request body cannot be empty');
        }

        const { firstName, lastName, username, email, password, role } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            return handleResponse(res, 400, 'Please provide the firstname, lastname, username, email, password');
        }

        const existingUser = await getUserByIdentity(username || email);
        if (existingUser) {
            return handleResponse(res, 400, 'A user already exists with that username');
        }

        const newUser = await createUserService(firstName, lastName, username, email, password, role);
        handleResponse(res, 201, 'User created successfully', {
            user: sanitizeUser(newUser),
        });
    } catch (err) {
        if (err.code == '23505') {
            if (err.detail.includes('email')) {
                return handleResponse(res, 400, 'A user with that email already exists');
            }
            if (err.detail.includes('username')) {
                return handleResponse(res, 400, 'A user with that username already exists');
            }
        }
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        const sanitizedUsers = users.map(sanitizeUser);
        handleResponse(res, 200, 'Users fetched successfully', { users: sanitizedUsers });
    } catch (err) {
        next(err);
    }
};

export const findUser = async (req, res, next) => {
    try {
        const { identity } = req.params;
        const user = await getUserByIdentity(identity);

        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User found in database', { user: sanitizeUser(user) });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return handleResponse(res, 400, 'Request body cannot be empty');
        }

        const { username, email, password } = req.body;
        const identity = username || email;
        const trimmedIdentity = identity?.trim();

        if (!trimmedIdentity) {
            return handleResponse(res, 400, 'Please provide the username or email');
        }

        if (!password || password.trim() === '') {
            return handleResponse(res, 400, 'Please provide the password');
        }

        const user = await getUserByIdentity(trimmedIdentity);
        if (!user) {
            return handleResponse(res, 401, 'Invalid username or email');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 401, 'Invalid password');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const decoded = jwt.decode(refreshToken);
        if (!decoded?.exp) {
            return handleResponse(res, 500, 'Failed to generate refresh token expiration');
        }

        await saveRefreshToken(user.id, refreshToken, decoded.exp);

        handleResponse(res, 200, `Logged in as ${user.username}`, {
            user: sanitizeUser(user),
            accessToken,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const refreshToken = req.body?.refreshToken;

        if (!accessToken) {
            return handleResponse(res, 400, "Access token is required");
        }

        const decodedAccess = jwt.decode(accessToken);
        if (decodedAccess?.exp) {
            await blacklistToken(accessToken, decodedAccess.exp);
        };

        if (!refreshToken) {
            return handleResponse(res, 400, "Refresh token is required");
        } else {
            await deleteRefreshToken(refreshToken);
        }

        return handleResponse(res, 200, 'Logged out successfully');
    } catch (err) {
        next(err);
    }
};

export const regenerateRefreshToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) return handleResponse(res, 401, 'Refresh token required');

    try {
        const decoded = jwt.verify(token, REFRESH_SECRET);
        const isValid = await validateRefreshToken(decoded.id, token);

        if (!isValid) {
            return res.status(403).json({
                message: 'Invalid or rotated token'
            });
        }

        const newAccessToken = generateAccessToken(decoded);
        const newRefreshToken = generateRefreshToken(decoded);

        await deleteRefreshToken(decoded.id);
        await saveRefreshToken(decoded.id, newRefreshToken, decoded.exp);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        handleResponse(res, 403, 'Invalid or expired refresh token');
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { identity } = req.params;
        const loggedInUserId = req.user.id;
        const loggedInUserRole = req.user.role;

        const existingUser = await getUserByIdentity(identity);
        if (!existingUser) {
            return handleResponse(res, 404, 'User not found');
        }

        if ((existingUser.id !== loggedInUserId) && (loggedInUserRole !== 'admin')) {
            return handleResponse(res, 403, 'You are not allowed to delete this user!');
        }

        const deletedUser = await deleteUserService(identity);
        return handleResponse(res, 200, 'User deleted successfully', deletedUser);
    } catch (err) {
        next(err);
    }
};