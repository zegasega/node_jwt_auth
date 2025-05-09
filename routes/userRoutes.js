const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require("../middleware/auth");
const { validateUser } = require("../validation/userValidation")

router.post('/register', validateUser,userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post("/refresh-token", userController.refreshAccessToken)

module.exports = router;
