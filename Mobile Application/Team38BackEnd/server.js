const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./models');

// Importing Routes
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const rideRoutes = require('./routes/rideRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tripRoutes = require('./routes/tripRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const chatRoutes = require('./routes/chatRoutes');
const rideIncidentRoutes = require('./routes/rideIncidentRoutes');
const checkpointRoutes = require('./routes/checkpointRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const faqRoutes = require('./routes/faqRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files (uploaded images) from the 'uploads' directory
app.use('/uploads', express.static('C:/Users/ragop/OneDrive - University of Johannesburg/Desktop/School Work/THIRD YEAR/SEMESTER 2/IFM3B/TYP 2/uploads'));

// Routes
app.use('/api', userRoutes);
app.use('/api', notificationRoutes);
app.use('/api', rideRoutes);
app.use('/api', paymentRoutes);
app.use('/api', tripRoutes);
app.use('/api', parcelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', rideIncidentRoutes);
app.use('/api', checkpointRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', faqRoutes);
app.use('/api', serviceRoutes);
app.use('/api', trackingRoutes);

// Syncing database and starting the server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.log('Error syncing with the database:', err);
});
