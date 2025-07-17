import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ServicesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize Services</Text>
      </View>

      {/* Service Section */}
      <View style={styles.content}>
        {/* Driver Support Section */}
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Driver Support</Text>
          <Image source={require('../assets/driversupport.jpg')} style={styles.cardImage} />
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('HelpCenter')}>
              <Text style={styles.optionText}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ContactSupport')}>
              <Text style={styles.optionText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* OTP Verification Section */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VerifyOTP')}>
          <Text style={styles.cardTitle}>Verify OTP</Text>
          <Image source={require('../assets/otpverification.png')} style={styles.cardImage} />
          <Text style={styles.cardDescription}>
            Verify the OTP for parcel bookings in your active rides.
          </Text>
        </TouchableOpacity>

        {/* Vehicle Checklist Section */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('VehicleChecklist')}>
          <Text style={styles.cardTitle}>Vehicle Inspection Checklist</Text>
          <Image source={require('../assets/vehiclechecklist.jpg')} style={styles.cardImage} />
          <Text style={styles.cardDescription}>
            Perform a quick check to ensure your vehicle is in good condition before starting your shift.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 37,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#f8f8f8',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // Adds subtle shadow effect
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: 150, // Reduced the height to make it smaller
    borderRadius: 5,
  },
  cardDescription: {
    padding: 12,
    fontSize: 14,
    color: '#555',
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  option: {
    backgroundColor: '#DAE2E2',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});
