import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckPointScreen({ route, navigation }) {
  const [checkpoints, setCheckpoints] = useState([]);
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [isCheckpointSelected, setIsCheckpointSelected] = useState(false);

  useEffect(() => {
    const fetchCheckpointsForRide = async () => {
      try {
        const rideId = route.params.rideId; // Access the rideId from route params
        const response = await axios.get(`http://10.254.192.251:5000/api/checkpoints/${rideId}`);
        setCheckpoints(response.data);
        setCheckedStatus(new Array(response.data.length).fill(false)); // Initialize checked status array
      } catch (error) {
        console.error("Error fetching checkpoints:", error);
        Alert.alert("Error", "Failed to load checkpoints.");
      }
    };

    fetchCheckpointsForRide();
  }, [route.params.rideId]);

  const toggleCheckpoint = (index) => {
    const newCheckedStatus = [...checkedStatus];
    newCheckedStatus[index] = !newCheckedStatus[index];
    setCheckedStatus(newCheckedStatus);

    const anySelected = newCheckedStatus.some(status => status);
    setIsCheckpointSelected(anySelected);
  };

  const handleSubmit = async () => {
    if (isCheckpointSelected) {
      const selectedCheckpoints = checkpoints
        .filter((_, index) => checkedStatus[index])
        .map((checkpoint) => ({
          id: checkpoint.RC_ID,
          location: checkpoint.RC_LOCATION
        }));

      try {
        const userId = await AsyncStorage.getItem('userId');
        const rideId = route.params.rideId;

        for (const checkpoint of selectedCheckpoints) {
          await axios.post(`http://10.254.192.251:5000/api/checkpoint/checkin`, {
            checkpointId: checkpoint.id,
            rideId,
            userId,
            customerStatus: `Checked`,
          });
        }
        Alert.alert('Success', 'Checkpoints submitted successfully');
      } catch (error) {
        console.error("Error submitting checkpoints:", error);
        Alert.alert('Error', 'Failed to submit checkpoints');
      }
    } else {
      Alert.alert('Warning', 'Please select at least one checkpoint before submitting.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Road Image Header */}
        <Image source={require('../assets/route-map-clipart-6.png')} style={styles.roadImage} />

        {checkpoints.map((checkpoint, index) => (
          <TouchableOpacity
            key={checkpoint.RC_ID}
            style={styles.checkpoint}
            onPress={() => toggleCheckpoint(index)}
          >
            <View style={styles.checkbox}>
              {checkedStatus[index] && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>{checkpoint.RC_LOCATION}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Check-Point</Text>
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
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  roadImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkpoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    backgroundColor: '#00bfff',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});
