import { generateAccessToken, verifyAccessToken } from "../../src/utils/jwt.js";

describe('JWT Utils', () => {
    const user = {
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin'
    };

    it('should generate and verify a token', () => {
        const token = generateAccessToken(user);
        const decoded = verifyAccessToken(token);

        expect(decoded.id).toBe(user.id);
        expect(decoded.username).toBe(user.username);
    });
});