import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

export default function HelpTopicScreen({ navigation }) {
  const [faqCategories, setFaqCategories] = useState([]); // State to hold FAQ categories
  const [loading, setLoading] = useState(true); // State to handle loading indicator
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Fetch FAQ categories from the backend
  useEffect(() => {
    axios.get('http://10.254.192.251:5000/api/faqs/categories')
      .then(response => {
        setFaqCategories(response.data);
        setFilteredCategories(response.data); // Initialize filtered categories
        setLoading(false); // Data fetched, stop loading
      })
      .catch(error => {
        console.error('Error fetching FAQ categories:', error);
        setLoading(false); // Stop loading in case of an error
      });
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCategories(faqCategories); // If search query is empty, show all categories
    } else {
      setFilteredCategories(
        faqCategories.filter(category =>
          category.FAQC_CONTENT.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, faqCategories]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Help</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="How can we help?"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.title}>Select your issue:</Text>
        
        {loading ? ( // Show loading indicator while fetching data
          <ActivityIndicator size="large" color="#00bfff" />
        ) : (
          filteredCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => navigation.navigate('FAQCategory', { categoryId: category.FAQC_ID })} // Pass category ID to the FAQ screen
            >
              <Text style={styles.optionText}>{category.FAQC_CONTENT}</Text>
            </TouchableOpacity>
          ))
        )}
        
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate('ContactSupport')} // Navigate to direct support screen
        >
          <Text style={styles.contactText}>Contact Us</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  contactButton: {
    marginTop: 20,
    backgroundColor: '#00bfff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
