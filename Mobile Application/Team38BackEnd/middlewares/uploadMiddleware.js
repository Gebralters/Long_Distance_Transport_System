const multer = require('multer');
const path = require('path');

// Set storage engine for both profile pictures and parcel booking images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a single folder for all uploads
    cb(null, 'C:/Users/ragop/OneDrive - University of Johannesburg/Desktop/School Work/THIRD YEAR/SEMESTER 2/IFM3B/TYP 2/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use timestamp to avoid name conflicts
  }
});

// File filter for only jpeg/jpg/png images
const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

// In your Multer configuration
const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit of 5MB for profile pictures
  fileFilter: imageFileFilter,
}).single('profilePic');

// Multiple file upload for parcel images
const uploadMultiple = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit of 10MB for each parcel image
  fileFilter: imageFileFilter,
}).array('parcelImages', 4);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
