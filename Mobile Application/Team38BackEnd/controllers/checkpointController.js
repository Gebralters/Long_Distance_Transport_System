const { RideCheckpoint, Customer, Ride, RouteCheckpoint } = require('../models');
const notificationController = require('./notificationController');

exports.getCheckpointsForRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOne({ where: { R_ID: rideId } });

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const checkpoints = await RouteCheckpoint.findAll({
      where: { RO_ID: ride.RO_ID },
    });

    res.status(200).json(checkpoints);
  } catch (error) {
    console.error('Error fetching checkpoints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkInCheckpoint = async (req, res) => {
  try {
    const { checkpointId, rideId, userId, customerStatus } = req.body;

    const checkpoint = await RouteCheckpoint.findOne({ where: { RC_ID: checkpointId } });
    const ride = await Ride.findOne({ where: { R_ID: rideId } });
    const customer = await Customer.findOne({ where: { U_ID: userId } });

    if (!checkpoint || !ride || !customer) {
      return res.status(404).json({ message: 'Checkpoint, Ride, or Customer not found' });
    }

    const rideCheckpoint = await RideCheckpoint.create({
      RC_ID: checkpointId,
      R_ID: rideId,
      RIC_CUSTOMERSTATUS: customerStatus,
      RIC_TIMESTAP: new Date(),
    });

/*     // Notify the customer about the checkpoint update
    await notificationController.notifyCheckpointUpdate({
      customer,
      ride,
      checkpoint
    }); */

    res.status(201).json({ message: 'Checkpoint logged successfully', rideCheckpoint });
  } catch (error) {
    console.error('Error checking in checkpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
