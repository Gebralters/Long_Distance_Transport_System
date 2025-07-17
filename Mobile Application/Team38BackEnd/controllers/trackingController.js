const { DriverLocation, Ride, Driver } = require('../models');

// Helper function to calculate the time difference
const isLocationStale = (timestamp) => {
  const now = new Date();
  const locationTime = new Date(timestamp);
  const diffMinutes = Math.abs(now - locationTime) / (1000 * 60); // difference in minutes
  return diffMinutes > 5; // Assume stale if location hasn't been updated in 5 minutes
};

// Update driver's real-time location
exports.updateDriverLocation = async (req, res) => {
  try {
    const { driverId, latitude, longitude } = req.body;

    const driver = await Driver.findOne({ where: { D_ID: driverId } });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Create a new location entry to keep a history of locations
    const newLocation = await DriverLocation.create({
      D_ID: driverId,
      DL_LATITUDE: latitude,
      DL_LONGITUDE: longitude,
      DL_TIMESTAMP: new Date()
    });

    res.status(201).json({ message: 'Driver location updated', location: newLocation });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get real-time location of a driver for a ride
exports.getDriverLocation = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOne({ where: { R_ID: rideId } });

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const latestLocation = await DriverLocation.findOne({
      where: { D_ID: ride.D_ID },
      order: [['DL_TIMESTAMP', 'DESC']]
    });

    if (!latestLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if the location is stale
    const stale = isLocationStale(latestLocation.DL_TIMESTAMP);
    if (stale) {
      return res.status(200).json({
        message: 'Driver location is not updating (driver might be offline). Showing the last known location.',
        location: latestLocation,
        stale: true
      });
    }

    res.status(200).json({ location: latestLocation });
  } catch (error) {
    console.error('Error fetching driver location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the driver's route to pickup and the journey to destination
exports.getDriverRoute = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOne({ where: { R_ID: rideId } });
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Assuming there is a predefined route between the pickup and destination stored in the `ROUTE` table
    const route = await Route.findOne({ where: { RO_ID: ride.RO_ID } });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ route });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
