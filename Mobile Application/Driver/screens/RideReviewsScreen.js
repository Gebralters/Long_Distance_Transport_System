import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRideReviews } from '../api/users';

const RideReviewsScreen = ({ route }) => {
  const { userId } = route.params; // Use userId from route params
  const [rideReviewsData, setRideReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideReviews = async () => {
      try {
        const reviews = await getRideReviews(userId); // Fetch reviews using userId
        setRideReviewsData(reviews);
      } catch (error) {
        console.error('Error fetching ride reviews:', error);
        Alert.alert('Error', 'Failed to fetch ride reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRideReviews();
  }, [userId]);

  const renderReview = ({ item }) => (
    <TouchableOpacity style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.riderName}>{item.riderName}</Text>
        <Text style={styles.rating}>{`${item.rating} ★`}</Text>
      </View>
      <Text style={styles.review}>{item.review}</Text>
      <Text style={styles.rideId}>{`Ride ID: ${item.rideId}`}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Loading Reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      <FlatList
        data={rideReviewsData}
        renderItem={renderReview}
        keyExtractor={(item) => item.RF_ID.toString()}
        contentContainerStyle={rideReviewsData.length === 0 ? styles.emptyContainer : null}
        ListEmptyComponent={<Text style={styles.noReviewsText}>No reviews available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  riderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  review: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  rideId: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  noReviewsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 18,
  },
});

export default RideReviewsScreen;
