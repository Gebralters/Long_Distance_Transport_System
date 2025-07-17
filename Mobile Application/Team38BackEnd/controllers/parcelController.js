const {BookingSlot, ParcelBooking, ParcelCategory, Booking, Customer, ParcelDimensions, ParcelImage} = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');
const notificationController = require('./notificationController');

// Fetch available parcel rides (Updated to include 'Accepted' status)
exports.filterParcelRides = async (req, res) => {
    try {
        const { departureCity, destinationCity, travelDate } = req.query;
        const formattedTravelDate = moment(travelDate).format('YYYY-MM-DD');

        const rides = await BookingSlot.findAll({
            where: {
                BS_PICKUPRADIUS: departureCity,
                BS_DESTRADIUS: destinationCity,
                BS_STATUS: {
                    [Op.or]: ['Available', 'Accepted'], // Filter both 'Available' and 'Accepted' statuses
                },
                [Op.and]: BookingSlot.sequelize.where(BookingSlot.sequelize.fn('DATE', BookingSlot.sequelize.col('BS_DATETIME')), formattedTravelDate),
            },
        });

        if (rides.length === 0) {
            return res.status(404).json({ message: 'No available rides found for the given criteria.' });
        }

        res.status(200).json(rides.map(ride => ({
            ...ride.toJSON(),
            BS_PRICE: ride.BS_PARCELPRICE  // Return parcel price
        })));
    } catch (error) {
        console.error('Error filtering parcel rides:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Fetch parcel categories
exports.getParcelCategories = async (req, res) => {
    try {
        const categories = await ParcelCategory.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching parcel categories:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Book a parcel and handle image upload
exports.bookParcel = async (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err });
    }

    const {
      userId, bookingSlotId, pickupLocation, destLocation, categoryId, numParcels,
      recipientName, recipientContact, verificationMethod, dimensionsLength,
      dimensionsWidth, dimensionsHeight
    } = req.body;

    try {
      const customer = await Customer.findOne({ where: { U_ID: userId } });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      const bookingSlot = await BookingSlot.findOne({ where: { BS_ID: bookingSlotId } });
      if (!bookingSlot) return res.status(404).json({ message: 'Booking slot not found' });

      const category = await ParcelCategory.findOne({ where: { P_CATID: categoryId } });
      if (!category) return res.status(404).json({ message: 'Parcel category not found' });

      let parcelStatus = 'Pending';
      if (verificationMethod === 'dimensions') {
        const length = parseFloat(dimensionsLength);
        const width = parseFloat(dimensionsWidth);
        const height = parseFloat(dimensionsHeight);

        if (length > 50 || width > 50 || height > 50) {
          await notificationController.notifyParcelRejected({
            userId,
            reason: 'Dimensions exceed the maximum allowed limit of 50cm.',
          });
          return res.status(400).json({
            message: 'Parcel booking rejected: Dimensions exceed the maximum allowed limit of 50cm.',
          });
        } else {
          parcelStatus = 'Approved';
        }
      } else if (verificationMethod === 'pictures') {
        parcelStatus = 'Pending'; 
      }

      const booking = await Booking.create({
        B_DATETIME: new Date(),
        B_PICKUPLOCATION: pickupLocation,
        B_DESTLOCATION: destLocation,
        B_NUMBOOKING: numParcels,
        B_STATUS: 'Pending Payment',
        B_TYPE: 2,
        C_ID: customer.C_ID,
        BS_ID: bookingSlot.BS_ID,
        totalPrice: bookingSlot.BS_PARCELPRICE * numParcels,
      });

      const parcelBooking = await ParcelBooking.create({
        P_STATUS: parcelStatus,
        P_OTP: Math.floor(1000 + Math.random() * 9000),
        P_CATID: category.P_CATID,
        B_ID: booking.B_ID,
        P_RECIPIENTNAME: recipientName,
        P_RECIPIENTCONTACT: recipientContact,
      });

      // Handle dimension verification
      if (verificationMethod === 'dimensions') {
        await ParcelDimensions.create({
          PDI_LENGTH: dimensionsLength,
          PDI_WIDTH: dimensionsWidth,
          PDI_HEIGHT: dimensionsHeight,
          P_ID: parcelBooking.P_ID,
        });
      } 
      // Handle picture verification
      else if (verificationMethod === 'pictures') {
        const imagePromises = req.files.map((file) =>
          ParcelImage.create({
            PIMG_URLIMG: `http://localhost:8082/uploads/${file.filename}`,
            P_ID: parcelBooking.P_ID,
          })
        );
        await Promise.all(imagePromises);
      }

      res.status(201).json({ bookingId: booking.B_ID, parcelBookingId: parcelBooking.P_ID });
    } catch (error) {
      console.error('Error booking parcel:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
};
