const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Define your routes here
router.get('/faqs', faqController.getAllFAQs);
router.get('/faqs/category/:id', faqController.getFAQsByCategory);
router.get('/faqs/categories', faqController.getFAQCategories);

module.exports = router; 
