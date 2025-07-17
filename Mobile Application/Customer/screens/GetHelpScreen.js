import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'; // Added TouchableOpacity import
import Ionicons from '@expo/vector-icons/Ionicons';

const GetHelpScreen = ({ route, navigation }) => {
  const { topic, answer, showContactSupport } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{topic}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.answer}>{answer}</Text>

        {/* Show "Contact Support" button only for the "Other" topic */}
        {showContactSupport && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactSupport')}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#00bfff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GetHelpScreen;
