const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Fetch customer profile
router.get('/customerProfile/:userId', customerController.getCustomerProfile);

// Update customer profile
router.put('/customerProfile/:userId', customerController.updateCustomerProfile);

module.exports = router;
