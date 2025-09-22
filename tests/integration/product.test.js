import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/db.js';

describe('Products API', () => {
    let token;

    beforeAll(async () => {
        await pool.query('TRUNCATE TABLE products CASCADE');
        await pool.query('TRUNCATE TABLE users CASCADE');

        await request(app)
            .post('/register')
            .send({
                firstName: 'product',
                lastName: 'owner',
                username: 'productowner',
                email: 'productowner@example.com',
                password: 'Password@123',
            });

        const login = await request(app)
            .post('/login')
            .send({
                username: 'productowner',
                password: 'Password@123'
            });

        console.log('product.test.js: login response', login.body);

        token = login.body.data?.accessToken || login.body.accessToken;
    });

    it('should create a product', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'watch',
                description: 'Silver Linked Bracelet...',
                category: 'fashion',
                price: 12000,
                image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg'
            });

        console.log('Product creation response:', {
            status: res.statusCode,
            body: res.body,
            headers: res.headers
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('title');
    });

    it('should list products', async () => {
        const res = await request(app).get('/products');
        expect(res.statusCode).toBe(200);
    });
});
