import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.254.192.251:3001';

// Function to extract filename from the local file path
const extractFilenameFromPath = (path) => {
  return path.split('/').pop();
};

export default function VehicleInformationScreen({ route }) {
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId; // Get userId from route params

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        if (!userId) {
          Alert.alert('Error', 'User ID is missing');
          return;
        }

        const response = await axios.get(`${API_URL}/api/users/vehicle/${userId}`);
        const vehicleData = response.data;

        // If there's an image URL, format it to be used correctly
        if (vehicleData.V_IMGURL) {
          const filename = extractFilenameFromPath(vehicleData.V_IMGURL);
          vehicleData.V_IMGURL = `${API_URL}/uploads/${filename}`;
        }

        setVehicleInfo(vehicleData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          Alert.alert('No Vehicle Assigned', 'You are not assigned to any vehicle yet.');
          setVehicleInfo(null);
        } else {
          console.error('Failed to fetch vehicle information', error);
          Alert.alert('Error', 'Failed to fetch vehicle information. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch vehicle info immediately when the component mounts
    fetchVehicleInfo();

    // Set up a 10-second interval to refresh the vehicle information
    const interval = setInterval(() => {
      fetchVehicleInfo();
    }, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Fetching Vehicle Information...</Text>
      </View>
    );
  }

  if (!vehicleInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You are not assigned to any vehicle yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vehicle Information</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {vehicleInfo.V_IMGURL ? (
          <Image source={{ uri: vehicleInfo.V_IMGURL }} style={styles.vehicleImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No images available for this vehicle</Text>
          </View>
        )}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Capacity:</Text>
          <Text style={styles.info}>{vehicleInfo.V_CAPACITY}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.info}>{vehicleInfo.V_TYPE}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>License Number:</Text>
          <Text style={styles.info}>{vehicleInfo.V_LICNUMBER}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.info}>{vehicleInfo.V_MODEL}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Color:</Text>
          <Text style={styles.info}>{vehicleInfo.V_COLOR}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.info}>{vehicleInfo.V_STATUS}</Text>
        </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  vehicleImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  noImageContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
