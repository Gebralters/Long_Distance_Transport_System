const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');  

router.get('/availableRides', serviceController.getAvailableRides);
router.get('/completedRides/:userId', serviceController.getCompletedRides);
router.post('/submitFeedback', serviceController.submitFeedback);
router.post('/submitReview', serviceController.submitReview);

module.exports = router;
