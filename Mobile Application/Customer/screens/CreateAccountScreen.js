import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function CreateAccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [title, setTitle] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'http://10.254.192.251:5000/api';

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('Password too weak');
    } else if (password.length >= 6 && password.length < 10) {
      setPasswordStrength('Password could be stronger');
    } else if (password.length >= 10) {
      setPasswordStrength('Strong password');
    } else {
      setPasswordStrength('');
    }
  };

  const validateFields = () => {
    let valid = true;
    let tempErrors = {};

    if (!firstName) {
      tempErrors.firstName = 'First Name is required';
      valid = false;
    }

    if (!surname) {
      tempErrors.surname = 'Surname is required';
      valid = false;
    }

    if (!email) {
      tempErrors.email = 'Email Address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!contactNumber) {
      tempErrors.contactNumber = 'Contact Number is required';
      valid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      valid = false;
    } else if (passwordStrength === 'Password too weak') {
      tempErrors.password = 'Please choose a stronger password';
      valid = false;
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Confirm Password is required';
      valid = false;
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!title) {
      tempErrors.title = 'Please select a title';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const userData = {
        firstName,
        surname,
        email,
        contact: contactNumber,
        password,
        title,
      };
      const response = await registerUser(userData);
      console.log('User created:', response.data);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ general: 'Error creating user. Please try again.' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Account</Text>
      {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={title}
          onValueChange={(itemValue) => setTitle(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Title" value="" />
          <Picker.Item label="Mr" value="Mr" />
          <Picker.Item label="Ms" value="Ms" />
          <Picker.Item label="Mrs" value="Mrs" />
        </Picker>
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
      </View>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      {errors.surname ? <Text style={styles.errorText}>{errors.surname}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <TextInput
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        style={styles.input}
      />
      {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            checkPasswordStrength(value);
          }}
          secureTextEntry={secureTextEntry}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.eyeIcon}
        >
          <MaterialIcons name={secureTextEntry ? "visibility-off" : "visibility"} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      {passwordStrength ? <Text style={styles.passwordStrength}>{passwordStrength}</Text> : null}
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={confirmSecureTextEntry}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
          style={styles.eyeIcon}
        >
          <MaterialIcons name={confirmSecureTextEntry ? "visibility-off" : "visibility"} size={24} color="grey" />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already Registered?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
          LogIn here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#00bfff',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    color: '#333',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    paddingRight: 10,  
  },
  passwordInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, 
    padding: 5,
  },
  passwordStrength: {
    color: 'orange',
    marginBottom: 12,
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
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#777',
  },
  link: {
    color: '#00bfff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginBottom: 10,
  },
});
