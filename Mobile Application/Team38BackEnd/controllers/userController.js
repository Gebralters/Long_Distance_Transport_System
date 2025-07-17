const { User, Customer, CustomerProfile, LogStatus } = require('../models');
const crypto = require('crypto');
const path = require('path');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

exports.register = async (req, res) => {
  try {
    const { firstName, surname, email, title, contact, password, userType } = req.body;

    // Hash the password with SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create the user
    const user = await User.create({
      U_FIRSTNAME: firstName,
      U_SURNAME: surname,
      U_EMAIL: email,
      U_TITLE: title,
      U_CONTACT: contact,
      U_PASSWORD: hashedPassword,
      U_USERTYPE: userType || 2, // Defaulting to 2 for customers if not provided
      U_REGDATE: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // Adjusting the time to UTC+2
    });

    // Create the customer
    const customer = await Customer.create({
      U_ID: user.U_ID,
    });

    // Create the customer profile
    await CustomerProfile.create({
      C_ID: customer.C_ID,
      CP_PICURL: '', // Default to empty or a placeholder URL
      CP_NEXTOFKINNAME: '',
      CP_NEXTOFKINEMAIL: '',
      CP_NEXTOFKINCONTACT: '',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        U_ID: user.U_ID,
        U_FIRSTNAME: user.U_FIRSTNAME,
        U_SURNAME: user.U_SURNAME,
        U_EMAIL: user.U_EMAIL,
        U_TITLE: user.U_TITLE,
        U_CONTACT: user.U_CONTACT,
        U_USERTYPE: user.U_USERTYPE,
        U_REGDATE: user.U_REGDATE,
      },
      customer: {
        C_ID: customer.C_ID,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { U_EMAIL: email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the provided password with SHA-256 for comparison
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword !== user.U_PASSWORD) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Update log status to "Active"
    user.U_LOGSTATUS = 'Active';
    await user.save();

    // Log the login activity with timezone adjustment
    await LogStatus.create({
      UL_DATE: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // Adjusting the time to UTC+2
      U_ID: user.U_ID,
    });

    res.status(200).json({
      message: 'User authenticated successfully',
      user: {
        U_ID: user.U_ID,
        U_FIRSTNAME: user.U_FIRSTNAME,
        U_SURNAME: user.U_SURNAME,
        U_EMAIL: user.U_EMAIL,
        U_TITLE: user.U_TITLE,
        U_CONTACT: user.U_CONTACT,
        U_USERTYPE: user.U_USERTYPE,
        U_REGDATE: user.U_REGDATE,
        U_LOGSTATUS: user.U_LOGSTATUS,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ where: { U_ID: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update log status to "Inactive"
    user.U_LOGSTATUS = 'Inactive';
    await user.save();

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err });
    }

    try {
      const { userId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const customer = await Customer.findOne({ where: { U_ID: userId } });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      const picUrl = `http://localhost:8081/uploads/profile_pictures/${file.filename}`;
      await CustomerProfile.update(
        { CP_PICURL: picUrl },
        { where: { C_ID: customer.C_ID } }
      );

      res.status(201).json({ message: 'Profile picture uploaded successfully', picUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
};