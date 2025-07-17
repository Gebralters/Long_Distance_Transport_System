// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notifications/create', notificationController.createNotification);
router.get('/notifications/:userId', notificationController.getUserNotifications);
router.get('/notification/:notificationId', notificationController.getNotificationById);
router.get('/notifications/unreadCount/:userId', notificationController.getUnreadCount);
router.put('/notifications/markAsRead/:notificationId', notificationController.markAsRead);

module.exports = router;
