import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.254.192.251:3001/api/users';

export default function MessageCustomerScreen({ route }) {
  const { contactName, rideId, senderId, recipientId, senderType } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatExists, setChatExists] = useState(false);

  useEffect(() => {
    fetchMessages(); // Initial fetch of messages

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000); // Increased interval to avoid too frequent calls

    // Clear interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchMessages = async () => {
    if (rideId && senderId && recipientId) {
      try {
        const response = await axios.get(`${API_URL}/messages/${rideId}`, {
          params: { driverId: senderType === 'driver' ? senderId : recipientId, customerId: senderType === 'driver' ? recipientId : senderId },
        });

        if (response.data.length === 0) {
          setChatExists(false); // No chat/messages yet
        } else {
          setMessages(response.data); // Messages are already sorted in ascending order in the backend
          setChatExists(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false); // Just set loading false without displaying an error
      }
    } else {
      setLoading(false);
    }
  };

  const createChatIfNotExists = async () => {
    try {
      await axios.post(`${API_URL}/createChat`, {
        driverId: senderType === 'driver' ? senderId : recipientId,
        customerId: senderType === 'driver' ? recipientId : senderId,
        rideId: rideId,
      });
    } catch (error) {
      if (error.response && error.response.data.error === 'Chat already exists for this ride') {
        console.log('Chat already exists for this ride. Proceeding to send the message.');
      }
    }
  };

  const sendMessage = async () => {
    if (message.trim().length === 0) {
      Alert.alert('Please enter a message.');
      return;
    }

    try {
      await createChatIfNotExists();

      // Send the message
      await axios.post(`${API_URL}/messages`, {
        message,
        rideId,
        driverId: senderType === 'driver' ? senderId : recipientId,
        customerId: senderType === 'driver' ? recipientId : senderId,
        senderId: senderId,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          M_CONTENT: message,
          M_USERTYPE: senderType === 'driver' ? 1 : 2, // Assign correct user type based on sender type
          M_TIME: new Date().toISOString(),
        },
      ]);

      setChatExists(true);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Could not send the message. Please try again.');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={
        item.M_USERTYPE === 1
          ? [styles.messageContainer, styles.leftAlignedMessage] // Driver message on the left
          : [styles.messageContainer, styles.rightAlignedMessage] // Customer message on the right
      }
    >
      <View
        style={
          item.M_USERTYPE === 1
            ? [styles.bubble, styles.driverBubble] // Driver bubble
            : [styles.bubble, styles.customerBubble] // Customer bubble
        }
      >
        <Text style={styles.messageText}>{item.M_CONTENT}</Text>
        <Text style={styles.timeText}>{new Date(item.M_TIME).toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat with {contactName}</Text>
      </View>

      {chatExists ? (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
          refreshing={loading}
          onRefresh={fetchMessages}
        />
      ) : (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>Start your conversation with {contactName}!</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  noMessagesText: {
    fontSize: 18,
    color: '#666',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  leftAlignedMessage: {
    justifyContent: 'flex-start', // Align driver messages to the left
  },
  rightAlignedMessage: {
    justifyContent: 'flex-end', // Align customer messages to the right
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
  },
  driverBubble: {
    backgroundColor: '#f1f0f0', // Light background for driver messages
  },
  customerBubble: {
    backgroundColor: '#00bfff', // Blue background for customer messages
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 10,
    color: '#555',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00bfff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
