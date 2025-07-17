const { RideIncident, Ride, Customer } = require('../models');
const notificationController = require('./notificationController');

exports.reportIncident = async (req, res) => {
  try {
    const { rideId, userId, description } = req.body;

    const ride = await Ride.findOne({ where: { R_ID: rideId } });
    const customer = await Customer.findOne({ where: { U_ID: userId } });

    if (!ride || !customer) {
      return res.status(404).json({ message: 'Ride or Customer not found' });
    }

    const incident = await RideIncident.create({
      R_ID: rideId,
      C_ID: customer.C_ID,
      RI_DESCRIPTION: description,
      RI_DATETIME: new Date(),
    });

    // Notify customer about the incident report
    await notificationController.notifyIncidentReport({
      customer,
      ride,
      description
    });

    res.status(201).json({ message: 'Incident reported successfully', incident });
  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
