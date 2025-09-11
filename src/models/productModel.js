import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const createProductService = async (title, description, price, image) => {
    const result = await pool.query(
        'INSERT INTO products (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, price, image]);
    return result.rows[0];
};

export const getAllProductsService = async () => {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
};

export const findProductByTitle = async (title) => {
    const result = await pool.query('SELECT * FROM products WHERE title=$1', [title]);
    return result.rows;
};

export const updateProductService = async (id, title, description, price, image) => {
    const result = await pool.query(
        'UPDATE products SET title=$1, description=$2, price=$3, image=$4 WHERE id=$5 RETURNING *', 
        [title, description, price, image, id]);
    return result.rows[0];
};

export const deleteProductService = async (id) => {
    const result = await pool.query(
        'DELETE FROM products WHERE id=$1 RETURNING *', 
        [id]);
    return result.rows[0];
};
