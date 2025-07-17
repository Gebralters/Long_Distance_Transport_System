import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ManagePaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = 'http://10.254.192.251:5000/api';

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.get(`${BASE_URL}/payments/${userId}`);
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>Booking ID: {item.B_ID}</Text>
      <Text style={styles.paymentText}>Amount: {item.PAY_AMOUNT} ZAR</Text>
      <Text style={styles.paymentText}>Status: {item.status || 'Paid'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00bfff" />
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.PAY_ID.toString()} // Use PAY_ID as the unique key
          ListEmptyComponent={<Text style={styles.emptyText}>No payments found</Text>}
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
  header: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  paymentItem: {
    backgroundColor: '#DAE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
