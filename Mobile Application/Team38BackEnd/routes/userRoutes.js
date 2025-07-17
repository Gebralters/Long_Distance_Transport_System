const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const customerController = require('../controllers/customerController');
const { uploadSingle } = require('../middlewares/uploadMiddleware'); // Import the correct method

// User registration and login routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Logout route
router.post('/logout', userController.logout);

// Customer profile routes
router.get('/customerProfile/:userId', customerController.getCustomerProfile);

// Route for updating customer profile with image upload
router.put('/customerProfile/:userId', uploadSingle, customerController.updateCustomerProfile);

// Profile picture upload route
router.post('/uploadProfilePicture/:userId', uploadSingle, userController.uploadProfilePicture);

module.exports = router;
