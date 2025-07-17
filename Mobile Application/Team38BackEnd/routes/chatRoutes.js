// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Start a new chat for a specific ride
router.post('/start', chatController.startChat); // This now maps to /api/chat/start

// Get messages for a specific chat associated with a ride
router.get('/:chatId/messages', chatController.getMessages); // This now maps to /api/chat/:chatId/messages

// Send a message in a specific chat
router.post('/:chatId/message', chatController.sendMessage); // This now maps to /api/chat/:chatId/message

module.exports = router;
