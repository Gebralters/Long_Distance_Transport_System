import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment'; // Import moment for time formatting

const ChatWithDriverScreen = ({ route, navigation }) => {
  const { trip } = route.params;
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const initiateChat = async () => {
      if (!trip || !trip.Customer || !trip.Driver || !trip.R_ID) {
        Alert.alert('Error', 'Invalid trip data. Please try again.');
        return;
      }

      try {
        const customerId = trip.Customer.C_ID;
        const driverId = trip.Driver.D_ID;
        const response = await axios.post('http://10.254.192.251:5000/api/chat/start', {
          customerId: customerId,
          driverId: driverId,
          rideId: trip.R_ID, // Pass the ride ID here
        });

        if (response.status === 200) {
          const { chat } = response.data;
          setChatId(chat.CH_ID);
          fetchMessages(chat.CH_ID);
        } else {
          Alert.alert('Error', 'Failed to initiate chat. Please try again.');
        }
      } catch (error) {
        console.error('Error initiating chat:', error);
        Alert.alert('Error', 'Failed to initiate chat. Please try again.');
      }
    };

    const fetchMessages = async (chatId) => {
      try {
        const response = await axios.get(`http://10.254.192.251:5000/api/chat/${chatId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages.');
      }
    };

    initiateChat();
  }, [trip]);

  const sendMessage = async () => {
    if (messageText.trim() && chatId) {
      try {
        const response = await axios.post(`http://10.254.192.251:5000/api/chat/${chatId}/message`, {
          content: messageText,
          status: 'Unread',
          userType: 2, // Assuming this is the Customer's screen, set the userType to 2
        });

        if (response.status === 201) {
          setMessages([...messages, response.data.message]);
          setMessageText('');
        } else {
          Alert.alert('Error', 'Failed to send message. Please try again.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    }
  };

  // **Important Fix**: Handle time correctly by using `moment.utc()` to avoid any local timezone conversion
  const renderMessage = ({ item, index }) => {
    const previousMessage = messages[index - 1];
    const showDate = !previousMessage || moment(item.M_TIME).isAfter(moment(previousMessage.M_TIME), 'day');

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            {/* Render the date without any timezone conversion */}
            <Text style={styles.dateText}>{moment(item.M_TIME).format('MMMM Do YYYY')}</Text>
          </View>
        )}
        <View style={[styles.message, item.M_USERTYPE === 1 ? styles.driverMessage : styles.customerMessage]}>
          <Text style={styles.messageText}>{item.M_CONTENT}</Text>
          {/* Use moment.utc() and format as HH:mm to avoid any unnecessary timezone adjustment */}
          <Text style={styles.timestamp}>{moment.utc(item.M_TIME).format('HH:mm')}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Chat with Driver</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.M_ID.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 25,
    paddingTop: 35,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
    marginRight: 100,
  },
  chatContainer: {
    padding: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '75%',
    position: 'relative',
  },
  customerMessage: {
    backgroundColor: '#ADD8E6',
    alignSelf: 'flex-end',
  },
  driverMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'black',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#444',
    position: 'absolute',
    bottom: 3,
    right: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#00bfff',
    borderRadius: 5,
    padding: 10,
  },
});

export default ChatWithDriverScreen;
