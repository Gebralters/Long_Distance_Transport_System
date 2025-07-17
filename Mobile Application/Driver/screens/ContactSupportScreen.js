import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function ContactSupportScreen() {
  const phoneNumber = '+27828352876';
  const email = 'support@comfortcruize.com';

  const handleCallPress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Contact Support</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>If you need any assistance, please contact us through the following channels:</Text>
        <Text style={styles.text}>Phone: {phoneNumber}</Text>
        <Text style={styles.text}>Email: {email}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCallPress}>
          <Text style={styles.buttonText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Text style={styles.buttonText}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    marginLeft: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#00bfff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    margin: 16,
  },
  text: {
    fontSize: 16,
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
});
