const express = require('express');
const router = express.Router();
const { refreshAccessToken, loginUser, registerUser } = require('../controllers/authController');
const { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const valideMiddleware  = require("../middleware/validateMiddleware"); // Doğru import şekli bu olmalı
const userValidationSchema  = require("../validation/userValidation");

router.post('/auth/register', valideMiddleware(userValidationSchema), registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh-token', refreshAccessToken);

router.get('/users', authMiddleware, roleMiddleware(['admin', 'standard']), getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.get('/users/email/:email', authMiddleware, roleMiddleware(['admin']), getUserByEmail);
router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;