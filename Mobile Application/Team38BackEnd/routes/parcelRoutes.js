const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');

// Route to fetch available parcel rides (including 'Accepted' status)
router.get('/parcels/available', parcelController.filterParcelRides);

// Route to book a parcel (with image upload)
router.post('/parcels/book', parcelController.bookParcel); // This will now handle image uploads

// Route to fetch parcel categories
router.get('/parcels/categories', parcelController.getParcelCategories);

module.exports = router;
