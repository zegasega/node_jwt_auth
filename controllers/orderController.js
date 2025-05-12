const { where } = require("sequelize");
const { Order, Product, Customer } = require("../config/config");
const { successResponse, errorResponse } = require('../utils/utils');


const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;  
        const order = await Order.findByPk(orderId, {
        });
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found',
                errorCode: 'order_NOT_FOUND',
                errorMessage: `No order found with ID ${orderId}`,
                url: req.originalUrl
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Order retrieved successfully',
            data: { order },
            url: req.originalUrl
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the order',
            errorCode: 'order_RETRIEVAL_FAILED',
            errorMessage: error.message,
            url: req.originalUrl
        });
    }
};


const createOrder = async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json(errorResponse(
        'Customer not found',
        'customer_NOT_FOUND',
        `No customer found with ID ${customerId}`,
        req.originalUrl
      ));
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json(errorResponse(
        'Product not found',
        'product_NOT_FOUND',
        `No product found with ID ${productId}`,
        req.originalUrl
      ));
    }

    if (product.stock < quantity) {
      return res.status(400).json(errorResponse(
        'Insufficient stock for this product',
        'insufficient_stock',
        `Only ${product.stock} units of product ${productId} available.`,
        req.originalUrl
      ));
    }

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      customerId,
      productId,
      quantity,
      totalPrice,
      status: 'pending',
    });

    product.stock -= quantity;
    await product.save();

    return res.status(201).json(successResponse(
      'Order created successfully',
      { order },
      req.originalUrl
    ));

  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse(
      'An error occurred while creating the order',
      'order_CREATION_FAILED',
      error.message,
      req.originalUrl
    ));
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
        }
      ]
    });

    if (orders.length === 0) {
      return res.status(404).json(errorResponse(
        'No orders found',
        'orders_NOT_FOUND',
        'There are no orders in the system.',
        req.originalUrl
      ));
    }

    return res.status(200).json(successResponse(
      'Orders fetched successfully',
      { orders },
      req.originalUrl
    ));

  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse(
      'An error occurred while fetching orders',
      'orders_FETCH_FAILED',
      error.message,
      req.originalUrl
    ));
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrderById };
