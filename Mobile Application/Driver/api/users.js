import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.254.192.251:3001/api/users';

export const getUsers = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/getUser`, {
      U_EMAIL: email,
      U_PASSWORD: password
    });
    return response.data.user;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const logoutUser = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {
      U_ID: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};


export const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/addUser`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/changePassword`, {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Booking Slots
export const getAllBookingSlots = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllBookingSlots`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking slots:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// API function to accept booking slot and assign driver ID based on userId
export const acceptBookingSlot = async (slotId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/acceptBookingSlot`, { slotId, userId });
    return response.data;
  } catch (error) {
    console.error('Error accepting booking slot:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch available routes for a specific driver
const getRoutes = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/getRoutes`, {
      params: { userId } // Pass userId as query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

// API function to create a new ride
export const createRide = async (bookingSlotId, routeId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/createRide`, {
      bookingSlotId,
      routeId,
      userId, // Pass userId here
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ride:', error);
    throw error;
  }
};

export const getAcceptedBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/acceptedBookings`, {
      params: { userId }, // Pass userId as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accepted bookings:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getCompletedRides = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/completedRides`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completed rides:', error);
    throw error;
  }
};

// For Active Rides, accepts userId as a parameter
export const getActiveRides = async (userId) => {
  try {
    // If userId is not provided, attempt to retrieve it from AsyncStorage
    if (!userId) {
      userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
    }

    // Make the API request using the userId
    const response = await axios.get(`${API_URL}/activeRides/${userId}`);
    
    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching active rides:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// For Completing a Ride
export const completeRide = async (rideId) => {
  try {
    const response = await axios.put(`${API_URL}/completeRide`, { rideId });
    return response.data;
  } catch (error) {
    console.error('Error completing ride:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllCustomers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Notifications
export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getNotifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    await axios.post(`${API_URL}/markNotificationAsRead`, {
      notificationId,
      userId
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};


// Get unread notifications count
export const getUnreadNotificationsCount = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getUnreadNotificationsCount/${userId}`);
    return response.data.unreadCount;
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
};


// Get vehicle information
export const getVehicleInformation = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/vehicle/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle information:', error);
    throw error;
  }
};

// Fetch ride reviews for a specific driver
export const getRideReviews = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/rideReviews/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ride reviews:', error);
    throw error;
  }
};

// Upload document
export const uploadDocument = async (formData, type, driverId) => {
  try {
    const response = await axios.post(`${API_URL}/uploadDocument`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        type,
        driverId,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch documents
export const getDocuments = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getDocuments/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update driver status using userId
export const updateDriverStatus = async (userId, status) => {
  try {
    const response = await axios.post(`${API_URL}/updateDriverStatus`, {
      userId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating driver status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch driver status using userId
export const getDriverStatus = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getDriverStatus/${userId}`);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching driver status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update driver profile
export const updateDriverProfile = async (profileData) => {
  const formData = new FormData();
  formData.append('userId', profileData.userId); // Changed from driverId to userId
  formData.append('firstName', profileData.firstName);
  formData.append('lastName', profileData.lastName);
  formData.append('email', profileData.email);
  formData.append('title', profileData.title);
  formData.append('contactNumber', profileData.contactNumber);

  if (profileData.profilePic) {
    formData.append('profilePic', {
      uri: profileData.profilePic,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });
  }

  try {
    console.log('Sending request to update profile...');
    const response = await axios.post(`${API_URL}/updateDriverProfile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating driver profile:', error);
    throw error;
  }
};

// Fetch driver profile by userId (not driverId anymore)
export const getDriverProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/driverProfile`, { params: { userId } }); // Now using userId
    return response.data;
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    throw error;
  }
};


// Fetch checkpoints for a specific route
export const getCheckpoints = async (rideId) => {
  try {
    const response = await axios.get(`${API_URL}/checkpoints/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching checkpoints:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update checkpoint status
export const updateCheckpointStatus = async (checkpointId, rideId, timestamp) => {
  try {
    await axios.put(`${API_URL}/updateCheckpointStatus`, { checkpointId, rideId, timestamp });
  } catch (error) {
    console.error('Error updating checkpoint status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add incident report
export const addIncident = async (incident) => {
  try {
    const response = await axios.post(`${API_URL}/addIncident`, incident);
    return response.data;
  } catch (error) {
    console.error('Error adding incident:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Create a chat between a driver and a customer
export const createChat = async (driverId, customerId, rideId) => {
  try {
    const response = await axios.post(`${API_URL}/createChat`, {
      driverId,
      customerId,
      rideId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch messages for a specific chat
export const getMessages = async (rideId, driverId, customerId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${rideId}`, {
      params: {
        driverId,
        customerId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message in an existing chat
export const sendMessage = async (message, rideId, driverId, customerId, senderId) => {
  try {
    await axios.post(`${API_URL}/messages`, {
      message,
      rideId,
      driverId,
      customerId,
      senderId
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to check driver's verification status
export const checkDriverVerification = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/checkVerification/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching driver verification status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to get driverId using userId
export const getDriverId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/driverId`, { params: { userId } });
    return response.data.driverId;
  } catch (error) {
    console.error('Error fetching driver ID:', error);
    throw error;
  }
};

// Fetch customer ID by booking ID
export const getCustomerIdByBooking = async (bookingId) => {
  try {
    const response = await axios.get(`${API_URL}/getCustomerIdByBooking`, {
      params: { bookingId }
    });
    return response.data.C_ID;
  } catch (error) {
    console.error('Error fetching customer ID by booking:', error);
    throw error;
  }
};


// Function to update driver's location
export const updateDriverLocation = async (driverId, latitude, longitude) => {
  try {
    await axios.post(`${API_URL}/driver/updateLocation`, {
      driverId,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    throw error;
  }
};

// Function to fetch driver's current location
export const fetchDriverLocation = async (driverId) => {
  try {
    const response = await axios.get(`${API_URL}/driver/getLocation/${driverId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching driver location:', error);
    throw error;
  }
};

// Function to fetch driverId based on userId
export const fetchDriverIdForUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/driver/getDriverId/${userId}`);
    return response.data.driverId; // Return the driverId from the response
  } catch (error) {
    console.error('Error fetching driver ID:', error);
    throw error; // Rethrow the error so the calling code can handle it
  }
};


// Function to verify OTP for the active ride linked to a specific driver
export const verifyOtp = async (enteredOtp) => {
  try {
    const userId = await AsyncStorage.getItem('userId');  // Retrieve userId from AsyncStorage
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Send the userId and enteredOtp to the backend for verification
    const response = await axios.post(`${API_URL}/verifyOtp`, {
      userId,
      enteredOtp,
    });

    // Return the verification result
    return response.data;
  } catch (error) {
    //console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch the number of rides completed by the driver
export const getCompletedRidesForDriver = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/completed`, { params: { userId } });
    return response.data.ridesCompleted;
  } catch (error) {
    console.error('Error fetching completed rides:', error);
    throw error;
  }
};

// Fetch the leaderboard of drivers based on rides completed
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard/rides`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};