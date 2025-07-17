import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ContactSupportScreen({ navigation }) {
  const [message, setMessage] = useState('');

  const handleEmailPress = () => {
    const email = 'mailto:ndoumpho02@gmail.com';
    Linking.openURL(email).catch((err) => console.error('Failed to open email:', err));
  };

  const handleSendInAppMessage = () => {
    if (message.trim() === '') {
      alert("Please enter a message.");
      return;
    }
    // Placeholder for sending in-app support message logic
    alert("Your message has been sent to support!");
    setMessage(''); // Clear the input after sending
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Contact Support</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.description}>Choose how you'd like to contact us:</Text>

        {/* Contact via Email */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleEmailPress}
        >
          <Text style={styles.optionText}>Contact via Email</Text>
        </TouchableOpacity>

        {/* In-app Message */}
        <Text style={styles.inAppDescription}>Or send us a message:</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline={true}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendInAppMessage}
        >
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inAppDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#00bfff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00bfff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
