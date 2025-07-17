import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function NotificationDetailsScreen({ route, navigation }) {
  const { notificationId } = route.params;
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const response = await axios.get(`http://10.254.192.251:5000/api/notification/${notificationId}`);
        setNotification(response.data);

        // Mark the notification as read
        await axios.put(`http://10.254.192.251:5000/api/notifications/markAsRead/${notificationId}`);
        navigation.setParams({ refresh: true }); // Set a param to trigger refresh on back
      } catch (error) {
        console.error('Error fetching notification details:', error);
      }
    };

    fetchNotificationDetails();
  }, [notificationId]);

  if (!notification) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const notificationTimestamp = notification.NOT_TIMESTAMP ? new Date(notification.NOT_TIMESTAMP) : null;
  const formattedTimestamp = notificationTimestamp && !isNaN(notificationTimestamp) 
    ? notificationTimestamp.toLocaleString() 
    : 'Date unavailable';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Notification Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Details</Text>
        <Text style={styles.content}>{notification.NOT_CONTENT}</Text>
        <Text style={styles.timestamp}>{formattedTimestamp}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    paddingTop: 40,  
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
});