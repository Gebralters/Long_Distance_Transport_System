// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

// Ride filtering and booking routes
router.get('/rides/available', rideController.filterRides);
router.post('/rides/book', rideController.bookRide);
router.post('/rides/waitlist', rideController.addToWaitlist); 
router.post('/rides/standby', rideController.placeOnStandby);

module.exports = router;
