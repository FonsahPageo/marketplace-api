import {
    createUserService,
    getAllUsersService,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    getUserByIdentity
} from "../models/userModel.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../utils/jwt.js";
import bcrypt from 'bcrypt';

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

export const createUser = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return handleResponse(res, 400, 'Request body cannot be empty');
        }

        const { fname, lname, username, email, password, role } = req.body;
        if (!fname || !lname || !username || !email || !password) {
            return handleResponse(res, 400, 'Please provide the firstname, lastname, username, email, password');
        }

        const existingUser = await getUserByIdentity(username || email);
        if (existingUser) {
            return handleResponse(res, 400, 'A user already exists with that username');
        }

        const newUser = await createUserService(fname, lname, username, email, password, role);
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

        await saveRefreshToken(user.id, refreshToken);

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
    const token = req.body?.token;
    if (!token) return handleResponse(res, 400, 'Refresh token required');

    try {
        await deleteRefreshToken(token);
        handleResponse(res, 200, 'Logged out successfully');
    } catch (err) {
        next(err)
    }
};

export const refreshToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) return handleResponse(res, 400, 'Refresh token required');

    try {
        const storedToken = await findRefreshToken(token);
        if (!storedToken) return handleResponse(res, 403, 'Invalid refresh token');

        const decoded = verifyRefreshToken(token);
        const accessToken = generateAccessToken(decoded);

        handleResponse(res, 200, 'Access token refreshed', { accessToken });
    } catch (err) {
        handleResponse(res, 403, 'Invalid or expired refresh token');
    }
};
