import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileOptionsModal({ visible, onClose, navigation }) {
  const [loading, setLoading] = useState(false); // State to handle loading indicator

  const handleLogout = async () => {
    try {
      setLoading(true); // Start loading
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }

      // Make API request to log out the user
      await axios.post('http://10.254.192.251:5000/api/logout', { userId });

      // Remove the user's data from AsyncStorage after successful logout
      await AsyncStorage.removeItem('userFirstName');
      await AsyncStorage.removeItem('userLastName');
      await AsyncStorage.removeItem('userId');

      // Navigate back to the SignIn screen
      onClose(); // Close the modal
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Profile Options</Text>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onClose();
              navigation.navigate('EditProfile');
            }}
          >
            <Text style={styles.modalOptionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onClose();
              navigation.navigate('ChangePassword');
            }}
          >
            <Text style={styles.modalOptionText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onClose();
              navigation.navigate('NotificationSettings');
            }}
          >
            <Text style={styles.modalOptionText}>Notification Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onClose();
              navigation.navigate('PrivacySettings');
            }}
          >
            <Text style={styles.modalOptionText}>Privacy Settings</Text>
          </TouchableOpacity>

          {/* Logout Option */}
          <TouchableOpacity
            style={styles.modalOption}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={styles.modalOptionText}>{loading ? 'Logging out...' : 'Logout'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00bfff',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
