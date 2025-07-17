import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // Import navigation hook

// Make sure this is the correct API URL of your backend server
const API_URL = 'http://10.254.192.251:3001'; // Your API URL

export default function AccountScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [driverProfile, setDriverProfile] = useState({ U_FIRSTNAME: '', U_SURNAME: '', DP_PICURL: null });
  const [loading, setLoading] = useState(false); // New loading state
  const [imageError, setImageError] = useState(false); // Handle image loading errors

  const isFocused = useIsFocused(); // Hook to detect screen focus

  useEffect(() => {
    const fetchUserId = async () => {
      setLoading(true); // Start loading
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await fetchDriverProfile(id); // Ensure profile is fetched using userId
        } else {
          Alert.alert('Error', 'User is not logged in');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (isFocused) {
      fetchUserId(); // Fetch the data when the screen is focused
    }
  }, [isFocused]); // Refetch the data when the screen comes into focus

  const fetchDriverProfile = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/driverProfile`, {
        params: { userId: id } // Pass userId instead of driverId
      });
      const profileData = response.data;

      // Ensure the image URL is properly formatted
      if (profileData.DP_PICURL) {
        profileData.DP_PICURL = `${API_URL}${profileData.DP_PICURL}`; // Append the server URL to the image path
      }

      setDriverProfile(profileData);
    } catch (error) {
      console.error('Error fetching driver profile:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch driver profile');
    }
  };

  const checkDriverVerification = async (screen, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/checkVerification/${userId}`);
      const isVerified = response.data.D_VSTATUS === 'Verified';

      if (isVerified) {
        navigation.navigate(screen, { userId, ...params });
      } else {
        Alert.alert('Verification Required', 'You are not yet verified. Please upload the required documents.');
      }
    } catch (error) {
      console.error('Error fetching driver status:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('DriverProfile', { userId })}>
        {driverProfile.DP_PICURL && !imageError ? (
          <Image 
            source={{ uri: driverProfile.DP_PICURL }} // Use the full image path from the server
            style={styles.profileImage} 
            onError={() => setImageError(true)} // Handle image error by setting imageError state
          />
        ) : (
          <View style={styles.profileIconContainer}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{`${driverProfile.U_FIRSTNAME} ${driverProfile.U_SURNAME}`}</Text>
          <Text style={styles.accountText}>My Account</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.menuItem} onPress={() => checkDriverVerification('RidesHistory', { userId })}>
        <Text style={styles.icon}>🕒</Text>
        <Text style={styles.menuItemText}>Rides History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => checkDriverVerification('RideReviews', { userId })}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.menuItemText}>Rides Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DriverDocuments', { userId })}>
        <Text style={styles.icon}>📄</Text>
        <Text style={styles.menuItemText}>Driver Documents</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => checkDriverVerification('VehicleInformation', { userId })}>
        <Text style={styles.icon}>🚗</Text>
        <Text style={styles.menuItemText}>Vehicle Information</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
        <Text style={styles.icon}>ℹ️</Text>
        <Text style={styles.menuItemText}>About</Text>
      </TouchableOpacity>

      {/* Add the new Challenges tab */}
      <TouchableOpacity style={styles.menuItem} onPress={() => checkDriverVerification('DriverChallenges')}>
        <Text style={styles.icon}>🏆</Text>
        <Text style={styles.menuItemText}>Driver Challenges</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 15,
  },
  profileIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0', // Optional background for the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileIcon: {
    fontSize: 40,
    color: '#00bfff',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  accountText: {
    fontSize: 16,
    color: '#00bfff',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
    color: '#00bfff',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
