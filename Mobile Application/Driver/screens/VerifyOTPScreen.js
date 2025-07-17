import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { verifyOtp } from '../api/users';  // Import the API function

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');  // Display verification status message
  const [statusColor, setStatusColor] = useState('');  // Store color for the status message

  const handleVerifyOTP = async () => {
    setLoading(true);
    setStatusMessage('');  // Reset the status message

    try {
      // Call the verifyOtp API function to check if the entered OTP is correct
      const response = await verifyOtp(otp);

      // If verification is successful, set the success message in green and show an alert
      if (response.message === 'Verification Successful') {
        setStatusMessage('Verification Successful');
        setStatusColor('green');  // Set color to green for success
        Alert.alert('Success', 'Verification Successful');
      }
    } catch (error) {
      // Set the failure message in red, but suppress backend error details
      setStatusMessage('Verification Unsuccessful');
      setStatusColor('red');  // Set color to red for failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>OTP Verification</Text>

        <Text style={styles.description}>Please enter the One Time Password (OTP) for the Customer Here.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        {statusMessage ? (
          <Text style={[styles.statusText, { color: statusColor }]}>{statusMessage}</Text>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#00bfff" />
        ) : (
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default VerifyOTPScreen;
