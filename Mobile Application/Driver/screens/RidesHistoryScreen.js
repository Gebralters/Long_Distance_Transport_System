import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getCompletedRides } from '../api/users'; // Import the API function
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

const RidesHistoryScreen = ({ route }) => {
  const { userId } = route.params; // Use userId from route params
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const isFocused = useIsFocused(); // Track if the screen is focused

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getCompletedRides(userId); // Fetch completed rides using userId
        setCompletedRides(data);
      } catch (error) {
        console.error('Failed to fetch completed rides', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    // Only fetch the completed rides when the screen is focused
    if (isFocused) {
      fetchCompletedRides();
    }
  }, [userId, isFocused]); // Dependency array includes userId and isFocused to trigger effect when focused

  const renderCompletedRide = ({ item }) => {
    const totalParcelPrice = item.TotalParcelPrice ? Number(item.TotalParcelPrice) : 0;
    const totalPassengerPrice = item.TotalPassengerPrice ? Number(item.TotalPassengerPrice) : 0;

    return (
      <View style={styles.rideItem}>
        <View style={styles.rideDetailsRow}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.rideText}>{item.BS_PICKUPRADIUS}</Text>
        </View>
        <View style={styles.rideDetailsRow}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.rideText}>{item.BS_DESTRADIUS}</Text>
        </View>
        <View style={styles.rideDetailsRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.rideText}>{new Date(item.BS_DATETIME).toDateString()}</Text>
        </View>

        {totalParcelPrice > 0 && (
          <View style={styles.rideDetailsRow}>
            <Text style={styles.label}>Total Parcel Price:</Text>
            <Text style={styles.rideText}>R{totalParcelPrice.toFixed(2)}</Text>
          </View>
        )}

        {totalPassengerPrice > 0 && (
          <View style={styles.rideDetailsRow}>
            <Text style={styles.label}>Total Passenger Price:</Text>
            <Text style={styles.rideText}>R{totalPassengerPrice.toFixed(2)}</Text>
          </View>
        )}

        <Text style={styles.customerHeader}>Customers:</Text>
        {item.customers && item.customers.length > 0 ? (
          item.customers.map((customer, index) => (
            <View key={`${customer.U_FIRSTNAME}-${customer.U_SURNAME}-${index}`} style={styles.customerRow}>
              <Text style={styles.customerText}>
                {`${customer.U_FIRSTNAME} ${customer.U_SURNAME}`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.rideText}>No customers associated</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00bfff" />
          <Text style={styles.loadingText}>Loading Rides...</Text>
        </View>
      ) : (
        <FlatList
          data={completedRides}
          renderItem={renderCompletedRide}
          keyExtractor={(item) => item.BS_ID.toString()}
          ListEmptyComponent={<Text style={styles.noRidesText}>No completed rides</Text>}
          contentContainerStyle={completedRides.length === 0 ? styles.emptyContainer : { paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    padding: 40,
    backgroundColor: '#00bfff',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  rideItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  rideDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  rideText: {
    fontSize: 16,
    color: '#555',
  },
  noRidesText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 18,
  },
  customerHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  customerText: {
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
  },
});

export default RidesHistoryScreen;
