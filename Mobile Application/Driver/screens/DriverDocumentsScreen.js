import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'http://10.254.192.251:3001';

export default function DriverDocumentsScreen({ route }) {
  const [driverLicenseDocument, setDriverLicenseDocument] = useState(null);
  const [driverIdentitynumberDocument, setDriverIdentitynumberDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId; // Get userId from route params

  const fetchDocuments = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'User ID is missing');
        return;
      }

      const response = await axios.get(`${API_URL}/api/users/getDocuments/${userId}`);
      
      if (response.data.DP_LICURL) {
        const licUrl = response.data.DP_LICURL.split('/').pop();
        setDriverLicenseDocument({ uri: `${API_URL}/uploads/${licUrl}` });
      }

      if (response.data.DP_URLID) {
        const idUrl = response.data.DP_URLID.split('/').pop();
        setDriverIdentitynumberDocument({ uri: `${API_URL}/uploads/${idUrl}` });
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Fetch Failed', 'There was an error fetching the documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleSaveDocument(result.assets[0].uri, type);
    }
  };

  const takePhoto = async (type) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleSaveDocument(result.assets[0].uri, type);
    }
  };

  const handleSaveDocument = async (uri, type) => {
    const formData = new FormData();
    formData.append('document', {
      uri,
      name: uri.split('/').pop(),
      type: 'image/jpeg',
    });

    try {
      await axios.post(`${API_URL}/api/users/uploadDocument`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          type,
          userId,
        },
      });

      fetchDocuments(); // Refresh documents after upload
      Alert.alert('Upload Successful', `${type} uploaded successfully.`);
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Upload Failed', `There was an error uploading the ${type}. Please try again.`);
    }
  };

  if (loading) {
    return <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00bfff" />
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Upload Your Documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Identity Number Upload Section */}
        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>Driver Identity Number</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => takePhoto('driverIdentitynumber')}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => pickImage('driverIdentitynumber')}>
              <Text style={styles.buttonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
          {driverIdentitynumberDocument && (
            <View style={styles.documentContainer}>
              <Image source={driverIdentitynumberDocument} style={styles.uploadedImage} />
            </View>
          )}
        </View>

        {/* License Upload Section */}
        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>Driver License</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => takePhoto('driverLicense')}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => pickImage('driverLicense')}>
              <Text style={styles.buttonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
          {driverLicenseDocument && (
            <View style={styles.documentContainer}>
              <Image source={driverLicenseDocument} style={styles.uploadedImage} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#00bfff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  documentCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  uploadedImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
