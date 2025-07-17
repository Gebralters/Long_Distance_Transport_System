import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { markNotificationAsRead } from '../api/users';

const NotificationDetailsScreen = ({ route }) => {
  const { notification } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    markAsRead();
  }, []);

  const markAsRead = async () => {
    try {
      await markNotificationAsRead(notification.NOT_ID, notification.U_ID);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notification Details</Text>
      </View>

      {/* Notification Details */}
      <View style={styles.section}>
        {/* Content */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Content:</Text>
          <Text style={styles.content}>{notification.NOT_CONTENT}</Text>
        </View>

        {/* Time */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{new Date(notification.NOT_TIMESTAMP).toLocaleString()}</Text>
        </View>

        {/* Type */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{notification.NOT_TYPE}</Text>
        </View>

        {/* Status */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>Read</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light background color for contrast
  },
  header: {
    backgroundColor: '#00bfff', // Consistent blue color for the header
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, 
    shadowColor: '#000', 
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
  section: {
    flex: 1, // Ensures it takes up remaining screen space
    backgroundColor: '#fff', // White background for notification box
    padding: 20,  // Consistent padding for a cleaner look
    margin: 16, // More margin to prevent edge collision
    borderRadius: 15,
    borderColor: '#00bfff', // Blue border for consistency
    borderWidth: 1, // Visible border
    elevation: 3, // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  detailContainer: {
    marginBottom: 15, // Space between each detail section
  },
  label: {
    fontSize: 16,
    color: '#00bfff', // Blue color for the labels
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24, // Improves readability of content
  },
  value: {
    fontSize: 16,
    color: '#333', // Consistent color for values
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
  },
});

export default NotificationDetailsScreen;
