const { Customer, CustomerProfile, User } = require('../models');
const path = require('path');

exports.getCustomerProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the customer based on the user ID
    const customer = await Customer.findOne({
      where: { U_ID: userId },
      include: [
        {
          model: CustomerProfile,
        },
        {
          model: User, 
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { User: user, CustomerProfile: profile } = customer;

    res.status(200).json({
      firstName: user.U_FIRSTNAME,
      lastName: user.U_SURNAME,
      contactNumber: user.U_CONTACT, // Fixed field name
      emergencyContactName: profile.CP_NEXTOFKINNAME,
      emergencyContactNumber: profile.CP_NEXTOFKINCONTACT,
      profilePic: profile.CP_PICURL,
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, contactNumber, emergencyContactName, emergencyContactNumber } = req.body;

    // Find the customer profile
    const customer = await Customer.findOne({ where: { U_ID: userId } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const profile = await CustomerProfile.findOne({ where: { C_ID: customer.C_ID } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update profile details
    profile.CP_FIRSTNAME = firstName;
    profile.CP_LASTNAME = lastName;
    profile.CP_CONTACT = contactNumber;
    profile.CP_NEXTOFKINNAME = emergencyContactName;
    profile.CP_NEXTOFKINCONTACT = emergencyContactNumber;

    // Handle profile picture upload (if provided)
    if (req.file) {
      const uploadedImageUrl = `/uploads/profile_pictures/${req.file.filename}`;
      profile.CP_PICURL = uploadedImageUrl;
    }

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};