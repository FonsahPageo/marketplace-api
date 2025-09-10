import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user) => {
    return jwt.sign(
        {id: user.id, username: user.email},
        JWT_SECRET,
        {expiresIn: '15m'}
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id, username: user.email},
        REFRESH_SECRET,
        {expiresIn: '7d'}
    );
};

export const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);