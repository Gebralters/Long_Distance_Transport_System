const { BookingSlot, RideBooking, ParcelBooking, Customer, Driver, Feedback, Review } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Filter available rides by date, price, pickup or destination location
exports.getAvailableRides = async (req, res) => {
  const { date, price, pickup, destination } = req.query;  // Receive filter parameters

  let filters = {
    BS_STATUS: 'Available',
    BS_DATETIME: {
      [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss'), // Only future rides
    },
  };

  // Apply filters if provided
  if (date) {
    const startOfDay = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    filters.BS_DATETIME = {
      [Op.between]: [startOfDay, endOfDay],
    };
  }
  if (price) {
    filters.BS_PASSPRICE = {
      [Op.lte]: price,
    };
  }
  if (pickup) {
    filters.BS_PICKUPRADIUS = pickup;
  }
  if (destination) {
    filters.BS_DESTRADIUS = destination;
  }

  try {
    const availableRides = await BookingSlot.findAll({
      where: filters,
      order: [['BS_DATETIME', 'ASC']],
    });

    if (availableRides.length === 0) {
      return res.status(404).json({ message: 'No available rides found matching the criteria.' });
    }

    res.status(200).json(availableRides);
  } catch (error) {
    console.error('Error fetching available rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Completed Rides for Feedback and Review
exports.getCompletedRides = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const completedRides = await RideBooking.findAll({
      where: {
        RB_STATUS: 'Completed',
        C_ID: userId,
      },
      include: [
        { model: BookingSlot, as: 'bookingSlot' },
        { model: Driver, as: 'driver' },
      ],
      order: [['RB_DATETIME', 'DESC']],
    });

    if (completedRides.length === 0) {
      return res.status(404).json({ message: 'No completed rides found for this user.' });
    }

    res.status(200).json(completedRides);
  } catch (error) {
    console.error('Error fetching completed rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit Feedback for a Completed Ride
exports.submitFeedback = async (req, res) => {
  try {
    const { rideBookingId, rating, comment, userId } = req.body;

    // Check if the ride belongs to the customer submitting feedback
    const rideBooking = await RideBooking.findOne({
      where: {
        RB_ID: rideBookingId,
        C_ID: userId,
      },
    });

    if (!rideBooking) {
      return res.status(403).json({ message: 'Unauthorized to provide feedback for this ride.' });
    }

    const feedback = await Feedback.create({
      RB_ID: rideBookingId,
      F_RATING: rating,
      F_COMMENT: comment,
      F_DATETIME: new Date(),
    });

    res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit a Review for a Driver
exports.submitReview = async (req, res) => {
  try {
    const { driverId, rating, comment, userId } = req.body;

    // Check if the customer has completed a ride with the driver before allowing a review
    const rideWithDriver = await RideBooking.findOne({
      where: {
        C_ID: userId,
        D_ID: driverId,
        RB_STATUS: 'Completed',
      },
    });

    if (!rideWithDriver) {
      return res.status(403).json({ message: 'You cannot review this driver because you haven\'t completed any rides with them.' });
    }

    const review = await Review.create({
      D_ID: driverId,
      R_RATING: rating,
      R_COMMENT: comment,
      R_DATETIME: new Date(),
    });

    res.status(201).json({ message: 'Review submitted successfully!', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
