const { Booking, Customer, RideBooking, BookingSlot, PassengerBooking, sequelize, Waitlist, Standby } = require('../models'); // Added Waitlist and Standby
const { Op } = require('sequelize');
const moment = require('moment');
const notificationController = require('./notificationController');

exports.filterRides = async (req, res) => {
  try {
    const { departureCity, destinationCity, travelDate, bookingType } = req.query;
    const formattedTravelDate = moment(travelDate).format('YYYY-MM-DD');

    const rides = await BookingSlot.findAll({
      where: {
        BS_PICKUPRADIUS: departureCity,
        BS_DESTRADIUS: destinationCity,
        BS_STATUS: {
          [Op.in]: ['Available', 'Accepted'], 
        },
        [Op.and]: sequelize.where(sequelize.fn('DATE', sequelize.col('BS_DATETIME')), formattedTravelDate),
      },
      attributes: [
        'BS_ID', 'BS_DATETIME', 'BS_PICKUPRADIUS', 'BS_DESTRADIUS',
        'BS_AVAILSEATS', 'BS_PICKUPTIME', 'BS_ARRIVALTIME',
        [bookingType == 2 ? 'BS_PARCELPRICE' : 'BS_PASSPRICE', 'BS_PRICE'],
        'BS_STATUS'
      ],
    });

    res.status(200).json(rides);
  } catch (error) {
    console.error('Error filtering rides:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.bookRide = async (req, res) => {
  try {
    const { userId, bookingSlotId, pickupLocation, destLocation, numBookings, bookingType } = req.body;

    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const bookingSlot = await BookingSlot.findOne({ where: { BS_ID: bookingSlotId } });
    if (!bookingSlot) return res.status(404).json({ message: 'Booking slot not found' });

    // Ensure that there are enough available seats or parcel slots
    if (bookingType === 1 && bookingSlot.BS_AVAILSEATS < numBookings) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    // Create the booking and associate it with the booking slot but not yet with a ride
    const booking = await Booking.create({
      B_DATETIME: new Date(),
      B_PICKUPLOCATION: pickupLocation,
      B_DESTLOCATION: destLocation,
      B_NUMBOOKING: numBookings,
      B_STATUS: 'Pending Payment',
      B_TYPE: 1, 
      C_ID: customer.C_ID,
      BS_ID: bookingSlot.BS_ID,
      RB_ID: null,
      totalPrice: bookingSlot.BS_PASSPRICE * numBookings 
    });

    // Create a corresponding entry in the PassengerBooking table
    await PassengerBooking.create({
      B_ID: booking.B_ID
    });

    // Send notification about successful ride booking
    await notificationController.notifyRideBookingConfirmation(booking);

    res.status(201).json({ bookingId: booking.B_ID });
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.addToWaitlist = async (req, res) => {
  const { userId, departureCity, destinationCity, travelDate } = req.body;
  try {
    await Waitlist.create({ U_ID: userId, WL_DEPARTURE: departureCity, WL_DESTINATION: destinationCity, WL_TRAVELDATE: travelDate });

    // Notify the user of their addition to the waitlist
    await notificationController.notifyWaitlistAddition(userId, departureCity, destinationCity, travelDate);

    res.status(201).json({ message: 'You have been added to the waitlist. We will notify you when a suitable trip is available.' });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.placeOnStandby = async (req, res) => {
  const { userId, bookingSlotId } = req.body;
  try {
    // Create standby entry
    await Standby.create({ U_ID: userId, BS_ID: bookingSlotId });
    res.status(201).json({ message: 'You have been placed on standby for this trip.' });
  } catch (error) {
    console.error('Error placing on standby:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
