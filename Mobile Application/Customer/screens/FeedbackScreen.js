import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AirbnbRating } from 'react-native-ratings';
import axios from 'axios';

const FeedbackScreen = ({ route, navigation }) => {
  const { trip } = route.params;
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  // Function to log details before submitting
  const logDetails = () => {
    console.log("Trip Details:", trip);
    console.log("Ride ID:", trip.R_ID);
    if (trip?.RideBooking?.Bookings?.[0]) {
      console.log("Customer ID:", trip.RideBooking.Bookings[0].C_ID);
      console.log("Pickup Location:", trip.RideBooking.Bookings[0].B_PICKUPLOCATION);
      console.log("Destination Location:", trip.RideBooking.Bookings[0].B_DESTLOCATION);
    } else {
      console.log("No Booking Details Found");
    }
  };

  const submitRating = async () => {
    try {
      // Log the details for debugging
      logDetails();
  
      // Ensure customer ID is available
      if (!trip?.RideBooking?.Bookings?.[0]?.C_ID) {
        Alert.alert('Error', 'Customer ID is missing.');
        return;
      }
  
      const customerId = trip.RideBooking.Bookings[0].C_ID;
  
      // Submit feedback
      const response = await axios.post('http://10.254.192.251:5000/api/trips/feedback', {
        rideId: trip.R_ID,
        userId: customerId,
        comments: comments,
        rating: rating,
      });
  
      // Check response status
      if (response.status === 201) {
        Alert.alert('Success', 'Feedback submitted successfully!');
        navigation.goBack();
      } else {
        console.log('Error Response Data:', response.data);
        Alert.alert('Error', 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Add detailed logging for Axios error
      if (error.response) {
        console.log('Error Response Status:', error.response.status);
        console.log('Error Response Data:', error.response.data);
        Alert.alert('Error', `Failed to submit feedback: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        console.log('No Response Received:', error.request);
        Alert.alert('Error', 'No response received from server.');
      } else {
        console.log('Error Message:', error.message);
        Alert.alert('Error', `Failed to submit feedback: ${error.message}`);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Rate Trip</Text>
      </View>
      <Text style={styles.title}>
        Rate your trip from <Text style={styles.bold}>{trip?.RideBooking?.Bookings?.[0]?.B_PICKUPLOCATION || 'N/A'}</Text> to <Text style={styles.bold}>{trip?.RideBooking?.Bookings?.[0]?.B_DESTLOCATION || 'N/A'}</Text>
      </Text>
      <AirbnbRating
        count={5}
        reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']}
        defaultRating={0}
        size={30}
        onFinishRating={setRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Comments"
        value={comments}
        onChangeText={setComments}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={submitRating}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 100,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 80,  // Adjust for header height
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
