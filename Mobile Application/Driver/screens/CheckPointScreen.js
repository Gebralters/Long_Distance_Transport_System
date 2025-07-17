import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCheckpoints, updateCheckpointStatus } from '../api/users';

export default function CheckPointScreen({ route, navigation }) {
  const { rideId } = route.params; // Get rideId from route params
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [checkpointNames, setCheckpointNames] = useState([]);
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [isCheckpointSelected, setIsCheckpointSelected] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchCheckpoints() {
      try {
        const data = await getCheckpoints(rideId, userId); // Fetch checkpoints for the ride using userId
        setCheckpointNames(data);
        setCheckedStatus(new Array(data.length).fill(false));
      } catch (error) {
        console.error('Error fetching checkpoints:', error);
      }
    }

    if (userId) {
      fetchCheckpoints(); // Fetch checkpoints only if userId is available
    }
  }, [rideId, userId]); // Added userId to dependencies

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const showTimepicker = () => {
    setShow(true);
  };

  const toggleCheckpoint = async (index, checkpointId) => {
    const newCheckedStatus = [...checkedStatus];
    newCheckedStatus[index] = !newCheckedStatus[index];
    setCheckedStatus(newCheckedStatus);

    const anySelected = newCheckedStatus.some(status => status);
    setIsCheckpointSelected(anySelected);

    if (newCheckedStatus[index]) {
      try {
        const formattedTime = time.toISOString().slice(0, 19).replace('T', ' '); // Convert time to 'YYYY-MM-DD HH:MM:SS'
        await updateCheckpointStatus(checkpointId, rideId, formattedTime, userId); // Update checkpoint status using userId
        console.log(`Checkpoint "${checkpointNames[index].RC_LOCATION}" status updated to Checked`);
      } catch (error) {
        console.error('Error updating checkpoint status:', error);
      }
    }
  };

  const handleSubmit = () => {
    if (isCheckpointSelected) {
      Alert.alert('Checkpoint submitted successfully');
    } else {
      Alert.alert('Please select at least one checkpoint before submitting.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Check-Points</Text>

        <Image source={require('../assets/CheckPoints.png')} style={styles.cardImage} />

        <View>
          {checkpointNames.map((checkpoint, index) => (
            <TouchableOpacity
              key={checkpoint.RC_ID}
              style={styles.checkpoint}
              onPress={() => toggleCheckpoint(index, checkpoint.RC_ID)}
            >
              <View style={styles.checkbox}>
                {checkedStatus[index] && <View style={styles.checkboxChecked} />}
              </View>
              <Text style={styles.checkboxLabel}>{checkpoint.RC_LOCATION}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={showTimepicker} style={styles.datePicker}>
          <Text style={styles.datePickerText}>
            Checked Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            display="default"
            onChange={onChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Check-Point</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Incident', { userId })}>
          <Text style={styles.buttonText}>Report Incident</Text>
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
    backgroundColor: '#00bfff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  datePicker: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkpoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#00bfff',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: '#00bfff',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});
