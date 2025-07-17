import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import StatusBar from '../components/StatusBar';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ConfirmBookingScreen({ route, navigation }) {
  const { ride, pickupLocation, destLocation } = route.params; 
  const [numBookings, setNumBookings] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  // Handle booking number increment
  const handleIncrement = () => {
    if (numBookings + 1 > ride.BS_AVAILSEATS) {
      Alert.alert('Unavailable', `Only ${ride.BS_AVAILSEATS} seats are available to book.`);
    } else {
      setNumBookings(numBookings + 1);
    }
  };

  // Handle booking number decrement
  const handleDecrement = () => {
    if (numBookings > 1) {
      setNumBookings(numBookings - 1);
    }
  };

  const confirmBooking = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please sign in.');
      return;
    }

    // Check if the number of bookings exceeds the available seats
    if (numBookings > ride.BS_AVAILSEATS) {
      Alert.alert(
        'Not Enough Seats',
        `You are trying to book ${numBookings} seats, but only ${ride.BS_AVAILSEATS} are available. Please adjust your booking or look for another ride.`
      );
      return;
    }

    try {
      const totalPrice = ride.BS_PRICE * numBookings;  // Calculate total price for multiple passengers

      const response = await axios.post(`http://10.254.192.251:5000/api/rides/book`, {
        userId,
        bookingSlotId: ride.BS_ID,
        pickupLocation,
        destLocation,
        numBookings,
        bookingType: 1, 
        totalPrice, // Send totalPrice to the backend
      });

      const { bookingId } = response.data;
      
      navigation.navigate('Payment', { 
        ride, 
        bookingId, 
        totalPrice, 
        bookingType: 1,
        pickupLocation, 
        destLocation,
        userId, 
      });
    } catch (error) {
      console.error('Error booking ride:', error);
      Alert.alert('Error', 'Could not book the ride. Please try again.');
    }
  };

  const steps = ['Find a Ride', 'Available Rides', 'Traveller Details', 'Review and Pay'];

  // Calculate total price based on the number of bookings (passengers)
  const totalPrice = ride.BS_PRICE * numBookings;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Confirm Booking</Text>
      </View>
      <StatusBar steps={steps} currentStep={3} />
      <Text style={styles.infoText}>{`Pickup Location: ${pickupLocation}`}</Text>
      <Text style={styles.infoText}>{`Destination: ${destLocation}`}</Text>
      <Text style={styles.infoText}>{`Ride: ${ride.BS_PICKUPRADIUS} to ${ride.BS_DESTRADIUS}`}</Text>
      <Text style={styles.infoText}>{`Date: ${new Date(ride.BS_DATETIME).toDateString()}`}</Text>
      <Text style={styles.infoText}>{`Total Price: R ${totalPrice.toFixed(2)}`}</Text>
      <View style={styles.passengerContainer}>
        <Text style={styles.passengerText}>Passengers</Text>
        <View style={styles.passengerControl}>
          <TouchableOpacity 
            onPress={handleDecrement} 
            style={styles.passengerButton} 
            disabled={numBookings <= 1}
          >
            <Text style={styles.passengerButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.passengerCount}>{numBookings}</Text>
          <TouchableOpacity 
            onPress={handleIncrement} 
            style={styles.passengerButton}
          >
            <Text style={styles.passengerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={confirmBooking}>
        <Text style={styles.buttonText}>
          Complete Booking <Ionicons name="arrow-forward" size={16} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -15,
  },
  header: {
    width: '110%',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 40,
    marginRight: 100,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  passengerText: {
    fontSize: 16,
    color: 'black',
  },
  passengerControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerButton: {
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 5,
  },
  passengerButtonText: {
    color: 'white',
    fontSize: 20,
  },
  passengerCount: {
    marginHorizontal: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
