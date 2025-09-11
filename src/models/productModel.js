import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const createProductService = async (title, description, price, image, userId) => {
    const result = await pool.query(
        'INSERT INTO products (title, description, price, image, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, price, image, userId]);
    return result.rows[0];
};

export const getAllProductsService = async () => {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
};

export const findProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    return result.rows[0];
};

export const updateProductService = async (id, fields, userId) => {
    const setClause = Object.keys(fields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    const values = Object.values(fields);

    const result = await pool.query(`
        UPDATE products
        SET ${setClause}
        WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
        RETURNING *
        `,
        [...values, id, userId]
    );

        return result.rows[0];
};

export const deleteProductService = async (id) => {
    const result = await pool.query(
        'DELETE FROM products WHERE id=$1 RETURNING *',
        [id]);
    return result.rows[0];
};
