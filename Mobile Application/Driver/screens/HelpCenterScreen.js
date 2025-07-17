import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const faqs = [
  {
    question: "How do I start my trip?",
    answer: "To start your trip, make sure your route is set in the app, and then press the first check-point."
  },
  {
    question: "What should I do if I encounter an issue during my trip?",
    answer: "If you encounter any issues during your trip, you can contact support through the 'Contact Support' option in the app."
  },
  {
    question: "How do I report an incident?",
    answer: "To report an incident, go to the 'Incident' section in the app and fill out the required details."
  },
  {
    question: "Can I change my route during the trip?",
    answer: "Yes, you can change your route during the trip by going to the 'Route' section and selecting a new route."
  },
  {
    question: "How do I end my trip?",
    answer: "To end your trip, firsly you should've completed all the check points"
  }
];

export default function HelpCenterScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Help Center</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.introText}>Here you can find various resources and FAQs to help you with your journey.</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    marginLeft: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#00bfff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    margin: 16,
  },
  introText: {
    fontSize: 16,
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  answer: {
    fontSize: 16,
    marginLeft: 10,
  },
});
