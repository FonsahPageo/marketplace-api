import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/db.js';

describe('Auth Flow', () => {
    let accessToken, refreshToken;

    beforeAll(async () => {
        await pool.query('TRUNCATE TABLE users CASCADE');
    })

    it('should register a new user', async () => {
        const reg = await request(app).post('/register').send({
            firstName: 'test',
            lastName: 'user',
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Password@123',
        });

        console.log('auth.test.js: Registration response body:', reg.body);

        expect(reg.statusCode).toBe(201);
        expect(reg.body.user).toHaveProperty('id');
    });

    it('should login a user and receive the tokens', async () => {
        const res = await request(app).post('/login').send({
            username: 'testuser',
            password: 'Password@123'
        });

        if (res.statusCode !== 200) {
            console.log('Login failed with:', {
                status: res.statusCode,
                body: res.body,
                headers: res.headers
            });
        };

        accessToken = res.body.accessToken || res.body.data?.accessToken || res.body.token;
        refreshToken = res.body.refreshToken || res.body.data?.refreshToken;

        expect(res.statusCode).toBe(200);
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
    });

    it('should logout the user', async () => {
        const res = await request(app)
            .post('/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ refreshToken: refreshToken });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBeDefined();
    });
});