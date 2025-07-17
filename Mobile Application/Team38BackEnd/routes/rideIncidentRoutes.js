const express = require('express');
const router = express.Router();
const rideIncidentController = require('../controllers/rideIncidentController');

// Report an incident
router.post('/incident/report', rideIncidentController.reportIncident);

module.exports = router;
