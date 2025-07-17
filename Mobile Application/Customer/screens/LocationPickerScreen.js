import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Button, LogBox } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Suppress the specific warning about non-serializable values
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function LocationPickerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, onLocationSelect } = route.params; // Keep the code as it is

  const [query, setQuery] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=za`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleQueryChange = (text) => {
    setQuery(text);
    if (text.length > 2) {
      fetchLocationSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const formatAddress = (location) => {
    const address = location.address;
    const street = address.road || address.pedestrian || address.cycleway || address.footway || address.street || address.place;
    const suburb = address.suburb || address.village || address.hamlet || address.town;
    const city = address.city || address.town || address.village || address.state;
    const formatted = `${houseNumber ? houseNumber + ' ' : ''}${street}, ${suburb || ''}, ${city || ''}`;
    return formatted.trim().replace(/ ,/g, ',').replace(/  /g, ' ').replace(/,$/, '');
  };

  const handleLocationPress = (location) => {
    const formattedAddress = formatAddress(location);
    setSelectedAddress(formattedAddress);
  };

  const handleSetLocation = () => {
    if (selectedAddress) {
      if (onLocationSelect) {
        onLocationSelect(selectedAddress, type); // Call the callback function with selected address
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.disclaimer}>
        Please enter the street name and select an address. You can also enter a house or street number below.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type address..."
          value={query}
          onChangeText={handleQueryChange}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.houseNumberInput}
          placeholder="Enter house/street number"
          value={houseNumber}
          onChangeText={setHouseNumber}
        />
        {houseNumber.length > 0 && (
          <TouchableOpacity onPress={() => setHouseNumber('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleLocationPress(item)}
              style={[
                styles.suggestionItem,
                selectedAddress === formatAddress(item) && styles.selectedItem,
              ]}
            >
              <Text style={styles.suggestionText}>{formatAddress(item)}</Text>
              {selectedAddress === formatAddress(item) && (
                <Ionicons name="checkmark-circle" size={20} color="green" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}

      <Button 
        title="Set Location" 
        onPress={handleSetLocation} 
        disabled={!selectedAddress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  disclaimer: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  clearButton: {
    padding: 10,
  },
  houseNumberInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e6f7ff',
  },
  suggestionText: {
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
