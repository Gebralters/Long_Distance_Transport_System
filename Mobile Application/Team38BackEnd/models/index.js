const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

// Define models
const User = require('./user')(sequelize, Sequelize);
const Customer = require('./customer')(sequelize, Sequelize);
const CustomerProfile = require('./customerProfile')(sequelize, Sequelize);
const Notification = require('./notification')(sequelize, Sequelize);
const Booking = require('./booking')(sequelize, Sequelize);
const RideBooking = require('./rideBooking')(sequelize, Sequelize);
const BookingSlot = require('./bookingSlot')(sequelize, Sequelize);
const PaymentDetails = require('./paymentDetails')(sequelize, Sequelize);
const Payment = require('./payment')(sequelize, Sequelize);
const Ride = require('./ride')(sequelize, Sequelize);
const Driver = require('./driver')(sequelize, Sequelize);
const Vehicle = require('./vehicle')(sequelize, Sequelize);
const RideFeedback = require('./rideFeedback')(sequelize, Sequelize);
const Route = require('./route')(sequelize, Sequelize);
const RouteCheckpoint = require('./routeCheckpoint')(sequelize, Sequelize);
const RideCheckpoint = require('./rideCheckpoint')(sequelize, Sequelize);
const Invoice = require('./invoice')(sequelize, Sequelize);
const Incident = require('./incident')(sequelize, Sequelize);
const ParcelCategory = require('./parcelCategory')(sequelize, Sequelize);
const ParcelBooking = require('./parcelBooking')(sequelize, Sequelize);
const PassengerBooking = require('./passengerBooking')(sequelize, Sequelize);
const ParcelImage = require('./parcelImage')(sequelize, Sequelize); 
const ParcelDimensions = require('./parcelDimensions')(sequelize, Sequelize); 
const Chat = require('./chat')(sequelize, Sequelize);
const Message = require('./message')(sequelize, Sequelize);
const RideIncident = require('./rideIncident')(sequelize, Sequelize);
const FAQCategory = require('./faqCategory')(sequelize, Sequelize);
const FAContent = require('./faContent')(sequelize, Sequelize);
const DriverLocation = require('./driverLocation')(sequelize, Sequelize);
const DProfile = require('./d_profile')(sequelize, Sequelize);
const DriverRating = require('./driver_rating')(sequelize, Sequelize);
const LogStatus = require('./LogStatus')(sequelize, Sequelize); 

// Define associations
User.hasOne(Customer, { foreignKey: 'U_ID' });
Customer.belongsTo(User, { foreignKey: 'U_ID' });

User.hasOne(Driver, { foreignKey: 'U_ID' });
Driver.belongsTo(User, { foreignKey: 'U_ID' });

User.hasMany(Notification, { foreignKey: 'U_ID' });
Notification.belongsTo(User, { foreignKey: 'U_ID' });

Customer.hasMany(Booking, { foreignKey: 'C_ID' });
Booking.belongsTo(Customer, { foreignKey: 'C_ID' });

BookingSlot.hasMany(Booking, { foreignKey: 'BS_ID' });
Booking.belongsTo(BookingSlot, { foreignKey: 'BS_ID' });

RideBooking.hasMany(Booking, { foreignKey: 'RB_ID' });
Booking.belongsTo(RideBooking, { foreignKey: 'RB_ID' });

Customer.hasMany(Payment, { foreignKey: 'C_ID' });
Payment.belongsTo(Customer, { foreignKey: 'C_ID' });

Booking.hasMany(Payment, { foreignKey: 'B_ID' });
Payment.belongsTo(Booking, { foreignKey: 'B_ID' });

Ride.hasMany(Booking, { foreignKey: 'RB_ID' });
Booking.belongsTo(Ride, { foreignKey: 'RB_ID' });

BookingSlot.belongsTo(Driver, { foreignKey: 'D_ID' });
Driver.hasMany(BookingSlot, { foreignKey: 'D_ID' });

Ride.belongsTo(Driver, { foreignKey: 'D_ID' });
Driver.hasMany(Ride, { foreignKey: 'D_ID' });

Driver.hasOne(Vehicle, { foreignKey: 'D_ID' });
Vehicle.belongsTo(Driver, { foreignKey: 'D_ID' });

Driver.hasMany(DriverLocation, { foreignKey: 'D_ID' });
DriverLocation.belongsTo(Driver, { foreignKey: 'D_ID' });

Ride.belongsTo(RideBooking, { foreignKey: 'RB_ID' });
RideBooking.hasMany(Ride, { foreignKey: 'RB_ID' });

