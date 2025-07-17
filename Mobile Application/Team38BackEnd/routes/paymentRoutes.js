const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/payment/save', paymentController.savePaymentDetails);
router.post('/payment/process', paymentController.processPayment);
router.get('/payment/details/:userId', paymentController.getPaymentDetails);

router.get('/pendingPayments/:userId', paymentController.getPendingPayments);
router.get('/payments/:userId', paymentController.getAllPayments);

module.exports = router;
