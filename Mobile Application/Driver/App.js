import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import CreateAccountScreen from './screens/CreateAccountScreen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import ActiveRidesScreen from './screens/ActiveRidesScreen';
import AccountScreen from './screens/AccountScreen';
import ServicesScreen from './screens/ServicesScreen';
import CheckPointScreen from './screens/CheckPointScreen';
import DriverProfileScreen from './screens/DriverProfileScreen';
import IncidentScreen from './screens/IncidentScreen';
import VehicleInformationScreen from './screens/VehicleInformationScreen';
import DriverStatusScreen from './screens/DriverStatusScreen';
import AboutScreen from './screens/AboutScreen';
import DriverDocumentsScreen from './screens/DriverDocumentsScreen';
import RideReviewsScreen from './screens/RideReviewsScreen';
import RidesHistoryScreen from './screens/RidesHistoryScreen';
import BookingSlotDetails from './screens/BookingSlotDetails';
import MessageCustomerScreen from './screens/MessageCustomerScreen';
import EditDriverProfileScreen from './screens/EditDriverProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import ContactSupportScreen from './screens/ContactSupportScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import TravelLogScreen from './screens/TravelLogScreen';
import TrackingScreen from './screens/TrackingScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import DriverChallengesScreen from './screens/DriverChallengesScreen';
import VehicleChecklistScreen from './screens/VehicleChecklistScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Active Rides"
        component={ActiveRidesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-grid" size={size} color={color} />
          ),
        }}

      />
      
      <Tab.Screen
        name="Maps"
        component={TrackingScreen} // Link to the new TrackingScreen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActiveRides"
          component={ActiveRidesScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="CheckPoint"
          component={CheckPointScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Incident"
          component={IncidentScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="VehicleInformation"
          component={VehicleInformationScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DriverStatus"
          component={DriverStatusScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="DriverDocuments"
          component={DriverDocumentsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="RideReviews"
          component={RideReviewsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="RidesHistory"
          component={RidesHistoryScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="BookingSlotDetails"
          component={BookingSlotDetails}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="MessageCustomer"
          component={MessageCustomerScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="EditDriverProfile"
          component={EditDriverProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="PrivacySettings"
          component={PrivacySettingsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="HelpCenter"
          component={HelpCenterScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ContactSupport"
          component={ContactSupportScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationDetails"
          component={NotificationDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TravelLog"
          component={TravelLogScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTPScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverChallenges"
          component={DriverChallengesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VehicleChecklist"
          component={VehicleChecklistScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
