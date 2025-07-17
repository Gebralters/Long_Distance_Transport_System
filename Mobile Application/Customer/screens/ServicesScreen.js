import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ServicesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Our Services</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ride Booking Options</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('FilteredRides', {
              navigationSource: 'Service', // Pass navigation source
            })}
          >
            <Ionicons name="car" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Available Rides</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courier Services</Text>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('RequestCourierService')}>
            <Ionicons name="send" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Request Courier Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('TrackCourier')}>
            <Ionicons name="location" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Track Courier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments</Text>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ManagePayments')}>
            <Ionicons name="card" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Manage Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('PendingPayments')}>
            <Ionicons name="wallet" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Pending Payments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Services</Text>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SpecialOffers')}>
            <Ionicons name="pricetags" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Special Offers and Discounts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('FeedbackReviews')}>
            <Ionicons name="chatbubbles" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Feedback and Reviews</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Support</Text>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('HelpCenter')}>
            <Ionicons name="help-circle" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ContactSupport')}>
            <Ionicons name="call" size={24} color="#00bfff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#00bfff',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
