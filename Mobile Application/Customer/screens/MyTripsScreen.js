import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportIncidentModal from './ReportIncidentModal'; // Import your modal component

const initialLayout = { width: Dimensions.get('window').width };

const MyTripsScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'booked', title: 'Bookings' },
    { key: 'active', title: 'Active' },
    { key: 'completed', title: 'Completed' },
  ]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  const handleIncidentReportPress = (rideId) => {
    setSelectedRideId(rideId);
    setModalVisible(true);
  };

  const fetchBookings = async (setTrips, setLoading, userId) => {
    setLoading(true);
    if (!userId) {
      console.error("User ID is not defined");
      Alert.alert("Error", "User ID is not defined. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://10.254.192.251:5000/api/bookings', {
        params: { userId },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveTrips = async (setTrips, setLoading, userId) => {
    setLoading(true);
    if (!userId) {
      console.error("User ID is not defined");
      Alert.alert("Error", "User ID is not defined. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://10.254.192.251:5000/api/trips/active', {
        params: { userId },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching active trips:", error);
      Alert.alert("Error", "Failed to fetch active trips.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedTrips = async (setTrips, setLoading, userId) => {
    setLoading(true);
    if (!userId) {
      console.error("User ID is not defined");
      Alert.alert("Error", "User ID is not defined. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://10.254.192.251:5000/api/trips/completed', {
        params: { userId },
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching completed trips:", error);
      Alert.alert("Error", "Failed to fetch completed trips.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId, fetchTrips, setTrips, userId) => {
    try {
      await axios.post('http://10.254.192.251:5000/api/bookings/cancel', { bookingId });
      fetchTrips(setTrips, userId); // Refresh trips after canceling
    } catch (error) {
      console.error("Error canceling booking:", error);
      Alert.alert("Error", "Failed to cancel booking.");
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const renderTrip = ({ item }, showCancel, showChat, showReview, navigation, tripType, fetchTrips, setTrips, userId) => {
    const handleCancelPress = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => cancelBooking(item.B_ID, fetchTrips, setTrips, userId),
                },
            ],
            { cancelable: true }
        );
    };

    const handleDetailsPress = () => {
        navigation.navigate('TripDetails', { trip: item });
    };
    const handleChatPress = () => {
      const booking = item?.RideBooking?.Bookings?.[0];  // Get the first booking
    
      // Ensure the booking and the driver exist
      if (booking && booking.BookingSlot?.Driver) {
        const customer = { C_ID: booking.C_ID };  // Get customer data
        const driver = booking.BookingSlot.Driver;  // Get driver data
    
        const tripData = {
          ...item,
          Customer: customer,
          Driver: driver,
          R_ID: item.R_ID,  // Ensure you're passing the ride ID
        };
    
        navigation.navigate('ChatWithDriver', { trip: tripData });
      } else {
        Alert.alert('Error', 'Invalid trip data. Please try again.');
      }
    };
    
    const handleReviewPress = () => {
      navigation.navigate('Feedback', {
          trip: item,  // Pass the entire trip object
       });
     };

    let pickupLocation = 'N/A';
    let destLocation = 'N/A';
    let bookingDateTime = 'N/A';
    let slotDateTime = 'N/A';
    let arrivalTime = 'N/A';
    let status = 'N/A';
    let fare = 'N/A';
    let checkpoints = null;

    if (tripType === 'booked') {
        pickupLocation = item.B_PICKUPLOCATION || 'N/A';
        destLocation = item.B_DESTLOCATION || 'N/A';
        bookingDateTime = item.B_DATETIME ? formatDateTime(item.B_DATETIME) : 'N/A';
        slotDateTime = item.BookingSlot?.BS_DATETIME ? formatDate(item.BookingSlot.BS_DATETIME) : 'N/A';
        arrivalTime = item.BookingSlot?.BS_ARRIVALTIME ? formatTime(item.BookingSlot.BS_ARRIVALTIME) : 'N/A';
        status = item.B_STATUS || 'N/A';
        fare = item.totalPrice ? `R ${item.totalPrice}` : 'N/A';
    } else if (tripType === 'active') {
        const booking = item.RideBooking?.Bookings?.find(b => b.B_STATUS === 'Ride Started');

        if (booking) {
            pickupLocation = booking.B_PICKUPLOCATION || 'N/A';
            destLocation = booking.B_DESTLOCATION || 'N/A';
            bookingDateTime = booking.B_DATETIME ? formatDateTime(booking.B_DATETIME) : 'N/A';
            slotDateTime = booking.BookingSlot?.BS_DATETIME ? formatDate(booking.BookingSlot.BS_DATETIME) : 'N/A';
            arrivalTime = booking.BookingSlot?.BS_ARRIVALTIME ? formatTime(booking.BookingSlot.BS_ARRIVALTIME) : 'N/A';
            fare = booking.totalPrice ? `R ${booking.totalPrice}` : 'N/A';
        }

        status = item.R_STATUS || 'N/A';
        checkpoints = item.Route?.RouteCheckpoints?.map(cp => cp.RC_LOCATION).join(', ') || 'N/A';
    } else if (tripType === 'completed') {
        const booking = item.RideBooking?.Bookings?.find(b => b.B_STATUS === 'Completed');

        if (booking) {
            pickupLocation = booking.B_PICKUPLOCATION || 'N/A';
            destLocation = booking.B_DESTLOCATION || 'N/A';
            bookingDateTime = booking.B_DATETIME ? formatDateTime(booking.B_DATETIME) : 'N/A';
            slotDateTime = booking.BookingSlot?.BS_DATETIME ? formatDate(booking.BookingSlot.BS_DATETIME) : 'N/A';
            arrivalTime = booking.BookingSlot?.BS_ARRIVALTIME ? formatTime(booking.BookingSlot.BS_ARRIVALTIME) : 'N/A';
            fare = booking.totalPrice ? `R ${booking.totalPrice}` : 'N/A';
        }

        status = item.R_STATUS || 'N/A';
        checkpoints = item.Route?.RouteCheckpoints?.map(cp => cp.RC_LOCATION).join(', ') || 'N/A';
    }

    return (
        <View style={styles.tripItem}>
            <Text>{`From: ${pickupLocation}`}</Text>
            <Text>{`To: ${destLocation}`}</Text>
            <Text>{`Booking Date: ${bookingDateTime}`}</Text>
            <Text>{`Scheduled Date: ${slotDateTime} at ${arrivalTime}`}</Text>
            <Text>{`Status: ${status}`}</Text>
            <Text>{`Fare: ${fare}`}</Text>

{/*             {tripType !== 'booked' && checkpoints && (
                <Text>{`Checkpoints: ${checkpoints}`}</Text>
            )}
 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleDetailsPress} style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                {showChat && item?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver && (
                      <TouchableOpacity onPress={handleChatPress} style={styles.chatButton}>
                      <Text style={styles.chatButtonText}>Chat with Driver</Text>
                      </TouchableOpacity>
                )}
                     {showCancel && status === 'Confirmed' && !item.Ride && (
                    <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                {showReview && tripType === 'completed' && (
                    <TouchableOpacity onPress={handleReviewPress} style={styles.reviewButton}>
                        <Text style={styles.reviewButtonText}>Review Ride</Text>
                    </TouchableOpacity>
                )}
            </View>
            {tripType === 'active' && (
                <TouchableOpacity onPress={() => handleIncidentReportPress(item.R_ID)} style={styles.incidentButton}>
                    <Text style={styles.incidentButtonText}>Report Incident</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

  const BookedTrips = ({ navigation, userId }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (userId) {
        fetchBookings(setTrips, setLoading, userId);
      }
    }, [userId]);

    if (loading) {
      return <ActivityIndicator size="large" color="#00bfff" />;
    }

    return (
      <View style={styles.scene}>
        <FlatList
          data={trips}
          renderItem={(item) => renderTrip(item, true, false, false, navigation, 'booked', fetchBookings, setTrips, userId)}
          keyExtractor={(item) => item.B_ID.toString()}
          ListEmptyComponent={<Text style={styles.noTripsText}>No bookings</Text>}
        />
      </View>
    );
  };

  const ActiveTrips = ({ navigation, userId }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (userId) {
        fetchActiveTrips(setTrips, setLoading, userId);
      }
    }, [userId]);

    if (loading) {
      return <ActivityIndicator size="large" color="#00bfff" />;
    }

    return (
      <View style={styles.scene}>
        <FlatList
          data={trips}
          renderItem={(item) => renderTrip(item, false, true, false, navigation, 'active', fetchActiveTrips, setTrips, userId)}
          keyExtractor={(item) => item.R_ID.toString()}
          ListEmptyComponent={<Text style={styles.noTripsText}>No active trips</Text>}
        />
      </View>
    );
  };

  const CompletedTrips = ({ navigation, userId }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (userId) {
        fetchCompletedTrips(setTrips, setLoading, userId);
      }
    }, [userId]);

    if (loading) {
      return <ActivityIndicator size="large" color="#00bfff" />;
    }

    return (
      <View style={styles.scene}>
        <FlatList
          data={trips}
          renderItem={(item) => renderTrip(item, false, false, true, navigation, 'completed', fetchCompletedTrips, setTrips, userId)}
          keyExtractor={(item) => item.R_ID.toString()}
          ListEmptyComponent={<Text style={styles.noTripsText}>No completed trips</Text>}
        />
      </View>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'booked':
        return <BookedTrips navigation={navigation} userId={userId} />;
      case 'active':
        return <ActiveTrips navigation={navigation} userId={userId} />;
      case 'completed':
        return <CompletedTrips navigation={navigation} userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>My Trips</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) =>
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            labelStyle={styles.label}
          />
        }
      />
      <ReportIncidentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        rideId={selectedRideId}
        userId={userId}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 100,
    flex: 1,
    textAlign: 'center',
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'orange',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
  },
  tripItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tripText: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#00bfff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#00bfff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: '#ffa500',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  incidentButton: {
    backgroundColor: '#ff6347',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,  // Adds space between the upper buttons and this one
    width: '100%',
    alignItems: 'center',
  },
  incidentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MyTripsScreen;
