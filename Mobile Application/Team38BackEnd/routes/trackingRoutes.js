const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Update driver's real-time location
router.post('/tracking/updateLocation', trackingController.updateDriverLocation);

// Get driver's real-time location for a ride
router.get('/tracking/location/:rideId', trackingController.getDriverLocation);

// Get driver's route to pickup and destination
router.get('/tracking/route/:rideId', trackingController.getDriverRoute);

module.exports = router;
