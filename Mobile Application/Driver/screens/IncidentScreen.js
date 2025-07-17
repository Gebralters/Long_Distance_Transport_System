import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const API_URL = 'http://10.254.192.251:3001/api/users';

export default function IncidentScreen({ navigation, route }) {
  const { userId } = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTime(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const showDatepicker = () => setShowDate(true);
  const showTimepicker = () => setShowTime(true);

  const handleSubmit = async () => {
    const incidentDateTime = new Date(date.setHours(time.getHours(), time.getMinutes(), 0, 0));
    const timezoneOffset = incidentDateTime.getTimezoneOffset() * 60000;
    const adjustedDateTime = new Date(incidentDateTime.getTime() - timezoneOffset);
    const formattedDate = adjustedDateTime.toISOString().slice(0, 19).replace('T', ' ');

    const incident = {
      description,
      date: formattedDate,
      intensity: parseInt(intensity, 10),
      userId,
    };

    try {
      await axios.post(`${API_URL}/addIncident`, incident);
      Alert.alert('Success', 'Incident submitted successfully');
      setDescription('');
      setDate(new Date());
      setTime(new Date());
      setIntensity('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the incident');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Incident Report</Text>
        <Image source={require('../assets/incident.jpg')} style={styles.cardImage} />

        <TextInput
          placeholder="Describe the Incident"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <TouchableOpacity onPress={showDatepicker} style={styles.datePicker}>
          <Text style={styles.datePickerText}>Incident Date: {date.toDateString()}</Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        
        <TouchableOpacity onPress={showTimepicker} style={styles.datePicker}>
          <Text style={styles.datePickerText}>Incident Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showTime && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <TextInput
          placeholder="Rate the Severity (1-10)"
          style={styles.input}
          keyboardType="numeric"
          value={intensity}
          onChangeText={setIntensity}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Incident</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  headerText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  datePicker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
