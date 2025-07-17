import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CourierFAQScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.question}>How does the courier service work?</Text>
      <Text style={styles.answer}>
        Our courier service allows you to send parcels quickly and efficiently. Here's how it works:
        {'\n\n'}1. Select 'Courier Services' from the main menu.
        {'\n\n'}2. Enter the pickup and drop-off locations, as well as the recipient's details.
        {'\n\n'}3. Choose the parcel category and verification method.
        {'\n\n'}4. Confirm your booking and proceed to payment.
        {'\n\n'}5. Track your parcel's delivery status in real-time.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
  },
});
