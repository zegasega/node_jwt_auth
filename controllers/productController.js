const { Product } = require("../config/config");
const { successResponse, errorResponse } = require('../utils/utils');

const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json(errorResponse(
                'Product not found',
                'PRODUCT_NOT_FOUND',
                `No product found with ID ${id}`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Product fetched successfully',
            { product },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Internal Server Error',
            'SERVER_ERROR',
            'An unexpected error occurred while retrieving the product.',
            req.originalUrl
        ));
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json(successResponse(
            'Products fetched successfully',
            { products },
            req.originalUrl
        ));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse(
            'Failed to fetch products',
            'GET_PRODUCTS_ERROR',
            'An error occurred while retrieving the products.',
            req.originalUrl
        ));
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;

        const existProduct = await Product.findOne({ where: { name } });
        if (existProduct) {
            return res.status(400).json(errorResponse(
                'Product with this name already exists', 
                'PRODUCT_ALREADY_EXISTS', 
                'Product with this name already exists. Please use a different name or check the products.', 
                req.originalUrl
            ));
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            stock
        });

        res.status(201).json(successResponse(
            'Product created successfully',
            {
                product: {
                    id: newProduct.id,
                    name: newProduct.name,
                    price: newProduct.price,
                    description: newProduct.description,
                    stock: newProduct.stock,
                }
            },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Internal Server Error',
            'SERVER_ERROR',
            'An unexpected error occurred while creating the product.',
            req.originalUrl
        ));
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json(errorResponse(
                'Product not found',
                'PRODUCT_NOT_FOUND',
                `No product found with ID ${id}`,
                req.originalUrl
            ));
        }

        await product.update({ name, price, description, stock });

        res.status(200).json(successResponse(
            'Product updated successfully',
            { product },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Internal Server Error',
            'UPDATE_ERROR',
            'An unexpected error occurred while updating the product.',
            req.originalUrl
        ));
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json(errorResponse(
                'Product not found',
                'PRODUCT_NOT_FOUND',
                `No product found with ID ${id}`,
                req.originalUrl
            ));
        }

        await product.destroy();

        res.status(200).json(successResponse(
            'Product deleted successfully',
            null,
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Internal Server Error',
            'DELETE_ERROR',
            'An unexpected error occurred while deleting the product.',
            req.originalUrl
        ));
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductByID,
    updateProduct,
    deleteProduct
};
