import {
    createUserService,
    getAllUsersService,
    findUserByUsername,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken
} from "../models/userModel.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../utils/jwt.js";
import bcrypt from 'bcrypt';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createUser = async (req, res, next) => {
    const { fname, lname, username, email, password } = req.body;
    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return handleResponse(res, 400, 'A user with that username already exists in the database');
        }

        const newUser = await createUserService(fname, lname, username, email, password);
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        await saveRefreshToken(newUser.id, refreshToken);

        handleResponse(res, 201, 'User created successfully', {
            user: newUser,
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 202, 'Users fetched successfully', users);
    } catch (err) {
        next(err);
    }
};

export const findUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await findUserByUsername(username);
        handleResponse(res, 202, 'User found in database', user);
    } catch (err) {
        next(err);
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
        handleResponse(res, 403, 'Invalid or expired refrsh token');
    }
};

export const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return handleResponse(res, 401, 'Invalid Username');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return handleResponse(res, 401, 'Invalid password');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await saveRefreshToken(user.id, refreshToken);

        const { passwordHash, ...userWithoutPassword } = user;

        handleResponse(res, 200, `Logged in as ${user.username}`, {
            user: userWithoutPassword,
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