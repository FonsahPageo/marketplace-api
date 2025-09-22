import {
    createProductService,
    getAllProductsService,
    findProductById,
    updateProductService,
    deleteProductService
} from '../../src/models/productModel.js';

jest.mock('../../src/config/db.js', () => ({
    query: jest.fn(),
}));

import pool from '../../src/config/db.js';

describe('Product Model (Service Layer)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a product', async () => {
        const fakeProduct = {
            title: 'watch',
            description: 'Silver Linked Bracelet Watch',
            category: 'fashion',
            price: 12000,
            image: 'watch.png',
            user_id: 5,
        };

        pool.query.mockResolvedValueOnce({ rows: [fakeProduct] });

        const product = await createProductService(
            'watch',
            'Silver Linked Bracelet Watch',
            'fashion',
            12000,
            'watch.png',
            5
        );

        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO products (title, description, category, price, image, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            ['watch', 'Silver Linked Bracelet Watch', 'fashion', 12000, 'watch.png', 5]
        );
        expect(product).toEqual(fakeProduct);
    });

    it('should fetch all products', async () => {
        const fakeProducts = [{ id: 1 }, { id: 2 }];
        pool.query.mockResolvedValueOnce({ rows: fakeProducts });

        const result = await getAllProductsService();

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products');
        expect(result).toEqual(fakeProducts);
    });

    it('should fetch product by id', async () => {
        const fakeProduct = { id: 1, title: 'watch' };
        pool.query.mockResolvedValueOnce({ rows: [fakeProduct] });

        const result = await findProductById(1);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id=$1', [1]);
        expect(result).toEqual(fakeProduct);
    });

    it('should update a product', async () => {
        const updatedProduct = { id: 1, title: 'updated watch' };
        pool.query.mockResolvedValueOnce({ rows: [updatedProduct] });

        const result = await updateProductService(1, { title: 'updated watch' }, 5);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE products'),
            ['updated watch', 1, 5]
        );
        expect(result).toEqual(updatedProduct);
    });

    it('should delete a product', async () => {
        const deletedProduct = { id: 1, title: 'watch' };
        pool.query.mockResolvedValueOnce({ rows: [deletedProduct] });

        const result = await deleteProductService(1);

        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM products WHERE id=$1 RETURNING *',
            [1]
        );
        expect(result).toEqual(deletedProduct);
    });
});
