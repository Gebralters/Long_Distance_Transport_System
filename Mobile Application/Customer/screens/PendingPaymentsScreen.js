import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PendingPaymentsScreen({ navigation }) {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = 'http://10.254.192.251:5000/api';

  useEffect(() => {
    const fetchPendingPayments = async () => {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.get(`${BASE_URL}/pendingPayments/${userId}`);
        
        // Log the response data to inspect the structure
        console.log('Pending Payments Response:', response.data);

        setPendingPayments(response.data);
      } catch (error) {
        console.error('Error fetching pending payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  const handleSettlePayment = (item) => {
    // Navigate to PaymentScreen, passing necessary parameters
    navigation.navigate('Payment', {
      ride: {
        BS_DATETIME: item.scheduledDateTime, // Pass scheduledDateTime as BS_DATETIME
      },
      bookingId: item.B_ID,
      totalPrice: item.totalPrice, // Using totalPrice from booking
      bookingType: item.bookingType,
      pickupLocation: item.pickupLocation,
      destLocation: item.destLocation,
    });
  };

  const renderPendingPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      {/* Display booking details */}
      <Text style={styles.paymentText}>From: {item.pickupLocation}</Text>
      <Text style={styles.paymentText}>To: {item.destLocation}</Text>
      <Text style={styles.paymentText}>Booking Date: {new Date(item.bookingDateTime).toLocaleString()}</Text>
      <Text style={styles.paymentText}>Scheduled Date: {item.scheduledDateTime ? new Date(item.scheduledDateTime).toLocaleString() : 'N/A'}</Text>
      <Text style={styles.paymentText}>Amount: {item.totalPrice} ZAR</Text>
      
      {/* Conditionally render parcel details if it is a parcel booking */}
      {item.bookingType === 2 && (
        <>
          <Text style={styles.paymentText}>
            Parcel Recipient: {item.P_RECIPIENTNAME}
          </Text>
          <Text style={styles.paymentText}>
            Contact: {item.P_RECIPIENTCONTACT}
          </Text>
        </>
      )}
  
      <TouchableOpacity style={styles.settleButton} onPress={() => handleSettlePayment(item)}>
        <Text style={styles.buttonText}>Settle Payment</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00bfff" />
      ) : (
        <FlatList
          data={pendingPayments}
          renderItem={renderPendingPaymentItem}
          keyExtractor={(item) => (item.B_ID ? item.B_ID.toString() : Math.random().toString())} // Use B_ID as the key
          ListEmptyComponent={<Text style={styles.emptyText}>No pending payments found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  paymentItem: {
    backgroundColor: '#DAE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  settleButton: {
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
