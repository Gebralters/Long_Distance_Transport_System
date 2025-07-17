import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import StatusBar from '../components/StatusBar';

export default function RideBookingScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [leavingFrom, setLeavingFrom] = useState('');
  const [goingTo, setGoingTo] = useState('');
  const [leavingFromFullAddress, setLeavingFromFullAddress] = useState('');
  const [goingToFullAddress, setGoingToFullAddress] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (currentDate < new Date()) {
      Alert.alert('Invalid Date', 'You cannot select a past date.');
      return;
    }
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDateSelected(true);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  // Handle location selection callback from LocationPickerScreen
  const handleLocationSelection = (location, type) => {
    const addressParts = location.split(',');
    const city = addressParts[addressParts.length - 1].trim();

    if (type === 'leavingFrom') {
      setLeavingFrom(city);
      setLeavingFromFullAddress(location);
    } else if (type === 'goingTo') {
      setGoingTo(city);
      setGoingToFullAddress(location);
    }
  };

  const findTickets = async () => {
    try {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

      const response = await axios.get(`http://10.254.192.251:5000/api/rides/available`, {
        params: {
          departureCity: leavingFrom,
          destinationCity: goingTo,
          travelDate: localDate,
        },
      });
      const availableRides = response.data;
      navigation.navigate('AvailableRides', { availableRides, bookingType: 1, leavingFromFullAddress, goingToFullAddress });
    } catch (error) {
      console.error('Error finding tickets:', error);
      Alert.alert('Error', 'Could not find tickets. Please try again.');
    }
  };

  const steps = ['Find a  Ride', 'Available Rides', 'Traveller Details', 'Review and Pay'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Passenger Booking</Text>
      </View>
      <StatusBar steps={steps} currentStep={1} /> 
      <Text style={styles.title}>Book Your Ride</Text>

      {/* Pickup Location */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => {
          navigation.navigate('LocationPicker', {
            type: 'leavingFrom',
            onLocationSelect: handleLocationSelection, // Passing callback function
          });
        }}
      >
        <Ionicons name="location-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={styles.inputText}>
          {leavingFromFullAddress || 'Click to set Pickup Location'}
        </Text>
      </TouchableOpacity>

      {/* Destination Location */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => {
          navigation.navigate('LocationPicker', {
            type: 'goingTo',
            onLocationSelect: handleLocationSelection, // Passing callback function
          });
        }}
      >
        <Ionicons name="location-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={styles.inputText}>
          {goingToFullAddress || 'Click to set Destination'}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
        <Ionicons name="calendar-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={[styles.datePickerText, !dateSelected && styles.placeholderText]}>
          {dateSelected ? date.toDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()} // Disable past dates
        />
      )}

      <TouchableOpacity style={styles.button} onPress={findTickets}>
        <Text style={styles.buttonText}>Find Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 25,
    paddingTop: 35,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
    textAlign: 'center',
    marginRight: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    marginHorizontal: 16,
    paddingLeft: 10,
    backgroundColor: '#f8f8f8',
  },
  inputIcon: {
    padding: 10,
  },
  inputText: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingRight: 160,
    fontSize: 16,
    marginHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  datePickerText: {
    fontSize: 16,
    color: 'black',
  },
  placeholderText: {
    color: 'gray',
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
