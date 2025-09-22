import {
    createProductService,
    getAllProductsService,
    findProductById,
    findProductByCategoryService,
    updateProductService,
    deleteProductService
} from "../models/productModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createProduct = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return handleResponse(res, 400, 'Request body cannot be empty');
        }

        const { title, description, category, price, image } = req.body;
        if (!title || !category || !price || !image) {
            handleResponse(res, 400, 'Please provide the title, catgeory, price, image');
        }

        const userId = req.user.id;
        const newProduct = await createProductService(title, description, category, price, image, userId);

        handleResponse(res, 201, 'Product added successfully', {
            title: title,
            description: description,
            category: category,
            price: price,
            image: image
        });
    } catch (err) {
        next(err)
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProductsService();
        if (!products || products.length === 0) {
            handleResponse(res, 200, 'No product has been created. Create one now.', products);
        } else {
            handleResponse(res, 200, 'Products fetched successfully', products);
        }
    } catch (err) {
        next(err);
    }
};

export const findProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await findProductById(id);

        if (!product) {
            return handleResponse(res, 404, 'Product does not exist', product)
        }
        handleResponse(res, 202, `Product ${id} found`, product);
    } catch (err) {
        next(err);
    }
};

export const findProductByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const product = await findProductByCategoryService(category);

        if (!product) {
            return handleResponse(res, 404, 'Product does not exist', product)
        }
        handleResponse(res, 202, `Product ${category} found`, product);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.id;

        const existingProduct = await findProductById(id);
        if (!existingProduct) {
            handleResponse(res, 404, `Product ${req.body.title} does not exist`, existingProduct);
        }

        if (existingProduct.user_id !== userId) {
            handleResponse(res, 403, 'You are not allowed to modify this product', existingProduct);
        }

        const updatedProduct = await updateProductService(id, updates, userId);
        handleResponse(res, 200, 'Product modified successfully', updatedProduct);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        // const updates = req.body;
        const userId = req.user.id;

        const existingProduct = await findProductById(id);
        if (!existingProduct) {
            handleResponse(res, 404, `Product does not exist`, existingProduct);
        }

        if (existingProduct.user_id !== userId) {
            handleResponse(res, 403, 'You are not allowed to delete this product', existingProduct);
        }

        const deletedProduct = await deleteProductService(id, userId);
        handleResponse(res, 202, 'Product deleted successfully', deletedProduct);
    } catch (err) {
        next(err);
    }
};