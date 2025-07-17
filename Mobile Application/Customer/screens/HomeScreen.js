import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://10.254.192.251:5000/api/notifications/unreadCount/${userId}`);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.notificationIconContainer}>
              <FontAwesome name="bell" size={24} color="white" style={styles.headerIcon} />
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RideBooking')}>
          <Text style={styles.cardTitle}>Ride Booking</Text>
          <Image source={require('../assets/RideHome.jpg')} style={styles.cardImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CourierFacility')}>
          <Text style={styles.cardTitle}>Parcel Booking</Text>
          <Image source={require('../assets/ParcelHome.png')} style={styles.cardImage} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.chatbotButton} onPress={() => navigation.navigate('HelpTopic')}>
        <Ionicons name="chatbubble" size={24} color="white" style={styles.chatbotIcon} />
        <Text style={styles.chatbotText}>Need some help?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 40,  
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 25,
  },
  headerIcon: {
    marginHorizontal: 10,
  },
  headerRightIcons: {
    flexDirection: 'row',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 45,
  },
  unreadBadge: {
    position: 'absolute',
    right: 2,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 2,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 165,
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 65,
    right: 20,
    backgroundColor: '#00bfff',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  chatbotIcon: {
    marginRight: 10,
  },
  chatbotText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
