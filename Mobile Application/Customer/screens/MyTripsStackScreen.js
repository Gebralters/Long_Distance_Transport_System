import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyTripsScreen from './screens/MyTripsScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';

const MyTripsStack = createStackNavigator();

function MyTripsStackScreen() {
  return (
    <MyTripsStack.Navigator>
      <MyTripsStack.Screen 
        name="MyTripsHome" 
        component={MyTripsScreen} 
        options={{ headerShown: false }} 
      />
      <MyTripsStack.Screen 
        name="TripDetails" 
        component={TripDetailsScreen} 
        options={{ headerShown: false }} 
      />
    </MyTripsStack.Navigator>
  );
}

export default MyTripsStackScreen;
