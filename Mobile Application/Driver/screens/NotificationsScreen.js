import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { getNotifications, markNotificationAsRead } from '../api/users';

const NotificationsScreen = ({ navigation, route }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId; // Safely access userId

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      Alert.alert('Error', 'User ID is not available');
      navigation.goBack();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      await markNotificationAsRead(notification.NOT_ID, userId);
      navigation.navigate('NotificationDetails', { notification });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read. Please try again later.');
    }
  };

  // Helper to truncate content
  const truncateContent = (content) => {
    return content.length > 10 ? content.substring(0, 10) + '...' : content;
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)} style={styles.notificationContainer}>
      <View style={styles.notificationItem}>
        <Text style={styles.notificationType}>Type: {item.NOT_TYPE}</Text>
        <Text style={styles.notificationContent}>Content: {truncateContent(item.NOT_CONTENT)}</Text>
        <Text style={styles.notificationStatus}>Status: {item.NOT_STATUS}</Text>
        <Text style={styles.notificationTimestamp}>Time: {new Date(item.NOT_TIMESTAMP).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.length === 0 ? (
          <Text style={styles.noNotificationsText}>No notifications available</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.NOT_ID.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#00bfff',
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  notificationContainer: {
    backgroundColor: '#00bfff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  notificationType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00bfff',
    marginBottom: 5,
  },
  notificationContent: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  notificationStatus: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  notificationTimestamp: {
    fontSize: 14,
    color: '#999',
  },
  noNotificationsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
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

export default NotificationsScreen;
