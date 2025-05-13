const { Customer, Product, Order} = require('../config/config');
const { successResponse, errorResponse } = require('../utils/utils');


const getCustomerOrders = async (req, res) => {
  const custID = req.params.id;

  try {
    const orders = await Order.findAll({
      where: {
        customerId: custID
      },
      include: [
        {
          model: Customer,
          as: 'customer', 
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'product', 
          attributes: ['name', 'price']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    if (orders.length === 0) {
      return res.status(404).json(errorResponse(
        'No orders found for this customer',
        'orders_NOT_FOUND',
        'There are no orders in the database for this customer.',
        req.originalUrl
      ));
    }

    const result = orders.map(order => {
      const totalPrice = Math.round(order.quantity * order.product.price);

      return {
        customer_id: order.customer.id,
        customer_name: order.customer.name,
        email: order.customer.email,
        product_name: order.product.name,
        quantity: order.quantity,
        price: order.product.price,
        total_price: totalPrice,
        status: order.status,
        orderDate: order.orderDate
      };
    });

    res.status(200).json(successResponse(
      'Customer orders retrieved successfully',
      { orders: result },
      req.originalUrl
    ));
    
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json(errorResponse(
      'Error retrieving customer orders',
      'orders_RETRIEVAL_FAILED',
      err.message,
      req.originalUrl
    ));
  }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();

        if (customers.length === 0) {
            return res.status(404).json(errorResponse(
                'No customers found',
                'customers_NOT_FOUND',
                'There are no customers in the database.',
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'customers retrieved successfully',
            { customers },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving customers',
            'customers_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ where: { id: req.params.id } });

        if (!customer) {
            return res.status(404).json(errorResponse(
                'Customer not found',
                'customer_NOT_FOUND',
                `No customer found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Customer retrieved successfully',
            { customer },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving customer',
            'customer_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const createCustomer = async (req, res) => {
    const { name, email, phone, createdBy } = req.body;

    try {
        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            createdBy,  
        });

        res.status(201).json(successResponse(
            'Customer created successfully',
            { customer: newCustomer },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error creating customer',
            'customer_CREATION_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const updateCustomer = async (req, res) => {
    const { name, email, phone, createdBy } = req.body;

    try {
        const customer = await Customer.findOne({ where: { id: req.params.id } });

        if (!customer) {
            return res.status(404).json(errorResponse(
                'Customer not found',
                'customer_NOT_FOUND',
                `No customer found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;
        customer.createdBy = createdBy || customer.createdBy;

        await customer.save();

        res.status(200).json(successResponse(
            'Customer updated successfully',
            { customer },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error updating customer',
            'customer_UPDATE_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ where: { id: req.params.id } });

        if (!customer) {
            return res.status(404).json(errorResponse(
                'Customer not found',
                'customer_NOT_FOUND',
                `No customer found with ID ${req.params.id}`,
                req.originalUrl
            ));
        }

        await customer.destroy();

        res.status(200).json(successResponse(
            'Customer deleted successfully',
            { customerId: req.params.id },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error deleting customer',
            'customer_DELETION_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const getCustomersByUser = async (req, res) => {
    try {
        const customers = await Customer.findAll({ where: { createdBy: req.params.userId } });

        if (customers.length === 0) {
            return res.status(404).json(errorResponse(
                'No customers found for this user',
                'customers_NOT_FOUND',
                `No customers found for user with ID ${req.params.userId}`,
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Customers retrieved successfully',
            { customers },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error retrieving customers',
            'customers_RETRIEVAL_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};

const searchCustomer = async (req, res) => {
    const { name, email } = req.query;

    try {
        const customers = await Customer.findAll({
            where: {
                name: name ? { [Op.like]: `%${name}%` } : undefined,
                email: email ? { [Op.like]: `%${email}%` } : undefined,
            },
        });

        if (customers.length === 0) {
            return res.status(404).json(errorResponse(
                'No customers found for the given criteria',
                'customers_NOT_FOUND',
                'No matching customers were found.',
                req.originalUrl
            ));
        }

        res.status(200).json(successResponse(
            'Customers retrieved successfully',
            { customers },
            req.originalUrl
        ));
    } catch (error) {
        res.status(500).json(errorResponse(
            'Error searching for customers',
            'customers_SEARCH_FAILED',
            error.message,
            req.originalUrl
        ));
    }
};
module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomersByUser,
    searchCustomer,
    getCustomerOrders
};