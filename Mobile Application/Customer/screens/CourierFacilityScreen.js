import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import StatusBar from '../components/StatusBar';

export default function CourierFacilityScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [leavingFrom, setLeavingFrom] = useState('');
  const [goingTo, setGoingTo] = useState('');
  const [leavingFromFullAddress, setLeavingFromFullAddress] = useState('');
  const [goingToFullAddress, setGoingToFullAddress] = useState('');
  const [isDisclaimerVisible, setDisclaimerVisible] = useState(false); // New state for collapsible disclaimer

  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      // If the user cancels the date picker, don't trigger the past date error
      setShow(false);
      return;
    }

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

  const handleFindTicket = async () => {
    // Ensure all required fields are filled
    if (!leavingFrom || !goingTo || !dateSelected) {
      Alert.alert('Missing Fields', 'Please ensure all fields (Pickup Location, Destination, and Pickup Date) are filled.');
      return;
    }
  
    try {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
  
      console.log('Params:', { departureCity: leavingFrom, destinationCity: goingTo, travelDate: localDate });
      
      const response = await fetch(`http://10.254.192.251:5000/api/parcels/available?departureCity=${leavingFrom}&destinationCity=${goingTo}&travelDate=${localDate}`);

      const availableRides = await response.json();
  
      console.log('API Response:', availableRides);
  
      // Navigate to AvailableRides screen, whether rides are found or not
      navigation.navigate('AvailableRides', {
        availableRides: availableRides.length > 0 ? availableRides : [], // Send an empty array if no rides are found
        bookingType: 2, // 2 indicates Parcel Booking
        leavingFromFullAddress,
        goingToFullAddress,
      });
    } catch (error) {
      // Only show an alert if there's a real error in the API call, not if there are no rides.
      Alert.alert('Error', 'Unable to find tickets. Please try again later.');
      console.error('Error fetching available rides:', error);
    }
  };
  

  const steps = ['Find a  Ride', 'Available Rides', 'Parcel Details', 'Review and Pay'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Parcel Booking</Text>
      </View>
      <StatusBar steps={steps} currentStep={1} />

      {/* Collapsible Disclaimer */}
      <TouchableOpacity 
        style={styles.disclaimerHeader}
        onPress={() => setDisclaimerVisible(!isDisclaimerVisible)}
      >
        <Text style={styles.disclaimerTitle}>Important Information</Text>
        <Ionicons 
          name={isDisclaimerVisible ? "chevron-up-outline" : "chevron-down-outline"} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>
      {isDisclaimerVisible && (
        <View style={styles.disclaimerContent}>
          <Text style={styles.disclaimerText}>
          Before booking, please ensure that your parcel does not contain any of the following prohibited items:
          </Text>
          <Text style={styles.disclaimerText}>- Dangerous Goods (e.g., explosives, flammable liquids)</Text>
          <Text style={styles.disclaimerText}>- Illegal Substances or Drugs</Text>
          <Text style={styles.disclaimerText}>- Currency and other valuables</Text>
          <Text style={styles.disclaimerText}>- Live Animals or Plants</Text> 
          <Text 
            style={styles.disclaimerLink}
            onPress={() => Linking.openURL('https://thecourierguy.co.za/packaging')}
          >
            For a complete list of prohibited items, please click here.
          </Text>
        </View>
      )}

      <Text style={styles.title}>Book for Parcel Shipping</Text>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => navigation.navigate('LocationPicker', { type: 'leavingFrom', onLocationSelect: handleLocationSelection })}
      >
        <Ionicons name="location-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={styles.inputText}>
          {leavingFromFullAddress || 'Click to set Pickup Location'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => navigation.navigate('LocationPicker', { type: 'goingTo', onLocationSelect: handleLocationSelection })}
      >
        <Ionicons name="location-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={styles.inputText}>
          {goingToFullAddress || 'Click to set Destination'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
        <Ionicons name="calendar-outline" size={24} color="black" style={styles.inputIcon} />
        <Text style={[styles.datePickerText, !dateSelected && styles.placeholderText]}>
          {dateSelected ? date.toDateString() : 'Pickup Date: DDD MMM DD YYYY'}
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleFindTicket}
      >
        <Text style={styles.buttonText}>Find Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    padding: 20,
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
    paddingRight: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
    textAlign: 'center',
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
    paddingRight: 70,
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
  disclaimerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  disclaimerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  disclaimerLink: {
    color: '#00bfff',
    textDecorationLine: 'underline',
  },
});
