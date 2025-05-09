const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require("../middleware/auth");
const { validateUser } = require("../validation/userValidation")

router.post('/register', validateUser,userController.registerUser);
router.post('/login', userController.loginUser);
router.post("/auth", userController.refreshAccessToken)

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/country', authMiddleware, userController.getByCountry);
router.post('/age', authMiddleware, userController.getByAge);

module.exports = router;
