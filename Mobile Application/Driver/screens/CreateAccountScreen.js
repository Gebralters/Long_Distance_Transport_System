import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function CreateAccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if contact number is exactly 10 digits
    if (contactNumber.length !== 10 || !/^\d{10}$/.test(contactNumber)) {
      setError('Contact number must be exactly 10 digits');
      return;
    }

    const formatDate = (date) => {
      const pad = (num) => (num < 10 ? '0' + num : num);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    try {
      const userData = {
        U_FIRSTNAME: firstName,
        U_SURNAME: surname,
        U_EMAIL: email,
        U_TITLE: title,
        U_CONTACT: contactNumber,
        U_PASSWORD: password,
        U_USERTYPE: 1, 
        U_REGDATE: formatDate(new Date())
      };
      console.log('Sending user data:', userData);
      const response = await axios.post('http://10.254.192.251:3001/api/users/addUser', userData);
      console.log('User created:', response.data);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      setError('Error creating user. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* Title Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={title}
            onValueChange={(itemValue) => setTitle(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Title" value="" />
            <Picker.Item label="Mr" value="Mr" />
            <Picker.Item label="Mrs" value="Mrs" />
            <Picker.Item label="Ms" value="Ms" />
          </Picker>
        </View>

        <TextInput
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={(text) => {
            // Only allow numeric input and ensure it's no more than 10 digits
            const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
            setContactNumber(formattedText);
          }}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    width: '100%',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    justifyContent: 'center',
    padding: 16,
    paddingTop: 100,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
