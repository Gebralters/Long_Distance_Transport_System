import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';

const baseURL = 'http://10.254.192.251:3001/api/users';
const initialLayout = { width: Dimensions.get('window').width };

// Fetch trips for upcoming and completed rides
const fetchTrips = async (endpoint, setTrips, userId) => {
  if (!userId) {
    console.error('No userId found');
    return;
  }
  try {
    const response = await axios.get(`${baseURL}/${endpoint}?userId=${userId}`);
    setTrips(response.data);
  } catch (error) {
    console.error(`Error fetching ${endpoint} trips:`, error);
  }
};

// Fetch available routes for a specific driver
const getRoutes = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/getRoutes`, {
      params: { userId } // Pass userId as query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

// Create a new ride (API call)
const createRide = async (bookingSlotId, routeId, userId) => {
  try {
    const response = await axios.post(`${baseURL}/createRide`, {
      bookingSlotId,
      routeId,
      userId, // Passing userId to backend instead of driverId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ride:', error);
    throw error;
  }
};

// Render individual trip items in the FlatList
const renderTrip = ({ item }, onStart, navigation, showCustomers = true, userId) => {
  const totalParcelPrice = item.TotalParcelPrice ? Number(item.TotalParcelPrice) : 0;
  const totalPassengerPrice = item.TotalPassengerPrice ? Number(item.TotalPassengerPrice) : 0;

  return (
    <View style={styles.tripCard}>
      <View style={styles.row}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.BS_PICKUPRADIUS}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.BS_DESTRADIUS}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(item.BS_DATETIME).toDateString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pickup Time:</Text>
        <Text style={styles.value}>{item.BS_PICKUPTIME}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Arrival Time:</Text>
        <Text style={styles.value}>{item.BS_ARRIVALTIME}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Available Seats:</Text>
        <Text style={styles.value}>{item.BS_AVAILSEATS}</Text>
      </View>

      {totalParcelPrice > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Total Parcel Price:</Text>
          <Text style={styles.value}>R{totalParcelPrice.toFixed(2)}</Text>
        </View>
      )}

      {totalPassengerPrice > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Total Passenger Price:</Text>
          <Text style={styles.value}>R{totalPassengerPrice.toFixed(2)}</Text>
        </View>
      )}

      {showCustomers && (
        <View style={styles.row}>
          <Text style={styles.label}>Customers:</Text>
          <Text style={styles.value}>{item.Customers || 'No customers associated'}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {item.BS_STATUS === 'Accepted' && onStart && (
          <TouchableOpacity onPress={() => onStart(item.BS_ID)} style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Upcoming rides component
const UpcomingRides = ({ userId }) => {
  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedBookingSlot, setSelectedBookingSlot] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrips('acceptedBookings', setTrips, userId);
  }, [userId]);

  const handleStart = async (bookingSlotId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const fetchedRoutes = await getRoutes(userId);  // Pass userId to getRoutes
      if (!fetchedRoutes || fetchedRoutes.length === 0) {
        Alert.alert('No routes available', 'There are no routes available for this booking slot.');
        return;
      }

      setRoutes(fetchedRoutes);
      setSelectedBookingSlot(bookingSlotId);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching routes:', error);
      Alert.alert('Error', 'Could not fetch routes. Please try again.');
    }
  };

  const handleRouteSelect = async (routeId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!selectedBookingSlot || !userId) return;

      const response = await createRide(selectedBookingSlot, routeId, userId);

      if (response.success && response.rideId) {
        await AsyncStorage.setItem('currentRideId', response.rideId.toString());

        Alert.alert('Ride started successfully');
        fetchTrips('acceptedBookings', setTrips, userId);

        navigation.navigate('ActiveRides', { rideId: response.rideId });
      } else {
        throw new Error(response.message || 'Failed to create ride');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Could not start the ride. Please try again.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.scene}>
      <FlatList
        data={trips}
        renderItem={({ item }) => renderTrip({ item }, handleStart, navigation, true, userId)}
        keyExtractor={(item) => item.BS_ID.toString()}
        ListEmptyComponent={<Text style={styles.noTripsText}>No Upcoming rides</Text>}
        contentContainerStyle={trips.length === 0 ? styles.emptyContainer : null}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Route</Text>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.RO_ID}
                style={styles.routeButton}
                onPress={() => handleRouteSelect(route.RO_ID)}
              >
                <Text style={styles.routeButtonText}>{route.RO_NAME}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Completed rides component
const CompletedRides = ({ userId }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchTrips('completedRides', setTrips, userId);
  }, [userId]);

  return (
    <View style={styles.scene}>
      <FlatList
        data={trips}
        renderItem={({ item }) => renderTrip({ item }, null, null, false, userId)}
        keyExtractor={(item) => item.BS_ID.toString()}
        ListEmptyComponent={<Text style={styles.noTripsText}>No Completed Booking slots</Text>}
        contentContainerStyle={trips.length === 0 ? styles.emptyContainer : null}
      />
    </View>
  );
};

// Main Travel Log screen with TabView
const TravelLogScreen = ({ route }) => {
  const { userId } = route.params;  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'upcoming', title: 'Accepted Slots' },
    { key: 'completed', title: 'Completed Rides' },
  ]);

  const renderScene = SceneMap({
    upcoming: () => <UpcomingRides userId={userId} />,
    completed: () => <CompletedRides userId={userId} />,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Travel Logs</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            labelStyle={styles.label}
          />
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scene: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: '#00bfff',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
  },
  tripCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  value: {
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTripsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  routeButton: {
    padding: 10,
    backgroundColor: '#00bfff',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  routeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TravelLogScreen;
