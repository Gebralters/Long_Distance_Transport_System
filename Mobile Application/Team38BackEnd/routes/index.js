// routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', notificationRoutes);

module.exports = router;
