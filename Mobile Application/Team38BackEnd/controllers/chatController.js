// controllers/chatController.js
const moment = require('moment-timezone');
const { Chat, Message, Customer, Driver } = require('../models');
const notificationController = require('./notificationController');

// Start a new chat for a specific ride
exports.startChat = async (req, res) => {
  try {
    const { customerId, driverId, rideId } = req.body;

    let chat = await Chat.findOne({ where: { C_ID: customerId, D_ID: driverId, R_ID: rideId } });

    if (!chat) {
      chat = await Chat.create({
        C_ID: customerId,
        D_ID: driverId,
        R_ID: rideId, // Associate the chat with the specific ride
        CH_STATUS: 'Active'
      });
    }

    res.status(200).json({ message: 'Chat started successfully!', chat });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get messages for a specific chat associated with a ride
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.findAll({ where: { CH_ID: chatId } });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send a message in a specific chat
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, status, userType } = req.body;

    // Ensure time is set to South Africa Standard Time (SAST)
    const message = await Message.create({
      CH_ID: chatId,
      M_CONTENT: content,
      M_STATUS: status,
      M_USERTYPE: userType, // 1 for driver, 2 for customer
      M_TIME: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // Save the time directly as a Date object
    });

    await Chat.increment('CH_NUMCHATS', { where: { CH_ID: chatId } });

    // Notify the user about the new message
    const chat = await Chat.findOne({ where: { CH_ID: chatId }, include: [Customer, Driver] });
    if (chat && chat.Customer) {
      await notificationController.notifyMessage({
        Customer: chat.Customer,
        Driver: chat.Driver,
        MSG_CONTENT: content
      });
    }

    res.status(201).json({ message: 'Message sent successfully!', message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
