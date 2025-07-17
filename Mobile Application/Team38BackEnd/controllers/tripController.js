const { 
    Booking, Customer, Ride, RideFeedback, Payment, Driver, Vehicle, ParcelImage, ParcelDimensions,
    BookingSlot, Route, RouteCheckpoint, RideBooking, User, ParcelBooking, ParcelCategory, DriverLocation, DProfile, DriverRating, sequelize 
} = require('../models');
const { Op } = require('sequelize');

exports.getBookings = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const customer = await Customer.findOne({ where: { U_ID: userId } });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const bookings = await Booking.findAll({
            where: {
                C_ID: customer.C_ID,
            },
            include: [
                {
                    model: BookingSlot,
                    attributes: [
                        'BS_ID', 'BS_DATETIME', 'BS_PICKUPRADIUS', 'BS_DESTRADIUS', 
                        'BS_STATUS', 'BS_PICKUPTIME', 'BS_ARRIVALTIME', 'D_ID'
                    ],
                    include: [
                        {
                            model: Driver,
                            include: [
                                {
                                    model: Vehicle,
                                    attributes: ['V_ID', 'V_CAPACITY', 'V_TYPE', 'V_LICNUMBER', 'V_MODEL', 'V_COLOR', 'V_STATUS']
                                },
                                {
                                    model: User,
                                    attributes: ['U_FIRSTNAME', 'U_SURNAME', 'U_CONTACT']
                                },
                                {
                                    model: DProfile,
                                    attributes: ['DP_PICURL', 'DP_URLID', 'DP_LICURL'] // Include driver profile
                                },
                                {
                                    model: DriverRating,
                                    attributes: ['DR_DATE', 'DR_RATING', 'DR_COMMENTS'], // Include driver ratings
                                    limit: 3, // Fetch the latest 3 ratings
                                    order: [['DR_DATE', 'DESC']]
                                }
                            ],
                            attributes: ['D_ID', 'D_STATUS', 'D_VSTATUS', 'U_ID']
                        }
                    ],
                    required: false // Allow bookings without a BookingSlot association
                },
                {
                    model: Payment 
                },
                {
                    model: ParcelBooking,
                    include: [
                        {
                            model: ParcelImage,
                        },
                        {
                            model: ParcelDimensions,
                        }
                    ]
                }
            ],
            order: [['B_DATETIME', 'DESC']]
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings with driver details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getActiveTrips = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const customer = await Customer.findOne({ where: { U_ID: userId } });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Fetch active rides associated with the customer
        const rides = await Ride.findAll({
            where: {
                R_STATUS: 'Active'
            },
            include: [
                {
                    model: RideBooking,
                    required: true, // Ensure there is a RideBooking associated
                    include: [
                        {
                            model: Booking,
                            where: { C_ID: customer.C_ID }, // Filter by customer ID
                            include: [
                                {
                                    model: Payment,
                                    attributes: ['PAY_AMOUNT']
                                },
                                {
                                    model: BookingSlot,
                                    attributes: ['BS_DATETIME', 'BS_ARRIVALTIME', 'BS_PICKUPRADIUS', 'BS_DESTRADIUS'],
                                    include: [
                                        {
                                            model: Driver,
                                            include: [
                                                {
                                                    model: Vehicle,
                                                    attributes: ['V_ID', 'V_CAPACITY', 'V_TYPE', 'V_LICNUMBER', 'V_MODEL', 'V_COLOR', 'V_STATUS']
                                                },
                                                {
                                                    model: User,
                                                    attributes: ['U_FIRSTNAME', 'U_SURNAME', 'U_CONTACT']
                                                },
                                                {
                                                    model: DProfile,
                                                    attributes: ['DP_PICURL', 'DP_URLID', 'DP_LICURL'] // Include driver profile
                                                },
                                                {
                                                    model: DriverRating,
                                                    attributes: ['DR_DATE', 'DR_RATING', 'DR_COMMENTS'], // Include driver ratings
                                                    limit: 3, // Fetch the latest 3 ratings
                                                    order: [['DR_DATE', 'DESC']]
                                                },
                                                {
                                                    model: DriverLocation, // Real-time driver location
                                                    attributes: ['DL_LATITUDE', 'DL_LONGITUDE', 'DL_TIMESTAMP'],
                                                    order: [['DL_TIMESTAMP', 'DESC']],
                                                    limit: 1
                                                }
                                            ],
                                            attributes: ['D_ID', 'D_STATUS', 'D_VSTATUS']
                                        }
                                    ]
                                },
                                {
                                    model: ParcelBooking,
                                    include: [
                                        {
                                            model: ParcelCategory,
                                            attributes: ['P_DISCRIP']
                                        }
                                    ],
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching active trips:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCompletedTrips = async (req, res) => {
    try {
        const { userId } = req.query;
        const customer = await Customer.findOne({ where: { U_ID: userId } });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const rides = await Ride.findAll({
            where: {
                R_STATUS: 'Completed',
            },
            include: [
                {
                    model: RideBooking,
                    include: [
                        {
                            model: Booking,
                            where: { C_ID: customer.C_ID },
                            include: [
                                {
                                    model: Payment,
                                    attributes: ['PAY_AMOUNT']
                                },
                                {
                                    model: BookingSlot,
                                    attributes: ['BS_DATETIME', 'BS_ARRIVALTIME', 'BS_PICKUPRADIUS', 'BS_DESTRADIUS'],
                                    include: [
                                        {
                                            model: Driver,
                                            include: [
                                                {
                                                    model: Vehicle,
                                                    attributes: ['V_ID', 'V_CAPACITY', 'V_TYPE', 'V_LICNUMBER', 'V_MODEL', 'V_COLOR', 'V_STATUS']
                                                },
                                                {
                                                    model: User,
                                                    attributes: ['U_FIRSTNAME', 'U_SURNAME', 'U_CONTACT']
                                                },
                                                {
                                                    model: DProfile,
                                                    attributes: ['DP_PICURL', 'DP_URLID', 'DP_LICURL'] // Include driver profile
                                                },
                                                {
                                                    model: DriverRating,
                                                    attributes: ['DR_DATE', 'DR_RATING', 'DR_COMMENTS'], // Include driver ratings
                                                    limit: 3, // Fetch the latest 3 ratings
                                                    order: [['DR_DATE', 'DESC']]
                                                }
                                            ],
                                            attributes: ['D_ID', 'D_STATUS', 'D_VSTATUS']
                                        }
                                    ]
                                },
                                {
                                    model: ParcelBooking,
                                    include: [
                                        {
                                            model: ParcelCategory,
                                            attributes: ['P_DISCRIP']
                                        }
                                    ],
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching completed trips:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.query;

        const booking = await Booking.findOne({
            where: { B_ID: bookingId },
            include: [
                {
                    model: BookingSlot,
                    include: [
                        {
                            model: Driver,
                            include: [
                                {
                                    model: Vehicle,
                                    attributes: ['V_ID', 'V_CAPACITY', 'V_TYPE', 'V_LICNUMBER', 'V_MODEL', 'V_COLOR', 'V_STATUS']
                                },
                                {
                                    model: User,
                                    attributes: ['U_FIRSTNAME', 'U_SURNAME', 'U_CONTACT']
                                },
                                {
                                    model: DProfile,
                                    attributes: ['DP_PICURL', 'DP_URLID', 'DP_LICURL'] // Include driver profile
                                },
                                {
                                    model: DriverRating,
                                    attributes: ['DR_DATE', 'DR_RATING', 'DR_COMMENTS'], // Include driver ratings
                                    limit: 3, // Fetch the latest 3 ratings
                                    order: [['DR_DATE', 'DESC']]
                                }
                            ],
                            required: false
                        }
                    ],
                },
                {
                    model: Payment,
                },
                {
                    model: ParcelBooking,
                    include: [
                        {
                            model: ParcelCategory,
                            attributes: ['P_DISCRIP']
                        }
                    ],
                    required: false
                }
            ],
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add Feedback
exports.addFeedback = async (req, res) => {
    try {
        const { rideId, userId, comments, rating } = req.body;

        // Log the incoming data for debugging
        console.log('Received Data:', { rideId, userId, comments, rating });

        // Create feedback entry using the customer ID directly
        const feedback = await RideFeedback.create({
            RF_COMMENTS: comments,
            RF_RATING: rating,
            R_ID: rideId,
            C_ID: userId,  // Directly using the customer ID from the request
        });

        // Log successful feedback creation
        console.log('Feedback created successfully:', feedback);

        // Return a success response
        res.status(201).json({ message: 'Feedback added successfully!', feedback });

    } catch (error) {
        // Log the error details for debugging
        console.error('Error adding feedback:', error);

        // Return a generic error message to the client
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const booking = await Booking.findOne({ where: { B_ID: bookingId } });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking status allows cancellation
        if (booking.B_STATUS === 'Ride Started' || booking.B_STATUS === 'Completed') {
            return res.status(400).json({ message: 'This booking cannot be cancelled as the ride has already started or is completed.' });
        }

        // Proceed with cancellation
        booking.B_STATUS = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully!' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
