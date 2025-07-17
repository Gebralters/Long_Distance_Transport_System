import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PaymentFAQScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.question}>What payment methods are accepted?</Text>
      <Text style={styles.answer}>
        We accept a variety of card payment methods to make your transactions as convenient as possible:
        {'\n\n'}1. Credit and Debit Cards (Visa, MasterCard, etc.)
        {'\n\n'}2. Mobile Wallets (like Google Pay, Apple Pay)
        {'\n\n'}3. Bank Transfers
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
