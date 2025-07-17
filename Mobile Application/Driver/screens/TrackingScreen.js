import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.254.192.251:3001/api/users/driver';
const OSRM_API_URL = 'https://router.project-osrm.org/route/v1/driving';
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

const TrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null); // Debounce state

  // Function to initialize driverId from AsyncStorage
  const initializeDriverId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`${API_URL}/getDriverId/${userId}`);
        const { driverId } = response.data;
        setDriverId(driverId);
      } else {
        setErrorMsg('No user ID found.');
      }
    } catch (error) {
      setErrorMsg('Failed to retrieve driver ID.');
    }
  };

  // Function to send updated location to the backend
  const updateDriverLocation = async (latitude, longitude) => {
    try {
      if (driverId) {
        await axios.post(`${API_URL}/updateLocation`, {
          driverId,
          latitude,
          longitude,
        });
        console.log('Driver location updated in the database.');
      } else {
        console.error('Driver ID is not set.');
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  // Function to fetch route directions
  const fetchRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `${OSRM_API_URL}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      const coordinates = response.data.routes[0].geometry.coordinates.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
      setRouteCoordinates(coordinates);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch route.');
    }
  };

  // Function to start watching the driver's location and update it in the database
  const startWatchingLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Watch the driver's position and update the map and backend
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 1, // Update every 1 meter
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;

          // Update the map region
          const region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setLocation({ latitude, longitude });
          setMapRegion(region);

          // Send the updated location to the backend
          updateDriverLocation(latitude, longitude);
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
      setErrorMsg('Error watching location.');
    }
  };

  useEffect(() => {
    initializeDriverId(); // Fetch driverId from AsyncStorage and backend on mount
  }, []);

  useEffect(() => {
    if (driverId) {
      startWatchingLocation(); // Start watching location updates when driverId is available
    }
  }, [driverId]);

  const handleGetRoute = () => {
    if (startLocation && endLocation) {
      fetchRoute(startLocation, endLocation); // Fetch the route between start and end
    } else {
      Alert.alert('Error', 'Please set both start and end locations.');
    }
  };

  const searchLocation = (query, setSuggestions) => {
    if (query.length < 2) return;

    if (searchTimeout) clearTimeout(searchTimeout); // Clear the previous timeout

    // Set a new timeout for 500ms after the user stops typing
    const newTimeout = setTimeout(async () => {
      try {
        const response = await axios.get(`${NOMINATIM_API_URL}?q=${query}&format=json&addressdetails=1&limit=5&countrycodes=ZA`);
        const suggestions = response.data.map((item, index) => ({
          id: `${item.display_name}-${index}`, // Ensure a unique key by appending an index to the name
          name: item.display_name,
          latitude: item.lat,
          longitude: item.lon,
        }));
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 500); // 500ms debounce delay

    setSearchTimeout(newTimeout); // Save the new timeout
  };

  const handleSelectLocation = (location, setLocation, setSuggestions) => {
    setLocation({
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    });
    setSuggestions([]); // Clear suggestions
  };

  return (
    <View style={styles.container}>
      {!location ? (
        <ActivityIndicator size="large" color="#00bfff" />
      ) : (
        <>
          {/* Search fields and suggestions */}
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Search Start Location"
                style={styles.input}
                onChangeText={(text) => searchLocation(text, setStartSuggestions)}
              />
              <FlatList
                data={startSuggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectLocation(item, setStartLocation, setStartSuggestions)}
                  >
                    <Text style={styles.suggestion}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id} // Use unique id as the key
                style={styles.suggestionsList}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Search End Location"
                style={styles.input}
                onChangeText={(text) => searchLocation(text, setEndSuggestions)}
              />
              <FlatList
                data={endSuggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectLocation(item, setEndLocation, setEndSuggestions)}
                  >
                    <Text style={styles.suggestion}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id} // Use unique id as the key
                style={styles.suggestionsList}
              />
            </View>
          </View>

          {/* Map */}
          <MapView
            style={styles.map}
            region={mapRegion || {
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {startLocation && (
              <Marker coordinate={startLocation} title="Start Location" pinColor="green" />
            )}
            {endLocation && (
              <Marker coordinate={endLocation} title="End Location" pinColor="red" />
            )}
            {routeCoordinates.length > 0 && (
              <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={4} />
            )}
          </MapView>

          {/* Get Route Button */}
          <View style={styles.buttonContainer}>
            <Text style={styles.button} onPress={handleGetRoute}>
              Get Route
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%', // Center the map in the middle of the screen
    marginBottom: 10,
  },
  searchContainer: {
    position: 'absolute',
    top: 45,
    width: '100%',
    zIndex: 1, // Ensure the search fields are on top of everything
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 5,
    color: 'blue', // Blue text for the suggestions
  },
  suggestionsList: {
    maxHeight: 100, // Limit the height of the suggestions list
    zIndex: 2, // Ensure suggestions appear on top of everything
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#00bfff',
    color: 'white',
    padding: 15,
    borderRadius: 5,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TrackingScreen;
