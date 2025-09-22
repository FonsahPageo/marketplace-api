import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/db.js';

describe('Users API', () => {
  let token;

  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        firstName: 'new',
        lastName: 'user',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password@123'
      });

    console.log('user.test.js: user registration response body', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('newuser');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'newuser',
        password: 'Password@123',
      });

    token = res.body.data?.accessToken || res.body.accessToken;
    console.log('user.test.js: login response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(token).toBeDefined();
  });
});
