import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { getAllBookingSlots, getAllCustomers, acceptBookingSlot } from '../api/users';

const initialLayout = { width: Dimensions.get('window').width };

const fetchBookingSlotsAndCustomers = async (userId, setBookingSlots, setCustomers) => {
  try {
    const fetchedBookingSlots = await getAllBookingSlots(userId);
    const fetchedCustomers = await getAllCustomers(userId);
    setCustomers(fetchedCustomers);

    const availableSlots = fetchedBookingSlots.map(slot => {
      const customerCount = fetchedCustomers.filter(customer => customer.BS_ID === slot.BS_ID).length;
      return {
        ...slot,
        BS_AVAILSEATS: 5 - customerCount,
        TotalParcelPrice: slot.TotalParcelPrice ? parseFloat(slot.TotalParcelPrice) : 0,
        TotalPassengerPrice: slot.TotalPassengerPrice ? parseFloat(slot.TotalPassengerPrice) : 0,
      };
    }).filter(slot => slot.BS_STATUS === "Available");

    setBookingSlots(availableSlots);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const BookingSlotList = ({ userId, navigation }) => {
  const [bookingSlots, setBookingSlots] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchBookingSlotsAndCustomers(userId, setBookingSlots, setCustomers);
  }, [userId]);

  const handleAcceptSlot = async (slotId) => {
    try {
      await acceptBookingSlot(slotId, userId);
      Alert.alert('Success', 'Booking slot accepted successfully!');
      fetchBookingSlotsAndCustomers(userId, setBookingSlots, setCustomers);
    } catch (error) {
      console.error('Error accepting booking slot:', error);
      Alert.alert('Error', 'Failed to accept the booking slot.');
    }
  };

  const renderBookingSlot = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.row}>
        <Text style={styles.label}>Date and Time:</Text>
        <Text style={styles.value}>{new Date(item.BS_DATETIME).toLocaleString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pickup Radius:</Text>
        <Text style={styles.value}>{item.BS_PICKUPRADIUS}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Destination Radius:</Text>
        <Text style={styles.value}>{item.BS_DESTRADIUS}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Available Seats:</Text>
        <Text style={styles.value}>{item.BS_AVAILSEATS}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pickup Time:</Text>
        <Text style={styles.value}>{item.BS_PICKUPTIME}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Estimated Arrival Time:</Text>
        <Text style={styles.value}>{item.BS_ARRIVALTIME}</Text>
      </View>

      {item.TotalParcelPrice > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Total Parcel Price:</Text>
          <Text style={styles.value}>R{item.TotalParcelPrice.toFixed(2)}</Text>
        </View>
      )}

      {item.TotalPassengerPrice > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Total Passenger Price:</Text>
          <Text style={styles.value}>R{item.TotalPassengerPrice.toFixed(2)}</Text>
        </View>
      )}

      <Text style={styles.customerHeader}>Customers:</Text>
      {customers.filter(customer => customer.BS_ID === item.BS_ID).map((customer, index) => (
        <Text key={`${customer.BS_ID}-${customer.C_ID}-${index}`} style={styles.customerText}>
          {customer.U_FIRSTNAME} {customer.U_SURNAME}
        </Text>
      ))}

      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptSlot(item.BS_ID)}>
        <Text style={styles.acceptButtonText}>Accept Booking Slot</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={bookingSlots}
      renderItem={renderBookingSlot}
      keyExtractor={(item) => item.BS_ID.toString()}
      ListEmptyComponent={<Text style={styles.noRidesText}>No available booking slots currently</Text>}
      contentContainerStyle={bookingSlots.length === 0 ? styles.emptyContainer : null}
    />
  );
};

const BookingSlotDetails = ({ navigation, route }) => {
  const { userId } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([{ key: 'slots', title: 'Available Slots' }]);

  const renderScene = SceneMap({
    slots: () => <BookingSlotList userId={userId} navigation={navigation} />,
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
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: '#00bfff',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  rideItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  customerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  customerText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 3,
  },
  acceptButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#00bfff',
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRidesText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default BookingSlotDetails;
