import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import StatusBar from '../components/StatusBar';

export default function PaymentScreen({ route, navigation }) {
  const { ride, bookingId, totalPrice, bookingType, pickupLocation, destLocation } = route.params; 
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [savePayment, setSavePayment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [savedPaymentDetails, setSavedPaymentDetails] = useState([]);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);

  // Fetch the userId from AsyncStorage and payment details
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          console.log('Fetched userId:', id);
          fetchSavedPaymentDetails(id); // Fetch saved payment details
        } else {
          Alert.alert('Error', 'User ID not found. Please sign in.');
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };
    getUserId();
  }, []);

// Fetch payment details from the backend
const fetchSavedPaymentDetails = async (userId) => {
  try {
    const response = await axios.get(`http://10.254.192.251:5000/api/payment/details/${userId}`);
    
    if (response.status === 200) {
      console.log('Payment Details Response:', response.data);
      
      // Check if payment details are available
      if (response.data.paymentDetails && response.data.paymentDetails.length > 0) {
        setSavedPaymentDetails(response.data.paymentDetails);
        setSelectedPaymentDetail(response.data.paymentDetails[0]); // Set default payment method
        setShowAddCard(false); // Hide the add card option if saved details exist
      } else if (response.data.message === 'No payment details found') {
        console.log('No saved payment details found.');
        setSavedPaymentDetails([]); // Reset the payment details list
        setShowAddCard(true); // Show the add card form
      }
    } else {
      throw new Error('Unexpected response from the server.');
    }
  } catch (error) {
    // Only show alert for network or unexpected errors
    if (error.response && error.response.data.message === 'No payment details found') {
      // Handle the case where no payment details are found, and don't show an alert
      console.log('No saved payment details found.');
      setSavedPaymentDetails([]);
      setShowAddCard(true); // Allow the user to add new card details
    } else {
      console.error('Error fetching payment details:', error.response?.data || error.message);
      Alert.alert('Error', 'An unexpected error occurred while retrieving payment details.');
    }
  }
};


  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (text) => {
    const formattedText = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedText);
  };

  // Format expiry date as MM/YY
  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2, 4);
    }
    setExpiryDate(formattedText);
  };

  // Handle payment process
 // Handle payment process
const handlePayment = async () => {
  if (!userId) {
    Alert.alert('Error', 'User ID not found. Please sign in.');
    return;
  }

  try {
    // Save new card details if user added a card and opted to save it
    if (showAddCard && savePayment) {
      const saveResponse = await axios.post(`http://10.254.192.251:5000/api/payment/save`, {
        userId,
        cardNumber,
        expiryDate,
        cvv,
        cardHolderName,
      });
      console.log('Saved Payment Response:', saveResponse.data);
    }

    // Process the payment
    const paymentResponse = await axios.post(`http://10.254.192.251:5000/api/payment/process`, {
      userId,
      bookingId,
      bookingType,
      paymentDetailId: showAddCard ? null : selectedPaymentDetail?.PD_ID,
    });

    console.log('Payment Response:', paymentResponse.data);
    Alert.alert('Payment Successful', 'Your payment has been processed successfully!');

    // Reset the navigation stack to navigate to 'MyTrips'
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'MyTrips' } }],
    });
  } catch (error) {
    console.error('Error processing payment:', error.response?.data || error.message);
    Alert.alert('Error', 'Could not process the payment. Please try again.');
  }
};


  const steps = ['Find a Ride', 'Available Rides', bookingType === 2 ? 'Parcel Details' : 'Traveller Details', 'Review and Pay'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Payment</Text>
      </View>
      <StatusBar steps={steps} currentStep={4} />
      <Text style={styles.infoText}>{`From: ${pickupLocation}`}</Text>
      <Text style={styles.infoText}>{`To: ${destLocation}`}</Text>
      <Text style={styles.infoText}>{`Date: ${new Date(ride.BS_DATETIME).toDateString()}`}</Text>
      <Text style={styles.infoText}>{`Total Price: R${totalPrice}`}</Text>

      {/* Show saved cards or add new card */}
      {!showAddCard && savedPaymentDetails.length > 0 ? (
        <View>
          <Text style={styles.infoText}>Saved Payment Methods:</Text>
          {savedPaymentDetails.map((detail) => (
            <TouchableOpacity
              key={detail.PD_ID}
              style={[
                styles.savedCard,
                selectedPaymentDetail && selectedPaymentDetail.PD_ID === detail.PD_ID && styles.selectedCard,
              ]}
              onPress={() => setSelectedPaymentDetail(detail)}
            >
              <Ionicons name="card-outline" size={24} color="#00bfff" style={styles.cardIcon} />
              <Text style={styles.cardText}>{`**** **** **** ${detail.PD_LAST4}`}</Text>
              <Ionicons
                name={selectedPaymentDetail && selectedPaymentDetail.PD_ID === detail.PD_ID ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedPaymentDetail && selectedPaymentDetail.PD_ID === detail.PD_ID ? '#00bfff' : '#ccc'}
                style={styles.radioIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            secureTextEntry
          />
          <View style={styles.switchContainer}>
            <Text>Save Payment Details</Text>
            <Switch value={savePayment} onValueChange={setSavePayment} />
          </View>
        </View>
      )}

      {/* Show Add Card Button */}
      {!showAddCard && (
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => setShowAddCard(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#00bfff" />
          <Text style={styles.addCardButtonText}>Add Credit Card</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    width: '110%',
    paddingTop: 50, 
    paddingBottom: 20,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
    marginTop: -20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 70,
    marginRight: 145,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedCard: {
    borderColor: '#00bfff',
    backgroundColor: '#e6f7ff',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
  },
  radioIcon: {
    marginLeft: 10,
  },
  input: {
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addCardButtonText: {
    marginLeft: 10,
    color: '#00bfff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
