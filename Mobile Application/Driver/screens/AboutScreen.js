import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

const AboutScreen = () => {
  const openWebsite = () => {
    Linking.openURL('http://10.254.192.251:3001/api/users/getAllBookingSlots'); // will replace with the actual link for the website
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Image source={require('../assets/Picture1.png')} style={styles.cardImage} />
      </TouchableOpacity>

      <Text style={styles.text}>
        This app is designed to provide drivers with a convenient and efficient way to manage their rides, view ride history, 
        read ride reviews, upload and manage driver documents, view vehicle information, manage insurance details, and more.
      </Text>
      
      <Text style={styles.text}>
        Our mission is to enhance the driving experience by providing a user-friendly platform that ensures drivers can easily 
        access all necessary information and tools to perform their duties effectively.
      </Text>
      
      <Text style={styles.text}>
        For more information or assistance, please contact our support team.
      </Text>

      {/*<TouchableOpacity onPress={openWebsite} style={styles.linkButton}>
        <Text style={styles.linkText}>Visit Our Website</Text>
      </TouchableOpacity>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { // Style for the whole screen
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: { // Style for the text
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardImage: { // Style for the image
    width: 200,
    height: 200,
  },
  linkButton: { // Style for the link button
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00bfff',
    borderRadius: 5,
  },
  linkText: { // Style for the link text
    color: 'white',
    fontSize: 16,
  },
});

export default AboutScreen;
