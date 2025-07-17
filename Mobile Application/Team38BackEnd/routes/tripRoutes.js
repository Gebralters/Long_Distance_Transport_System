const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Fetch all bookings for a user
router.get('/bookings', tripController.getBookings);

// Cancel a booking
router.post('/bookings/cancel', tripController.cancelBooking);

// Fetch completed trips for a user
router.get('/trips/completed', tripController.getCompletedTrips);

// Fetch active trips for a user (with real-time driver location)
router.get('/trips/active', tripController.getActiveTrips);

// Add feedback for a completed trip
router.post('/trips/feedback', tripController.addFeedback);

// Fetch details of a specific booking
router.get('/booking/details', tripController.getBookingDetails);

module.exports = router;
