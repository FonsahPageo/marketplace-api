import express from 'express';
import {
    createProduct,
    getAllProducts,
    findProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate, productSchema } from '../middlewares/inputValidator.js';

const router = express.Router();

router.post('/products', validate(productSchema), authMiddleware, createProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

router.patch('/products/:id', authMiddleware, updateProduct);

router.get('/products', getAllProducts);
router.get('/products/:id', findProduct);

export default router;