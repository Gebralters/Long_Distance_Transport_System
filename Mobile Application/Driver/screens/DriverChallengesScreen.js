import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.254.192.251:3001'; // Replace with your API URL

export default function DriverChallengesScreen() {
  const [ridesCompleted, setRidesCompleted] = useState(0); // Store rides completed by the current driver
  const [leaderboard, setLeaderboard] = useState([]); // Store leaderboard data
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchChallengesAndLeaderboard = async () => {
      setLoading(true);
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);

        // Fetch rides completed by the current driver
        const ridesRes = await axios.get(`${API_URL}/api/users/rides/completed`, { params: { userId: id } });
        setRidesCompleted(ridesRes.data.ridesCompleted);

        // Fetch leaderboard data sorted by rides completed
        const leaderboardRes = await axios.get(`${API_URL}/api/users/leaderboard/rides`);
        setLeaderboard(leaderboardRes.data);
      } catch (error) {
        console.error('Error fetching challenges or leaderboard:', error);
        Alert.alert('Error', 'Failed to load challenges or leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallengesAndLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Driver Challenges</Text>
      </View>

      {/* Content and Leaderboard */}
      <FlatList
        ListHeaderComponent={
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚗 Current Challenge</Text>
            <Text style={styles.challengeDescription}>
              Complete 30 Rides this month to get R10,000 Bonus at the end of the month.
            </Text>
            <Text style={styles.ridesCompleted}>You have completed {ridesCompleted} rides so far.</Text>
            <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
          </View>
        }
        data={leaderboard}
        keyExtractor={(item) => item.driverId.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.leaderboardRank}>{index + 1}</Text>
            <View style={styles.leaderboardDetails}>
              <Text style={styles.leaderboardName}>{item.driverName}</Text>
              <Text style={styles.leaderboardScore}>{item.ridesCompleted} rides</Text>
            </View>
          </View>
        )}
      />
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
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute', // Fix header position
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it's above other content
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    paddingTop: 120, // Space for the fixed header
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ridesCompleted: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00bfff',
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00bfff',
    width: 40,
    textAlign: 'center',
  },
  leaderboardDetails: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  leaderboardScore: {
    fontSize: 16,
    color: '#00bfff',
  },
  loader: {
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
