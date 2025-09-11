import {
    createProductService,
    getAllProductsService,
    findProductByTitle,
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
    const { title, description, price, image } = req.body;
    try {
        const newProduct = await createProductService(title, description, price, image);

        handleResponse(res, 201, 'Product added successfully', {
            title: title,
            description: description,
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
        handleResponse(res, 202, 'Products fetched successfully', products);
    } catch (err) {
        next(err);
    }
};

export const findProduct = async (req, res, next) => {
    try {
        const { title } = req.params;
        const product = await findProductByTitle(title);

        if (!product) {
            return handleResponse(res, 404, 'Product does not exist')
        }
        handleResponse(res, 202, 'This is the product you are looking for', product);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, price, image } = req.body;
        const product = await updateProductService(id, title, description, price, image);

        if (!product) {
            return handleResponse(res, 404, 'Product not found');
        }

        handleResponse(res, 202, 'Product modified successfully', product);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await deleteProductService(id);

        if(!product){
            return handleResponse(res, 404, 'Product not found');
        }

        handleResponse(res, 202, 'Product deleted successfully', product);
    } catch (err) {
        next(err);
    }
};