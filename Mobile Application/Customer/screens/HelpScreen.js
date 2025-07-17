import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// List of help topics with enhanced details
const helpTopics = [
  { 
    topic: 'Recovering a lost item', 
    answer: 'If you lost an item during your ride, contact the driver directly through the in-app chat feature. If the driver cannot be reached, report the issue via our support center immediately. Please note that we are not responsible for items left in the vehicle, but we will do our best to assist you in recovering your lost belongings.' 
  },
  { 
    topic: 'Ride did not happen', 
    answer: 'If your ride was booked but did not take place, first check your booking details to ensure everything is correct. If the ride didn’t happen due to an error, please contact support to either rebook your ride or request a refund. We value your time and will address this promptly.' 
  },
  { 
    topic: 'I felt unsafe', 
    answer: 'We prioritize your safety. If you felt unsafe during your ride, report the incident immediately through our support center. In case of an emergency, contact the local emergency services. Your feedback helps us improve the safety standards for all our customers.' 
  },
  { 
    topic: 'My driver was rude', 
    answer: 'We expect all our drivers to maintain professional behavior. If your driver was rude or unprofessional, please rate the driver in the feedback section and provide specific details. Additionally, you can report the issue to support for further action.' 
  },
  { 
    topic: 'Driver took a poor route', 
    answer: 'If you believe your driver took an inefficient route, feel free to let us know through the feedback section. Your feedback helps us improve navigation systems and driver training. You may also contact support if the route taken caused major delays or overcharging.' 
  },
  { 
    topic: 'Other', 
    answer: 'For any other issues or concerns not covered above, please reach out to our support center. We are here to assist you with any queries or problems you might encounter.' 
  },
];

const HelpScreen = ({ route, navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Help Topics</Text>
      </View>

      {/* Scrollable Help Topics */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {helpTopics.map((topic) => (
          <TouchableOpacity
            key={topic.topic}
            style={styles.button}
            onPress={() => {
              // If the topic is "Other", navigate to HelpAnswer with a Contact Support button
              if (topic.topic === 'Other') {
                navigation.navigate('HelpAnswer', { topic: topic.topic, answer: topic.answer, showContactSupport: true });
              } else {
                navigation.navigate('HelpAnswer', { topic: topic.topic, answer: topic.answer });
              }
            }}
          >
            <Text style={styles.buttonText}>{topic.topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  button: {
    backgroundColor: '#DAE2E2',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HelpScreen;
