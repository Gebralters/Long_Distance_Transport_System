import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PaymentMethodsScreen({ navigation }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Payment Methods</Text>
      </View>
      <TouchableOpacity
        style={[styles.paymentOption, selectedPaymentMethod === 'card' && styles.selectedOption]}
        onPress={() => setSelectedPaymentMethod('card')}
      >
        <Text style={styles.paymentOptionText}>Card</Text>
      </TouchableOpacity>
      
      {selectedPaymentMethod === 'card' && (
        <View style={styles.cardDetailsContainer}>
          <TextInput
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            style={styles.input}
            secureTextEntry={true}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Card Holder Name"
            value={cardHolderName}
            onChangeText={setCardHolderName}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save Card Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#00bfff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  paymentOption: {
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#00bfff',
    backgroundColor: '#e6f7ff',
  },
  paymentOptionText: {
    fontSize: 18,
  },
  cardDetailsContainer: {
    marginTop: 16,
    padding: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
