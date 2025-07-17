import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';

export default function VehicleChecklistScreen() {
  const [checklist, setChecklist] = useState({
    tirePressure: false,
    fuelLevel: false,
    lights: false,
    brakes: false,
    wipers: false,
  });

  const toggleSwitch = (item) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      [item]: !prevChecklist[item],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ComfortCruize</Text>
      </View>

      {/* Checklist Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Inspection Checklist</Text>
        <Text style={styles.sectionDescription}>
          Before starting your shift, ensure everything is in working condition.
        </Text>

        <View style={styles.item}>
          <Text style={styles.itemText}>Tire Pressure</Text>
          <Switch value={checklist.tirePressure} onValueChange={() => toggleSwitch('tirePressure')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Fuel Level</Text>
          <Switch value={checklist.fuelLevel} onValueChange={() => toggleSwitch('fuelLevel')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Lights</Text>
          <Switch value={checklist.lights} onValueChange={() => toggleSwitch('lights')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Brakes</Text>
          <Switch value={checklist.brakes} onValueChange={() => toggleSwitch('brakes')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Wipers</Text>
          <Switch value={checklist.wipers} onValueChange={() => toggleSwitch('wipers')} />
        </View>
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});
