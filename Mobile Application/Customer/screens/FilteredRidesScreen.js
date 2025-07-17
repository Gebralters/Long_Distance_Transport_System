import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import StatusBar from '../components/StatusBar';

export default function FilteredRidesScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (filters = {}) => {
    try {
      const response = await axios.get('http://10.254.192.251:5000/api/services/availableRides', { params: filters });
      setRides(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch available rides.');
      console.error('Error fetching rides:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && selectedDate >= new Date()) {
      setDate(selectedDate);
      setDateSelected(true);
    } else {
      Alert.alert('Invalid Date', 'Please select a future date.');
    }
  };

  const applyFilters = () => {
    const filters = {};
    if (dateSelected) filters.date = date.toISOString().split('T')[0];
    if (price) filters.price = price;
    if (pickup) filters.pickup = pickup;
    if (destination) filters.destination = destination;

    fetchRides(filters);
  };

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
          <Text style={styles.ridePrice}>{formatPrice(item.BS_PASSPRICE)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(item)}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleSelect = (ride) => {
    navigation.navigate('ConfirmBooking', { ride });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Find Available Rides</Text>
      </View>

      <StatusBar steps={['Filter Rides', 'Available Rides', 'Review and Pay']} currentStep={1} />

      <View style={styles.filterSection}>
        <TextInput
          placeholder="Max Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />
        <TextInput
          placeholder="Pickup Location"
          value={pickup}
          onChangeText={setPickup}
          style={styles.input}
        />
        <TextInput
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Ionicons name="calendar-outline" size={24} color="black" />
          <Text style={[styles.dateText, !dateSelected && styles.placeholderText]}>
            {dateSelected ? date.toDateString() : 'Select Date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}
        <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
          <Text style={styles.filterButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.BS_ID.toString()}
        ListEmptyComponent={<Text style={styles.noRidesText}>No available rides found.</Text>}
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
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  filterSection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  placeholderText: {
    color: 'gray',
  },
  filterButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  ridePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
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
