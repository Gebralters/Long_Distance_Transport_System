import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

export default function FAQCategoryScreen({ route, navigation }) {
  const { categoryId } = route.params; // Get categoryId from params
  const [faqs, setFaqs] = useState([]); // State to hold FAQs
  const [categoryName, setCategoryName] = useState(''); // State to hold category name
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // Fetch FAQs for the selected category
  useEffect(() => {
    axios.get(`http://10.254.192.251:5000/api/faqs/category/${categoryId}`)
      .then(response => {
        setFaqs(response.data);
        if (response.data.length > 0) {
          setCategoryName(response.data[0].FAQCategory.FAQC_CONTENT); // Set category name from the first FAQ
        }
        setLoading(false); // Data fetched, stop loading
      })
      .catch(error => {
        console.error('Error fetching FAQs:', error);
        setLoading(false); // Stop loading in case of an error
      });
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{categoryName}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? ( // Show loading indicator while fetching data
          <ActivityIndicator size="large" color="#00bfff" />
        ) : (
          faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <View key={index} style={styles.faqContainer}>
                <Text style={styles.faqQuestion}>{faq.FAQ_QUESTION}</Text>
                <Text style={styles.faqAnswer}>{faq.FAQ_ANSWER}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noFaqText}>No FAQs available for this category.</Text>
          )
        )}
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
  faqContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: 14,
    marginTop: 5,
  },
  noFaqText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
