import { registerSchema, loginSchema, productSchema } from '../../src/middlewares/inputValidator';

describe('Validator Schemas', () => {
    it('should validate a valid registration payload', async () => {
        const data = {
            firstName: 'john',
            lastName: 'doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
            password: 'Password@123',
        };

        await expect(registerSchema.validateAsync(data)).resolves.toBeTruthy();
    });

    it('should reject an invalid email during registration', async () => {
        const data = {
            firstName: 'john',
            lastName: 'doe',
            username: 'johndoe',
            email: 'invalid-email',
            password: 'Password@123',
        };

        await expect(registerSchema.validateAsync(data)).rejects.toThrow();
    });

    it('should validate a login with username', async () => {
        const data = {
            username: 'johndoe',
            password: 'Password@123',
        };

        await expect(loginSchema.validateAsync(data)).resolves.toBeTruthy();
    });

    it('should reject a login without username/email', async () => {
        const data = { password: 'Password@123' };

        await expect(loginSchema.validateAsync(data)).rejects.toThrow();
    });

    it('should validate a product payload', async () => {
        const data = {
            title: 'Watch',
            description: 'Silver chronograph',
            category: 'fashion',
            price: 12000,
            image: 'watch.png',
        };

        await expect(productSchema.validateAsync(data)).resolves.toBeTruthy();
    });

    it('should reject a product without a title', async () => {
        const data = {
            description: 'Silver chronograph',
            price: 12000,
            image: 'watch.png',
        };

        await expect(productSchema.validateAsync(data)).rejects.toThrow();
    });
});