import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';

const baseURL = 'http://10.254.192.251:3001/api/users';
const initialLayout = { width: Dimensions.get('window').width };

// Fetch rides for the user
const fetchRides = async (setRides) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    const response = await axios.get(`${baseURL}/activeRides/${userId}`);
    setRides(response.data);
  } catch (error) {
    console.error('Error fetching active rides:', error);
  }
};

// Complete the ride
const completeRide = async (rideId, setRides) => {
  try {
    await axios.put(`${baseURL}/completeRide`, { rideId });
    Alert.alert('Ride completed successfully');
    fetchRides(setRides);
  } catch (error) {
    Alert.alert('Could not complete the ride. Please try again.');
  }
};

// ActiveRides Component
const ActiveRides = ({ navigation }) => {
  const [rides, setRides] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchRides(setRides);
    }
  }, [isFocused]);

  const handleNavigateToCheckpoints = (rideId) => {
    if (!rideId) {
      Alert.alert('No active ride found');
      return;
    }
    navigation.navigate('CheckPoint', { rideId });
  };

  const handleComplete = async (rideId) => {
    if (!rideId) {
      Alert.alert('No active ride to complete');
      return;
    }
    await completeRide(rideId, setRides);
  };

  const renderRide = ({ item }) => {
    return (
      <View style={styles.rideCard}>
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

        <Text style={styles.customerHeader}>Customers:</Text>
        {item.customers && item.customers.length > 0 ? (
          item.customers.map((customer, index) => (
            <View key={`${customer.U_FIRSTNAME}-${customer.U_SURNAME}-${index}`} style={styles.customerRow}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerText}>
                  {`${customer.U_FIRSTNAME} ${customer.U_SURNAME}`}
                </Text>
                {customer.pickupLocation && (
                  <Text style={styles.customerLocation}>{`Pickup: ${customer.pickupLocation}`}</Text>
                )}
                {customer.destLocation && (
                  <Text style={styles.customerLocation}>{`Destination: ${customer.destLocation}`}</Text>
                )}
              </View>
              <TouchableOpacity
  style={styles.messageButton}
  onPress={() => {
    if (!customer.C_ID) {
      Alert.alert('Error', 'Customer ID is missing. Cannot send a message.');
      return;
    }
    if (!item.R_ID) {
      Alert.alert('Error', 'Ride ID is missing. Cannot send a message.');
      return;
    }
    navigation.navigate('MessageCustomer', {
      contactName: `${customer.U_FIRSTNAME} ${customer.U_SURNAME}`,
      rideId: item.R_ID,
      senderId: item.D_ID, // Assuming item.D_ID is the driver ID
      recipientId: customer.C_ID,
      senderType: 'driver', // Add senderType as 'driver' to indicate the driver is the sender
    });
  }}
>
  <Text style={styles.messageButtonText}>Message Customer</Text>
</TouchableOpacity>

            </View>
          ))
        ) : (
          <Text style={styles.rideText}>No customers associated</Text>
        )}

        {/* New OTP Verification Button */}
        <TouchableOpacity
          style={styles.verifyOtpButton}
          onPress={() => navigation.navigate('VerifyOTP')}
        >
          <Text style={styles.verifyOtpButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNavigateToCheckpoints(item.R_ID)}
          style={styles.navigateButton}
        >
          <Text style={styles.navigateButtonText}>Go to Checkpoints</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleComplete(item.R_ID)} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Complete Ride</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.scene}>
      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.R_ID ? item.R_ID.toString() : String(item.BS_ID)}
        ListEmptyComponent={<Text style={styles.noRidesText}>No active rides</Text>}
        contentContainerStyle={rides.length === 0 ? styles.emptyContainer : null}
      />
    </View>
  );
};

// Main ActiveRidesScreen Component with TabView
const ActiveRidesScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([{ key: 'active', title: 'Active Rides' }]);

  const renderScene = SceneMap({
    active: (props) => <ActiveRides {...props} navigation={navigation} />,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
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
  rideCard: {
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
  customerHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerText: {
    fontSize: 16,
    color: '#555',
  },
  customerLocation: {
    fontSize: 14,
    color: '#777',
  },
  messageButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#00bfff',
    borderRadius: 5,
  },
  messageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  verifyOtpButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#0FFF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  verifyOtpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navigateButton: {
    marginTop: 10,
  },
  navigateButtonText: {
    color: '#00bfff',
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00bfff',
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRidesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
});

export default ActiveRidesScreen;
