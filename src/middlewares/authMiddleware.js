import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Access denied. No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (err) {
        return res.status(403).json({
            status: 403,
            message: 'Invalid or expired token'
        });
    }
};

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthrized: no user data'
            });
        }
        if (req.user.role !== role) {
            return res.status(403).json({
                status: 403,
                message: 'Forbidden: Insuficient privileges',
            });
        }
        next();
    }
};