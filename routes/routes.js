const express = require('express');
const router = express.Router();
const { refreshAccessToken, loginUser, registerUser } = require('../controllers/authController');
const { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser } = require('../controllers/userController');
const { createProduct, getAllProducts, getProductByID, deleteProduct, updateProduct } = require("../controllers/productController");
const { createOrder, getAllOrders, getOrderById, deleteOrderById, updateOrderById} = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const valideMiddleware = require("../middleware/validateMiddleware");
const userValidationSchema = require("../validations/userValidation");
const customerValidationSchema = require("../validations/customerValidation");
const {productSchema} = require("../validations/productValidation");
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomersByUser, searchCustomer, getCustomerOrders } = require('../controllers/customerController');

router.post('/auth/register', valideMiddleware(userValidationSchema), registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh-token', refreshAccessToken);

router.get('/users', authMiddleware, roleMiddleware(['admin', 'standard']), getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.get('/users/email/:email', authMiddleware, roleMiddleware(['admin']), getUserByEmail);
router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

router.get('/products', authMiddleware, roleMiddleware(['admin']), getAllProducts);
router.post('/products', authMiddleware, valideMiddleware(productSchema),roleMiddleware(['admin']), createProduct);
router.get('/products/:id', authMiddleware,roleMiddleware(['admin']), getProductByID);
router.delete('/products/:id', authMiddleware,roleMiddleware(['admin']), deleteProduct);
router.put('/products/:id', authMiddleware,roleMiddleware(['admin']), updateProduct);

router.post("/orders",authMiddleware,roleMiddleware(["admin"]), createOrder);
router.get("/orders",authMiddleware,roleMiddleware(["admin"]), getAllOrders);
router.get('/orders/:orderId',authMiddleware, roleMiddleware(["admin"]), getOrderById);
router.delete('/orders/:orderId',authMiddleware, roleMiddleware(["admin"]), deleteOrderById);
router.put('/orders/:orderId',authMiddleware, roleMiddleware(["admin"]), updateOrderById);

router.get("/customers/orders/:id", authMiddleware, roleMiddleware(["admin"]), getCustomerOrders);
router.get('/customers/user/:userId', authMiddleware, roleMiddleware(['admin']), getCustomersByUser);
router.get('/customers/search', authMiddleware, roleMiddleware(['admin', 'standard']), searchCustomer);
router.get('/customers', authMiddleware, roleMiddleware(['admin']), getAllCustomers);
router.get('/customers/:id', authMiddleware, roleMiddleware(['admin']), getCustomerById);
router.post('/customers', authMiddleware, valideMiddleware(customerValidationSchema), roleMiddleware(['admin']), createCustomer);
router.put('/customers/:id', authMiddleware, roleMiddleware(['admin']), updateCustomer);
router.delete('/customers/:id', authMiddleware, roleMiddleware(['admin']), deleteCustomer);



module.exports = router;
