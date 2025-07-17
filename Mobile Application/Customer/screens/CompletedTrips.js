import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const CompletedTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrips('trips/completed', setTrips);
  }, []);

  const fetchTrips = async (endpoint, setTrips) => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get(`http://10.254.192.251:5000/api/${endpoint}`, {
        params: { userId }
      });
      setTrips(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint} trips:`, error.response ? error.response.data : error.message);
    }
  };

  const renderTrip = ({ item }) => (
    <View style={styles.tripItem}>
      <Text>{`From: ${item.Booking.B_PICKUPLOCATION} To: ${item.Booking.B_DESTLOCATION}`}</Text>
      <Text>{`Date: ${new Date(item.Booking.B_DATETIME).toDateString()}`}</Text>
      <Text>{`Status: ${item.R_STATUS}`}</Text>
      <Text>{`Driver: ${item.Driver.U_ID}`}</Text>
      <Text>{`Vehicle: ${item.Driver.Vehicle.V_MODEL} (${item.Driver.Vehicle.V_LICNUMBER})`}</Text>
      <Text>{`Fare: ${item.PaymentDetails ? item.PaymentDetails.PD_AMOUNT : 'N/A'}`}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Feedback', { ride: item })} style={styles.feedbackButton}>
          <Text style={styles.feedbackButtonText}>Give Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Help', { ride: item })} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Get Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.scene}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.R_ID.toString()}
        ListEmptyComponent={<Text style={styles.noTripsText}>No completed trips</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  feedbackButton: {
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#00bfff',
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  helpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});

export default CompletedTrips;
