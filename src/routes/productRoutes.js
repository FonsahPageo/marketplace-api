import express from 'express';
import {
    createProduct,
    getAllProducts,
    findProduct,
    updateProduct,
    deleteProduct,
    findProductByCategory
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate, productSchema } from '../middlewares/inputValidator.js';

const router = express.Router();

router.post('/create-product', validate(productSchema), authMiddleware, createProduct);
router.delete('/delete-product/:id', authMiddleware, deleteProduct);

router.patch('/update-product/:id', authMiddleware, updateProduct);

router.get('/all-products', authMiddleware, getAllProducts);
router.get('/find-product/:id', authMiddleware, findProduct);
router.get('/find-product/category/:category', authMiddleware, findProductByCategory);

export default router;