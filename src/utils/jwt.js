import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user) => {
    const { id, username, email, role } = user;
    const token = jwt.sign(
        { id, username, email, role },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
    return token;
};

export const generateRefreshToken = (user) => {
    const { id, username, email, role } = user;
    const token = jwt.sign(
        { id, username, email, role },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return token;
};

export const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);