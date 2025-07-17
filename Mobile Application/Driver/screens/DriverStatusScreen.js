import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { updateDriverStatus } from '../api/users'; // Import the API function

const API_URL = 'http://10.254.192.251:3001/api/users';

export default function DriverStatusScreen({ route }) {
  const { userId } = route.params; // Use userId from the route parameters
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the current status when the component mounts
  useEffect(() => {
    const fetchDriverStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/getDriverStatus/${userId}`);
        setIsActive(response.data.status === 'Active'); // Set initial state based on fetched status
      } catch (error) {
        console.error('Error fetching driver status:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch driver status.');
      } finally {
        setLoading(false); // Stop loading after the request
      }
    };

    fetchDriverStatus();
  }, [userId]);

  // Toggle active status
  const toggleActiveStatus = async () => {
    const newStatus = isActive ? 'Inactive' : 'Active';
    try {
      await updateDriverStatus(userId, newStatus); // Call the API to update the status
      setIsActive(!isActive); // Toggle the local state
      Alert.alert('Success', `Driver status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update driver status', error);
      Alert.alert('Error', 'Failed to update driver status.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      <Text style={styles.title}>Driver Status</Text>
      <Image source={require('../assets/DriverBookings.jpg')} style={styles.cardImage} />
      <TouchableOpacity 
        style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]} 
        onPress={toggleActiveStatus}
      >
        <Text style={styles.buttonText}>
          {isActive ? 'Active' : 'Currently Not Active'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#f4f4f4', 
    paddingBottom: 20 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 40,
    backgroundColor: '#00bfff',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // Android shadow
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
    textAlign: 'center',
    color: '#333',
  },
  cardImage: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  activeButton: {
    backgroundColor: '#00bfff',
  },
  inactiveButton: {
    backgroundColor: '#FF7F7F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
