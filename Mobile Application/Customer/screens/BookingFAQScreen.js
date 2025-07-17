import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BookingFAQScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.question}>How do I book a passenger ride?</Text>
      <Text style={styles.answer}>
        To book a passenger ride, follow these steps:
        {'\n\n'}1. Enter your nearest city in the search field. Our system uses a nearest city radius to accommodate ride-sharing with others near your location.
        {'\n\n'}2. After finding available rides within your area, you can select one and enter your exact pickup and drop-off locations.
        {'\n\n'}3. Choose the number of passengers and confirm your booking.
        {'\n\n'}4. Proceed to payment and enjoy your ride!
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
