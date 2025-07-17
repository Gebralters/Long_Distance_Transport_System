import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import StatusBar from '../components/StatusBar';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AvailableRidesScreen({ route, navigation }) {
  const { availableRides, bookingType } = route.params; // Receive bookingType from route params
  const steps = ['Find a   Ride', 'Available Rides', bookingType === 2 ? 'Parcel Details' : 'Traveller Details', 'Review and Pay'];

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return price !== undefined ? `R ${price}` : 'Price not available';
  };

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideItem} onPress={() => handleSelect(item)}>
      <View style={styles.rideDetails}>
        <View style={styles.rideInfo}>
          <Text style={[styles.rideText, styles.boldText]}>{`${item.BS_PICKUPRADIUS} to ${item.BS_DESTRADIUS}`}</Text>
          <Text style={styles.rideText}>{`Date: ${new Date(item.BS_DATETIME).toDateString()}`}</Text>
          <Text style={styles.rideText}>{`Departure Time: ${formatTime(item.BS_PICKUPTIME)}`}</Text>
        </View>
        <View style={styles.rideMeta}>
          <Text style={styles.ridePrice}>{formatPrice(item.BS_PRICE)}</Text>
          {bookingType !== 2 && <Text style={[styles.rideSeats, styles.blackText]}>{`${item.BS_AVAILSEATS} Seats`}</Text>}
        </View>
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(item)}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  // New handleSelect function
  const handleSelect = (ride) => {
    console.log("Selected ride:", ride);
    console.log("Booking type:", bookingType);
    if (bookingType === 1) {
      navigation.navigate('ConfirmBooking', { ride, bookingType, pickupLocation: route.params.leavingFromFullAddress, destLocation: route.params.goingToFullAddress });
    } else if (bookingType === 2) {
      navigation.navigate('CompleteParcelBooking', { ride, bookingType, pickupLocation: route.params.leavingFromFullAddress, destLocation: route.params.goingToFullAddress});
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Available Rides</Text>
      </View>
      <StatusBar steps={steps} currentStep={2} />
      <FlatList
        data={availableRides}
        renderItem={renderRide}
        keyExtractor={(item) => item.BS_ID.toString()}
        ListEmptyComponent={<Text style={styles.noRidesText}>No available {bookingType === 2 ? 'rides at the moment' : 'rides'}</Text>}
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
    width: '100%',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 40,
    marginRight: 100,
  },
  rideItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideInfo: {
    flex: 3,
  },
  rideMeta: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rideText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  blackText: {
    color: 'black',
  },
  ridePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  rideSeats: {
    fontSize: 16,
    color: 'black',
  },
  selectButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRidesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
});
