const { Notification, User, Booking, Ride, ParcelBooking, Driver, Customer } = require('../models');

// Fetch notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching notifications for user ID: ${userId}`);

    const notifications = await Notification.findAll({
      where: { U_ID: userId },
      order: [['NOT_TIMESTAMP', 'DESC']]
    });
    console.log(`Notifications fetched: ${JSON.stringify(notifications)}`);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch a specific notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    console.log(`Fetching notification with ID: ${notificationId}`);

    const notification = await Notification.findOne({
      where: { NOT_ID: notificationId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    console.log(`Notification fetched: ${JSON.stringify(notification)}`);

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.count({
      where: { U_ID: userId, NOT_STATUS: 'Unread' }
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.update(
      { NOT_STATUS: 'Read' },
      { where: { NOT_ID: notificationId } }
    );
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to create a notification
exports.createNotification = async ({ userId, type, content, data }) => {
  try {
    await Notification.create({
      U_ID: userId,
      NOT_TYPE: type,
      NOT_CONTENT: content,
      NOT_DATA: data || null,
      NOT_STATUS: 'Unread',
      NOT_TIMESTAMP: new Date()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Notification Triggers

// Payment Success Notification
exports.notifyPaymentSuccess = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your payment for the ride from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION} has been successfully processed.`;
  await exports.createNotification({
    userId,
    type: 'Payment Success',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Ride Booking Confirmation
exports.notifyRideBookingConfirmation = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your ride from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION} has been successfully booked!`;
  await exports.createNotification({
    userId,
    type: 'Booking Confirmation',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Ride Cancellation
exports.notifyRideCancellation = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your ride from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION} has been canceled.`;
  await exports.createNotification({
    userId,
    type: 'Ride Cancellation',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Driver Assigned Notification
exports.notifyDriverAssigned = async (booking, driver) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `A driver has been assigned to your ride from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION}.`;
  await exports.createNotification({
    userId,
    type: 'Driver Assigned',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID, driverId: driver.D_ID })
  });
};

// Driver En Route Notification
exports.notifyDriverEnRoute = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your driver is on the way to pick you up from ${ride.Booking.B_PICKUPLOCATION}.`;
  await exports.createNotification({
    userId,
    type: 'Driver En Route',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Ride Start Notification
exports.notifyRideStart = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your ride from ${ride.Booking.B_PICKUPLOCATION} to ${ride.Booking.B_DESTLOCATION} has started.`;
  await exports.createNotification({
    userId,
    type: 'Ride Start',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Ride Completion Notification
exports.notifyRideCompletion = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your ride from ${ride.Booking.B_PICKUPLOCATION} to ${ride.Booking.B_DESTLOCATION} has been completed. We hope you had a great experience!`;
  await exports.createNotification({
    userId,
    type: 'Ride Completion',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Parcel Booking Confirmation Notification
exports.notifyParcelBookingConfirmation = async (parcelBooking) => {
  const booking = await Booking.findOne({ where: { B_ID: parcelBooking.B_ID } });
  if (!booking) {
    console.error('Error: Booking not found for parcel booking.');
    throw new Error('Booking not found.');
  }

  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your parcel has been booked for delivery from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION}.`;
  
  await exports.createNotification({
    userId,
    type: 'Parcel Booking Confirmation',
    content,
    data: JSON.stringify({ parcelId: parcelBooking.P_ID })
  });
};

// Parcel Status Pending Notification
exports.notifyParcelStatusPending = async (parcelBooking) => {
  const booking = await Booking.findOne({ where: { B_ID: parcelBooking.B_ID } });
  if (!booking) {
    console.error('Error: Booking not found for parcel booking.');
    throw new Error('Booking not found.');
  }

  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your parcel booking is pending approval and will be reviewed shortly.`;
  
  await exports.createNotification({
    userId,
    type: 'Parcel Status Pending',
    content,
    data: JSON.stringify({ parcelId: parcelBooking.P_ID })
  });
};

// Parcel Pickup Scheduled Notification
exports.notifyParcelPickupScheduled = async (parcel) => {
  const booking = await Booking.findOne({ where: { B_ID: parcel.Booking.B_ID } });
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your parcel is scheduled for pickup on ${parcel.BookingSlot.BS_DATETIME} at ${parcel.BookingSlot.BS_PICKUPTIME}.`;
  await exports.createNotification({
    userId,
    type: 'Parcel Pickup Scheduled',
    content,
    data: JSON.stringify({ parcelId: parcel.P_ID })
  });
};

// Parcel Pickup Notification
exports.notifyParcelPickup = async (parcel) => {
  const booking = await Booking.findOne({ where: { B_ID: parcel.Booking.B_ID } });
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your parcel has been picked up from ${parcel.Booking.B_PICKUPLOCATION} and is en route to ${parcel.Booking.B_DESTLOCATION}.`;
  await exports.createNotification({
    userId,
    type: 'Parcel Pickup',
    content,
    data: JSON.stringify({ parcelId: parcel.P_ID })
  });
};

// Parcel Delivery Notification
exports.notifyParcelDelivery = async (parcel) => {
  const booking = await Booking.findOne({ where: { B_ID: parcel.Booking.B_ID } });
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your parcel has been delivered to ${parcel.P_RECIPIENTNAME} at ${parcel.Booking.B_DESTLOCATION}.`;
  await exports.createNotification({
    userId,
    type: 'Parcel Delivery',
    content,
    data: JSON.stringify({ parcelId: parcel.P_ID })
  });
};

// Message from Driver Notification
exports.notifyMessage = async (message, userType) => {
  let userId, content;

  // If userType is 1 (Driver), notify the Customer
  if (userType === 1) {
    const customer = await Customer.findOne({ where: { C_ID: message.Customer.C_ID } });
    userId = customer.U_ID;
    content = `You have received a new message from your driver: "${message.MSG_CONTENT}"`;
  } else {
    // Otherwise, notify the Driver
    const driver = await Driver.findOne({ where: { D_ID: message.Driver.D_ID } });
    userId = driver.U_ID;
    content = `You have received a new message from your customer: "${message.MSG_CONTENT}"`;
  }

  await exports.createNotification({
    userId,
    type: 'Message',
    content,
    data: JSON.stringify({ messageId: message.MSG_ID })
  });
};


// Pending Payment Notification
exports.notifyPendingPayment = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `You have a pending payment for your ride from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION}. Please complete your payment.`;
  await exports.createNotification({
    userId,
    type: 'Pending Payment',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Driver Arrival Notification
exports.notifyDriverArrival = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your driver has arrived at ${ride.Booking.B_PICKUPLOCATION}. Please meet them at the location.`;
  await exports.createNotification({
    userId,
    type: 'Driver Arrival',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Driver Departure Notification
exports.notifyDriverDeparture = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your ride/parcel has departed from ${ride.Booking.B_PICKUPLOCATION}.`;
  await exports.createNotification({
    userId,
    type: 'Driver Departure',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Incident Report Feedback Notification
exports.notifyIncidentReportFeedback = async (incident) => {
  const customer = await Customer.findOne({ where: { C_ID: incident.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your incident report regarding "${incident.INC_DETAILS}" has been reviewed. ${incident.INC_RESOLUTION}`;
  await exports.createNotification({
    userId,
    type: 'Incident Report Feedback',
    content,
    data: JSON.stringify({ incidentId: incident.INC_ID })
  });
};

// Feedback Request Notification
exports.notifyFeedbackRequest = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `We would love to hear your feedback on your recent experience. Please rate your ride or delivery.`;
  await exports.createNotification({
    userId,
    type: 'Feedback Request',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Service Disruption Notification
exports.notifyServiceDisruption = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `We regret to inform you that there is a disruption with your scheduled ride/parcel delivery. Please contact support for assistance.`;
  await exports.createNotification({
    userId,
    type: 'Service Disruption',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Booking Slot Change Notification
exports.notifyBookingSlotChange = async (booking) => {
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your booking slot for the ride/parcel from ${booking.B_PICKUPLOCATION} to ${booking.B_DESTLOCATION} has been changed to ${booking.BookingSlot.BS_DATETIME}.`;
  await exports.createNotification({
    userId,
    type: 'Booking Slot Change',
    content,
    data: JSON.stringify({ bookingId: booking.B_ID })
  });
};

// Driver Delayed Notification
exports.notifyDriverDelay = async (ride) => {
  const customer = await Customer.findOne({ where: { C_ID: ride.Customer.C_ID } });
  const userId = customer.U_ID;
  const content = `Your driver is delayed and will arrive at ${ride.BookingSlot.BS_ARRIVALTIME}. We apologize for the inconvenience.`;
  await exports.createNotification({
    userId,
    type: 'Driver Delay',
    content,
    data: JSON.stringify({ rideId: ride.R_ID })
  });
};

// Verification OTP for Parcel Collection Notification
exports.notifyParcelCollectionOTP = async (parcel) => {
  const booking = await Booking.findOne({ where: { B_ID: parcel.Booking.B_ID } });
  const customer = await Customer.findOne({ where: { C_ID: booking.C_ID } });
  const userId = customer.U_ID;
  const content = `Your OTP for collecting the parcel at ${parcel.Booking.B_DESTLOCATION} is ${parcel.P_OTP}. Please present this code to verify your identity when collecting the parcel upon arrival.`;
  await exports.createNotification({
    userId,
    type: 'Parcel Collection OTP',
    content,
    data: JSON.stringify({ parcelId: parcel.P_ID, otp: parcel.P_OTP })
  });
};

// Referral Bonus Notification
exports.notifyReferralBonus = async (userId, bonusAmount) => {
  const content = `Congratulations! You have earned a referral bonus of R${bonusAmount}.`;
  await exports.createNotification({
    userId,
    type: 'Referral Bonus',
    content,
    data: JSON.stringify({ bonusAmount })
  });
};

// Promotional Offers Notification
exports.notifyPromotionalOffer = async (userId, offerDetails) => {
  const content = `Exclusive offer: Get ${offerDetails.discount} off on your next ride or parcel booking. Valid until ${offerDetails.validUntil}.`;
  await exports.createNotification({
    userId,
    type: 'Promotional Offer',
    content,
    data: JSON.stringify(offerDetails)
  });
};
