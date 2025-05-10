const { Order, Customer } = require('../config/config');
const { successResponse, errorResponse } = require('../utils/utils');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: Customer, as: 'customer' }]
        });

        if (orders.length === 0) {
            return res.status(404).json(errorResponse(
                'No orders found',
                'orders_NOT_FOUND',
                'There are no orders in the database.',
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Orders retrieved successfully',
            { orders },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving orders',
            'orders_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id },
            include: [{ model: Customer, as: 'customer' }]
        });

        if (!order) {
            return res.status(404).json(errorResponse(
                'Order not found',
                'order_NOT_FOUND',
                `No order found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Order retrieved successfully',
            { order },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving order',
            'order_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const createOrder = async (req, res) => {
    const { customerId, totalAmount, status, paymentMethod, orderDetails } = req.body;

    try {
        const newOrder = await Order.create({
            customerId,
            totalAmount,
            status,
            paymentMethod,
            orderDetails
        });

        res.status(201).json(successResponse(
            'Order created successfully',
            { order: newOrder },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error creating order',
            'order_CREATION_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ where: { id: req.params.id } });

        if (!order) {
            return res.status(404).json(errorResponse(
                'Order not found',
                'order_NOT_FOUND',
                `No order found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        const { customerId, totalAmount, status, paymentMethod, orderDetails } = req.body;

        order.customerId = customerId || order.customerId;
        order.totalAmount = totalAmount || order.totalAmount;
        order.status = status || order.status;
        order.paymentMethod = paymentMethod || order.paymentMethod;
        order.orderDetails = orderDetails || order.orderDetails;

        await order.save();

        res.status(200).json(successResponse(
            'Order updated successfully',
            { order },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error updating order',
            'order_UPDATE_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ where: { id: req.params.id } });

        if (!order) {
            return res.status(404).json(errorResponse(
                'Order not found',
                'order_NOT_FOUND',
                `No order found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        await order.destroy();

        res.status(200).json(successResponse(
            'Order deleted successfully',
            { orderId: req.params.id },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error deleting order',
            'order_DELETION_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
