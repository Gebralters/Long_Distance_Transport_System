import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDriverProfile, updateDriverProfile } from '../api/users';

const defaultProfilePic = require('../assets/profilepic.jpg');

export default function EditDriverProfileScreen({ navigation, route }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profilePic, setProfilePic] = useState(defaultProfilePic);
  const [loading, setLoading] = useState(true);
  const userId = route.params.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getDriverProfile(userId);
        setFirstName(profileData.U_FIRSTNAME);
        setLastName(profileData.U_SURNAME);
        setEmail(profileData.U_EMAIL);
        setTitle(profileData.U_TITLE);
        setContactNumber(profileData.U_CONTACT);
        if (profileData.DP_PICURL) {
          setProfilePic({ uri: `http://10.254.192.251:3001${profileData.DP_PICURL}` });
        }
      } catch (error) {
        console.error('Error fetching driver profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        userId,
        firstName,
        lastName,
        email,
        title,
        contactNumber,
        profilePic: profilePic.uri.includes('http') ? null : profilePic.uri,
      };
      await updateDriverProfile(updatedProfile);

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00bfff" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
            <Text style={styles.photoButtonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
        <Image source={profilePic} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            style={styles.input}
          />
        </View>
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
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#00bfff',
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
