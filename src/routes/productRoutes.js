import express from 'express';
import {
    createProduct,
    getAllProducts,
    findProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);

router.patch('/products/:id', updateProduct);

router.get('/products', getAllProducts);
router.get('/products/:title', findProduct);

export default router;