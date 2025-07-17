import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';

// PrivacySettingsScreen component
export default function PrivacySettingsScreen({ navigation }) {
  // State variables to manage privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [rideHistorySharing, setRideHistorySharing] = useState(false);
  const [contactInfoSharing, setContactInfoSharing] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);

  // Function to handle saving settings
  const handleSaveSettings = () => {
    // Logic to update the backend (placeholder)
    alert('Privacy settings saved successfully');
  };

  return (
    // ScrollView to allow scrolling if content overflows
    <ScrollView style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>

      {/* Setting item for profile visibility */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Profile Visibility</Text>
        <Switch
          value={profileVisibility}
          onValueChange={setProfileVisibility}
        />
      </View>

      {/* Setting item for receiving notifications */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Receive Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      {/* Setting item for sharing ride history */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Share Ride History</Text>
        <Switch
          value={rideHistorySharing}
          onValueChange={setRideHistorySharing}
        />
      </View>

      {/* Setting item for sharing contact info with customers */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Share Contact Info with Customers</Text>
        <Switch
          value={contactInfoSharing}
          onValueChange={setContactInfoSharing}
        />
      </View>

      {/* Setting item for sharing data with third parties */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Share Data with Third Parties</Text>
        <Switch
          value={thirdPartySharing}
          onValueChange={setThirdPartySharing}
        />
      </View>

      {/* Button to save settings */}
      <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for the PrivacySettingsScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the full available space
    backgroundColor: '#fff', // Set background color to white
    padding: 16, // Add padding to the container
  },
  header: {
    padding: 20, // Add padding to the header
    backgroundColor: '#00bfff', // Set background color to light blue
    alignItems: 'center', // Center align the content
    marginBottom: 20, // Add margin to the bottom of the header
  },
  headerText: {
    fontSize: 24, // Set font size of the header text
    fontWeight: 'bold', // Make the header text bold
    color: 'white', // Set text color to white
  },
  setting: {
    flexDirection: 'row', // Arrange settings in a row
    justifyContent: 'space-between', // Space out elements in the setting
    alignItems: 'center', // Center align elements in the setting
    paddingVertical: 15, // Add vertical padding to the setting
    borderBottomWidth: 1, // Add border to the bottom of the setting
    borderBottomColor: '#ccc', // Set border color to light grey
  },
  settingText: {
    fontSize: 18, // Set font size of the setting text
  },
  button: {
    backgroundColor: '#00bfff', // Set background color for the button
    paddingVertical: 15, // Add vertical padding to the button
    borderRadius: 5, // Make the corners of the button rounded
    marginTop: 20, // Add margin to the top of the button
    alignItems: 'center', // Center align the content of the button
  },
  buttonText: {
    color: '#fff', // Set text color of the button
    fontSize: 18, // Set font size of the button text
    fontWeight: 'bold', // Make the button text bold
  },
});
