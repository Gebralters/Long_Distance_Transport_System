import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function EditProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [imageFile, setImageFile] = useState(null); // New state to store the selected image file

  useEffect(() => {
    const getUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://10.254.192.251:5000/api/customerProfile/${userId}`);
          
          // Log the response to see the structure
          console.log('Customer Profile Data:', response.data);

          // Directly accessing the fields from response.data
          const customerProfile = response.data;
          setFirstName(customerProfile.firstName);
          setLastName(customerProfile.lastName);
          setContactNumber(customerProfile.contactNumber);
          setEmergencyContactName(customerProfile.emergencyContactName);
          setEmergencyContactNumber(customerProfile.emergencyContactNumber);
          setProfilePic(`http://10.254.192.251:5000${customerProfile.profilePic}`);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    getUserData();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
  
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
  
            if (!result.canceled) {
              setProfilePic(result.assets[0].uri); // Show the selected image in the UI
              setImageFile(result.assets[0]); // Store the file for uploading later
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
  
            if (!result.canceled) {
              setProfilePic(result.assets[0].uri); // Show the selected image in the UI
              setImageFile(result.assets[0]); // Store the file for uploading later
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  
  // Function to handle saving the updated profile
  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('userId');
    
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('contactNumber', contactNumber);
      formData.append('emergencyContactName', emergencyContactName);
      formData.append('emergencyContactNumber', emergencyContactNumber);
  
      // Append image only if selected
      if (imageFile) {
        formData.append('profilePic', {
          uri: imageFile.uri,
          name: `profile_${Date.now()}.jpg`, // Give a unique name to avoid conflicts
          type: 'image/jpeg',  // Ensure the type is correctly specified for the backend
        });
      }
  
      const response = await axios.put(
        `http://10.254.192.251:5000/api/customerProfile/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct headers for file upload
          },
        }
      );
  
      alert('Profile updated successfully');
      // Update the profile picture after successful save
      if (response.data.profile.CP_PICURL) {
        setProfilePic(`http://10.254.192.251:5000${response.data.profile.CP_PICURL}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="gray" />
          )}
          <Text style={styles.addPhoto}>Add Photo</Text>
        </TouchableOpacity>
        <Text style={styles.sectionLabel}>Personal Info</Text>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          style={styles.input}
        />
        <Text style={styles.sectionLabel}>Emergency Contact</Text>
        <TextInput
          placeholder="Next of Kin Name"
          value={emergencyContactName}
          onChangeText={setEmergencyContactName}
          style={styles.input}
        />
        <TextInput
          placeholder="Next of Kin Contact Number"
          value={emergencyContactNumber}
          onChangeText={setEmergencyContactNumber}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // to ensure there's space for the button when keyboard is open
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addPhoto: {
    fontSize: 18,
    color: '#00bfff',
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
