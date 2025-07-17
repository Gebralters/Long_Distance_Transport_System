import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const RouteDetailsScreen = ({ route }) => {
  const { route: tripRoute } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Route Name: {tripRoute.RO_NAME}</Text>
      <Text style={styles.label}>Distance: {tripRoute.RO_DISTANCE}</Text>
      <Text style={styles.label}>Number of Stops: {tripRoute.RO_NUMSTOPS}</Text>
      <FlatList
        data={tripRoute.RouteCheckpoints}
        keyExtractor={(item) => item.RC_ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.checkpointItem}>
            <Text>{`Location: ${item.RC_LOCATION}`}</Text>
            <Text>{`Status: ${item.RC_STATUS}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  checkpointItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RouteDetailsScreen;
