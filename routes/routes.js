const express = require('express');
const router = express.Router();
const { refreshAccessToken, loginUser, registerUser } = require('../controllers/authController');
const { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const valideMiddleware = require("../middleware/validateMiddleware");
orderController = require("../controllers/orderController");
const userValidationSchema = require("../validations/userValidation");
const customerValidationSchema = require("../validations/customerValidation");
const orderValidationSchema =  require("../validations/orderValidation");
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomersByUser, searchCustomer } = require('../controllers/customerController');

router.post('/auth/register', valideMiddleware(userValidationSchema), registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh-token', refreshAccessToken);

router.get('/users', authMiddleware, roleMiddleware(['admin', 'standard']), getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.get('/users/email/:email', authMiddleware, roleMiddleware(['admin']), getUserByEmail);
router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

router.get('/customers', authMiddleware, roleMiddleware(['admin']), getAllCustomers);
router.get('/customers/:id', authMiddleware, roleMiddleware(['admin']), getCustomerById);
router.post('/customers', authMiddleware, valideMiddleware(customerValidationSchema), roleMiddleware(['admin']), createCustomer);
router.put('/customers/:id', authMiddleware, roleMiddleware(['admin']), updateCustomer);
router.delete('/customers/:id', authMiddleware, roleMiddleware(['admin']), deleteCustomer);
router.get('/customers/user/:userId', authMiddleware, roleMiddleware(['admin']), getCustomersByUser);
router.get('/customers/search', authMiddleware, roleMiddleware(['admin', 'standard']), searchCustomer);

router.get('/orders',authMiddleware,roleMiddleware(['admin']), orderController.getAllOrders);
router.get('/orders/:id', authMiddleware,roleMiddleware(['admin']), orderController.getOrderById);
router.post('/orders', authMiddleware,roleMiddleware(['admin']), valideMiddleware(orderValidationSchema) ,orderController.createOrder);
router.put('/orders/:id', authMiddleware,roleMiddleware(['admin']), orderController.updateOrder);
router.delete('/orders/:id', authMiddleware,roleMiddleware(['admin']), orderController.deleteOrder);

module.exports = router;
