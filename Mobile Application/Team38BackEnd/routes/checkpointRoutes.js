const express = require('express');
const router = express.Router();
const checkpointController = require('../controllers/checkpointController');

// Check in at a checkpoint
router.post('/checkpoint/checkin', checkpointController.checkInCheckpoint);

// Get checkpoints for a specific ride's route
router.get('/checkpoints/:rideId', checkpointController.getCheckpointsForRide);

module.exports = router;
