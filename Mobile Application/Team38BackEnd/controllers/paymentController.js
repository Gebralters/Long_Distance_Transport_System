// controllers/paymentController.js
const { Op } = require('sequelize'); // Import Op from Sequelize
const { Booking, PaymentDetails, Customer, Payment, BookingSlot, ParcelBooking } = require('../models');
const notificationController = require('./notificationController');

// Save Payment Details
exports.savePaymentDetails = async (req, res) => {
  try {
    const { userId, cardNumber, expiryDate, cvv, cardHolderName } = req.body;

    if (!userId || !cardNumber || !expiryDate || !cvv || !cardHolderName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const last4 = cardNumber.slice(-4);
    const paymentDetails = await PaymentDetails.create({
      PD_CARDNUMBER: cardNumber,
      PD_EXPIRYDATE: expiryDate,
      PD_CVV: cvv,
      PD_CARDHOLDERNAME: cardHolderName,
      PD_LAST4: last4,
      C_ID: customer.C_ID,
    });

    res.status(201).json({ message: 'Payment details saved successfully!', paymentDetails });
  } catch (error) {
    console.error('Error saving payment details:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Process Payment
exports.processPayment = async (req, res) => {
  try {
    const { userId, bookingId, bookingType } = req.body;

    if (!userId || !bookingId || !bookingType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const booking = await Booking.findOne({ where: { B_ID: bookingId, C_ID: customer.C_ID } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const bookingSlot = await BookingSlot.findOne({ where: { BS_ID: booking.BS_ID } });
    if (!bookingSlot) return res.status(404).json({ message: 'Booking slot not found' });

    if (bookingType === 1) {
      if (bookingSlot.BS_AVAILSEATS < booking.B_NUMBOOKING) {
        return res.status(400).json({ message: 'Not enough available seats.' });
      }

      bookingSlot.BS_AVAILSEATS -= booking.B_NUMBOOKING;
      if (bookingSlot.BS_AVAILSEATS === 0) {
        bookingSlot.BS_STATUS = 'Unavailable';
      }

      await bookingSlot.save();
    }

    const totalAmount = booking.totalPrice;

    booking.B_PAYMENTSTATUS = 'Paid';
    booking.B_STATUS = 'Confirmed';
    await booking.save();

    const payment = await Payment.create({
      PAY_AMOUNT: totalAmount,
      PAY_DATE: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      C_ID: customer.C_ID,
      B_ID: booking.B_ID,
    });

    await notificationController.notifyPaymentSuccess(booking);

    res.status(200).json({ message: 'Payment processed successfully!', booking, payment, bookingSlot });
  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch Payment Details for a User
exports.getPaymentDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const paymentDetails = await PaymentDetails.findAll({ where: { C_ID: customer.C_ID } });

    if (paymentDetails.length === 0) {
      return res.status(200).json({ message: 'No payment details found' });
    }

    res.status(200).json({ paymentDetails });
  } catch (error) {
    console.error('Error fetching payment details:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch all payments for a user
exports.getAllPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch customer details using the userId
    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Fetch all payments associated with the customer, including booking details
    const payments = await Payment.findAll({
      where: { C_ID: customer.C_ID },
      include: [
        {
          model: Booking,
          attributes: ['B_ID', 'B_PICKUPLOCATION', 'B_DESTLOCATION', 'B_DATETIME', 'totalPrice', 'B_TYPE'],
          include: [
            {
              model: ParcelBooking,
              attributes: ['P_RECIPIENTNAME', 'P_RECIPIENTCONTACT'],
            },
          ],
        },
      ],
    });

    // Format the response to include booking and parcel details
    const formattedPayments = payments.map((payment) => {
      return {
        PAY_ID: payment.PAY_ID,
        PAY_AMOUNT: payment.PAY_AMOUNT,
        PAY_DATE: payment.PAY_DATE,
        bookingId: payment.Booking.B_ID,
        pickupLocation: payment.Booking.B_PICKUPLOCATION,
        destLocation: payment.Booking.B_DESTLOCATION,
        bookingDateTime: payment.Booking.B_DATETIME,
        totalPrice: payment.Booking.totalPrice,
        bookingType: payment.Booking.B_TYPE,
        parcelDetails: payment.Booking.B_TYPE === 2 ? payment.Booking.ParcelBooking : null,
      };
    });

    res.status(200).json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Fetch pending payments for a user
exports.getPendingPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch customer details using the userId
    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Fetch all bookings that have a pending payment status for the customer
    const pendingPayments = await Booking.findAll({
      where: {
        C_ID: customer.C_ID,
        B_STATUS: 'Pending Payment', // Fetch only bookings with pending payment status
      },
      include: [
        { 
          model: Payment, // Include related payment details
        },
        { 
          model: BookingSlot, 
          where: { BS_DATETIME: { [Op.gt]: new Date() } }, // Only include future bookings
        },
        { 
          model: ParcelBooking, // Include ParcelBooking details
          as: 'ParcelBookings',  // <-- Important to match the alias used in the query
          required: false, // Allow bookings without ParcelBooking
          attributes: ['P_RECIPIENTNAME', 'P_RECIPIENTCONTACT'] // Fetch only necessary parcel details
        },
      ],
    });

    // Log for debugging
    console.log('Pending Payments:', JSON.stringify(pendingPayments, null, 2));

    // Map the response to include parcel recipient details
    const result = pendingPayments.map((booking) => {
      const parcelBooking = booking.ParcelBookings && booking.ParcelBookings.length > 0 
        ? booking.ParcelBookings[0]  // Access the first ParcelBooking if it exists
        : { P_RECIPIENTNAME: 'N/A', P_RECIPIENTCONTACT: 'N/A' };

      return {
        B_ID: booking.B_ID,
        bookingDateTime: booking.B_DATETIME,
        scheduledDateTime: booking.BookingSlot ? booking.BookingSlot.BS_DATETIME : null,
        pickupLocation: booking.B_PICKUPLOCATION,
        destLocation: booking.B_DESTLOCATION,
        totalPrice: booking.totalPrice,
        bookingType: booking.B_TYPE,
        P_RECIPIENTNAME: parcelBooking.P_RECIPIENTNAME || 'N/A',
        P_RECIPIENTCONTACT: parcelBooking.P_RECIPIENTCONTACT || 'N/A',
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Settle a Pending Payment
exports.settlePayment = async (req, res) => {
  const { paymentId } = req.body;

  try {
    const payment = await Payment.findOne({ where: { PAY_ID: paymentId } });
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    payment.PAY_DATE = new Date();
    await payment.save();

    const booking = await Booking.findOne({ where: { B_ID: payment.B_ID } });
    if (booking) {
      booking.B_STATUS = 'Confirmed';
      await booking.save();
    }

    res.status(200).json({ message: 'Payment settled successfully.' });
  } catch (error) {
    console.error('Error settling payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};