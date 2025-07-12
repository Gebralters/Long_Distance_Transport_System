const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();
const routes = require('./routes'); // Import the routes

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General routes
app.use('/', routes);
app.use('/reguser', routes);
app.use('/loguser', routes);

// Personal information routes
app.use('/getUserDetails', routes);
app.use('/updateUserDetails', routes);
app.use('/updateProfilePicture', routes);

// Notification routes
app.use('/notifications', routes);
app.use('/messages', routes); // Ensuring this handles all message-related routes

// Booking routes
app.use('/bookings', routes); // Adding route for bookings
app.use('/acceptBooking', routes); // Adding route for accepting bookings
app.use('/bookingDetails', routes); // Adding route for booking details

// Incident reporting routes
app.use('/reportIncident', routes);
app.use('/incidents', routes);
app.use('/updateIncident', routes);
app.use('/deleteIncident', routes);
app.use('/incidentsForReporting', routes);

// Dashboard routes
app.use('/rides', routes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} Hostname: Localhost`);
});

