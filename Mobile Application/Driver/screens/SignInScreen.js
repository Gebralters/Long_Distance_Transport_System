import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSplashLoading, setIsSplashLoading] = useState(true); // State for splash screen loading


  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsSplashLoading(false); 
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://10.254.192.251:3001/api/users/getUser', {
        U_EMAIL: email,
        U_PASSWORD: password,
      });
      console.log('User authenticated:', response.data);

      const { U_ID, U_FIRSTNAME, U_SURNAME, U_EMAIL, U_CONTACT, U_USERTYPE, U_REGDATE } = response.data.user;

      await AsyncStorage.setItem('userId', U_ID.toString());
      await AsyncStorage.setItem('userFirstName', U_FIRSTNAME);
      await AsyncStorage.setItem('userSurname', U_SURNAME);
      await AsyncStorage.setItem('userEmail', U_EMAIL);
      await AsyncStorage.setItem('userContact', U_CONTACT);
      await AsyncStorage.setItem('userType', U_USERTYPE.toString());
      await AsyncStorage.setItem('userRegDate', U_REGDATE);

      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Error signing in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (isSplashLoading) {
    // Show splash screen with logo
    return (
      <View style={styles.splashContainer}>
        <Image source={require('../assets/logo.jpg')} style={styles.splashLogo} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#00bfff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.footerText}>
        New to ComfortCruize?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')}>
          Register
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
  logo: {
    width: 180,
    height: 200,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#00bfff',
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
    marginTop: 10,
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
  // Splash screen styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashLogo: {
    width: 200,
    height: 200,
  },
});
