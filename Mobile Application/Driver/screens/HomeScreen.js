import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnreadNotificationsCount } from '../api/users';

const API_URL = 'http://10.254.192.251:3001/api/users';

export default function HomeScreen({ navigation }) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in AsyncStorage');
      return null;
    }
    return userId;
  };

  const fetchUnreadNotifications = async () => {
    const userId = await fetchUserId();
    if (userId) {
      try {
        const count = await getUnreadNotificationsCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread notifications count:', error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadNotifications(); // Initial fetch on component mount

    const interval = setInterval(fetchUnreadNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleNavigation = async (screen) => {
    const userId = await fetchUserId();
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    navigation.navigate(screen, { userId });
  };

  const data = [
    { id: '1', title: 'Notifications', screen: 'Notifications' },
    { id: '2', title: 'CheckPoints', screen: 'CheckPoint' },
    { id: '3', title: 'DriverProfile', screen: 'DriverProfile' },
    { id: '4', title: 'Incident', screen: 'Incident' },
    { id: '5', title: 'VehicleInformation', screen: 'VehicleInformation' },
    { id: '6', title: 'DriverStatus', screen: 'DriverStatus' },
    { id: '7', title: 'About', screen: 'About' },
    { id: '8', title: 'DriverDocuments', screen: 'DriverDocuments' },
    { id: '9', title: 'RideReviews', screen: 'RideReviews' },
    { id: '10', title: 'RidesHistory', screen: 'RidesHistory' },
    { id: '11', title: 'BookingSlotDetails', screen: 'BookingSlotDetails' },
    { id: '12', title: 'MessageCustomer', screen: 'MessageCustomer' },
    { id: '13', title: 'EditDriverProfile', screen: 'EditDriverProfile' },
    { id: '14', title: 'ChangePassword', screen: 'ChangePassword' },
    { id: '15', title: 'PrivacySettings', screen: 'PrivacySettings' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const results = data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(results);
    }
  };

  const handleSelectResult = (item) => {
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    handleNavigation(item.screen);
  };

  const checkDriverVerification = async (screen) => {
    try {
      const userId = await fetchUserId();
      if (!userId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
      const response = await axios.get(`${API_URL}/checkVerification/${userId}`);
      const isVerified = response.data.D_VSTATUS === 'Verified';

      if (isVerified) {
        handleNavigation(screen);
      } else {
        Alert.alert('Verification Required', 'You are not yet verified. Please upload the required documents.');
      }
    } catch (error) {
      console.error('Error fetching driver status:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'Driver not found. Please contact support.');
      } else {
        Alert.alert('Error', 'Failed to fetch driver status. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity onPress={() => handleNavigation('Notifications')}>
            <View style={styles.notificationIconContainer}>
              <FontAwesome name="bell" size={24} color="white" style={styles.headerIcon} />
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <Ionicons name="search" size={24} color="white" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.card} onPress={() => checkDriverVerification('TravelLog')}>
          <Text style={styles.cardTitle}>Trip Logs</Text>
          <Image source={require('../assets/RideHome.jpg')} style={styles.cardImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => checkDriverVerification('BookingSlotDetails')}>
          <Text style={styles.cardTitle}>Bookings</Text>
          <Image source={require('../assets/DriverBookings.jpg')} style={styles.cardImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => checkDriverVerification('Incident')}>
          <Text style={styles.cardTitle}>Report Incident</Text>
          <Image source={require('../assets/incident.jpg')} style={styles.cardImage} />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={searchVisible}
        onRequestClose={() => setSearchVisible(!searchVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectResult(item)}>
                  <Text style={styles.resultText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setSearchVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    padding: 16,
    paddingTop: 37,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcon: {
    marginHorizontal: 10,
  },
  headerRightIcons: {
    flexDirection: 'row',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: 250,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for modal background
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  resultItem: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#00bfff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