Route.hasMany(Ride, { foreignKey: 'RO_ID' });
Ride.belongsTo(Route, { foreignKey: 'RO_ID' });

Route.hasMany(RouteCheckpoint, { foreignKey: 'RO_ID' });
RouteCheckpoint.belongsTo(Route, { foreignKey: 'RO_ID' });

Ride.hasMany(RideCheckpoint, { foreignKey: 'R_ID' });
RideCheckpoint.belongsTo(Ride, { foreignKey: 'R_ID' });

RideCheckpoint.belongsTo(RouteCheckpoint, { foreignKey: 'RC_ID' });

Payment.hasOne(Invoice, { foreignKey: 'PAY_ID' });
Invoice.belongsTo(Payment, { foreignKey: 'PAY_ID' });

User.hasMany(Incident, { foreignKey: 'U_ID' });
Incident.belongsTo(User, { foreignKey: 'U_ID' });

ParcelCategory.hasMany(ParcelBooking, { foreignKey: 'P_CATID' });
ParcelBooking.belongsTo(ParcelCategory, { foreignKey: 'P_CATID' });

ParcelBooking.hasMany(ParcelImage, { foreignKey: 'P_ID' });
ParcelImage.belongsTo(ParcelBooking, { foreignKey: 'P_ID' });

ParcelBooking.hasMany(ParcelDimensions, { foreignKey: 'P_ID' });
ParcelDimensions.belongsTo(ParcelBooking, { foreignKey: 'P_ID' });

Booking.hasMany(PassengerBooking, { foreignKey: 'B_ID' });
PassengerBooking.belongsTo(Booking, { foreignKey: 'B_ID' });

Booking.hasMany(ParcelBooking, { foreignKey: 'B_ID' });  
ParcelBooking.belongsTo(Booking, { foreignKey: 'B_ID' }); 

Ride.hasMany(RideFeedback, { foreignKey: 'R_ID' });
RideFeedback.belongsTo(Ride, { foreignKey: 'R_ID' });

Chat.hasMany(Message, { foreignKey: 'CH_ID' });
Message.belongsTo(Chat, { foreignKey: 'CH_ID' });

Driver.hasMany(Chat, { foreignKey: 'D_ID' });
Chat.belongsTo(Driver, { foreignKey: 'D_ID' });

Customer.hasMany(Chat, { foreignKey: 'C_ID' });
Chat.belongsTo(Customer, { foreignKey: 'C_ID' });

Ride.hasMany(Chat, { foreignKey: 'R_ID' });
Chat.belongsTo(Ride, { foreignKey: 'R_ID' });

Ride.hasMany(RideIncident, { foreignKey: 'R_ID' });
RideIncident.belongsTo(Ride, { foreignKey: 'R_ID' });

Customer.hasMany(RideIncident, { foreignKey: 'C_ID' });
RideIncident.belongsTo(Customer, { foreignKey: 'C_ID' });

Customer.hasOne(CustomerProfile, { foreignKey: 'C_ID' });
CustomerProfile.belongsTo(Customer, { foreignKey: 'C_ID' });

FAQCategory.hasMany(FAContent, { foreignKey: 'FAQC_ID' });
FAContent.belongsTo(FAQCategory, { foreignKey: 'FAQC_ID' });

// Associations for Driver
Driver.hasOne(DProfile, { foreignKey: 'D_ID' });
DProfile.belongsTo(Driver, { foreignKey: 'D_ID' });

Driver.hasMany(DriverRating, { foreignKey: 'D_ID' });
DriverRating.belongsTo(Driver, { foreignKey: 'D_ID' });

// Associations for Customer and DriverRating
Customer.hasMany(DriverRating, { foreignKey: 'C_ID' });
DriverRating.belongsTo(Customer, { foreignKey: 'C_ID' });

// Associations for LogStatus
User.hasMany(LogStatus, { foreignKey: 'U_ID' });
LogStatus.belongsTo(User, { foreignKey: 'U_ID' });

const db = {
  Sequelize,
  sequelize,
  User,
  Customer,
  CustomerProfile,
  Notification,
  Booking,
  RideBooking,
  BookingSlot,
  PaymentDetails,
  Payment,
  Ride,
  Driver,
  Vehicle,
  RideFeedback,
  Route,
  RouteCheckpoint,
  RideCheckpoint,
  Invoice,
  Incident,
  ParcelCategory,
  ParcelBooking,
  PassengerBooking,
  ParcelImage, 
  ParcelDimensions,
  Chat,
  RideIncident,
  Message,
  FAQCategory, 
  FAContent,
  DriverLocation,
  DProfile,
  DriverRating,
  LogStatus,
};

module.exports = db;
