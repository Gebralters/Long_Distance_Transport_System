import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileOptionsModal from './ProfileOptionsModal';
import axios from 'axios';

export default function AccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://10.254.192.251:5000/api/customerProfile/${userId}`);
          
          const customerProfile = response.data;

          // Update profile data
          setFirstName(customerProfile.firstName);
          setLastName(customerProfile.lastName);

          // Check and set profile picture if available
          if (customerProfile.profilePic) {
            setProfilePicture(`http://10.254.192.251:5000${customerProfile.profilePic}`);
          } else {
            setProfilePicture(null); // No profile picture, set to null
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    // Fetch user data when the component mounts
    getUserData();

    // Add focus listener to refresh when the user navigates back to this screen
    const unsubscribe = navigation.addListener('focus', getUserData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setModalVisible(true)}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileIcon} />
        ) : (
          <Image source={require('../assets/user-profile-icon-free-vector.jpg')} style={styles.profileIcon} /> // Placeholder image
        )}
        <View>
          <Text style={styles.userName}>{firstName} {lastName}</Text>
          <Text style={styles.accountText}>My Account</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PaymentMethods')}>
        <Text style={styles.icon}>💳</Text>
        <Text style={styles.menuItemText}>Payment Methods</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('RideReviews')}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.menuItemText}>Service Reviews</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
        <Text style={styles.icon}>ℹ️</Text>
        <Text style={styles.menuItemText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.icon}>🔓</Text>
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>

      <ProfileOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 45,
    backgroundColor: '#f8f8f8',
  },
  profileIcon: {
    width: 50, 
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountText: {
    fontSize: 16,
    color: '#00bfff',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
});
