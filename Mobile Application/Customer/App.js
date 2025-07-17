import 'react-native-gesture-handler';
import * as React from 'react';
import { LogBox } from 'react-native';  // Import LogBox to suppress warnings
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Import screens
import CreateAccountScreen from './screens/CreateAccountScreen';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import RideBookingScreen from './screens/RideBookingScreen';
import CourierFacilityScreen from './screens/CourierFacilityScreen';
import CompleteParcelBookingScreen from './screens/CompleteParcelBookingScreen';
import AccountScreen from './screens/AccountScreen';
import ServicesScreen from './screens/ServicesScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import MyTripsScreen from './screens/MyTripsScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import AvailableRidesScreen from './screens/AvailableRidesScreen';
import ConfirmBookingScreen from './screens/ConfirmBookingScreen';
import PaymentScreen from './screens/PaymentScreen';
import ContactSupportScreen from './screens/ContactSupportScreen';
import RouteDetailsScreen from './screens/RouteDetailsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import HelpScreen from './screens/HelpScreen';
import ChatWithDriverScreen from './screens/ChatWithDriverScreen';
import HelpTopicScreen from './screens/HelpTopicScreen';
import LocationPickerScreen from './screens/LocationPickerScreen';
import CheckPointScreen from './screens/CheckPointScreen';
import FAQCategoryScreen from './screens/FAQCategoryScreen';
import ManagePaymentsScreen from './screens/ManagePaymentsScreen';
import PendingPaymentsScreen from './screens/PendingPaymentsScreen';
import FilteredRidesScreen from './screens/FilteredRidesScreen';
import GetHelpScreen from './screens/GetHelpScreen.js';

// Suppress specific warnings using LogBox
LogBox.ignoreLogs([
  'Warning: TapRating: Support for defaultProps will be removed', // Ignore TapRating warning
]);

const HomeStack = createStackNavigator();
const ServicesStack = createStackNavigator();
const AccountStack = createStackNavigator();
const MyTripsStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="RideBooking" component={RideBookingScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="LocationPicker" component={LocationPickerScreen} options={{
        headerShown: true,
        headerTitle: 'Set Location',
        headerStyle: { backgroundColor: '#00bfff' },
        headerTintColor: '#fff',
      }} />
      <HomeStack.Screen name="CourierFacility" component={CourierFacilityScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="CompleteParcelBooking" component={CompleteParcelBookingScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="NotificationDetails" component={NotificationDetailsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="AvailableRides" component={AvailableRidesScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} /> 
      <HomeStack.Screen name="HelpTopic" component={HelpTopicScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="FAQCategory" component={FAQCategoryScreen} options={{headerShown: false }} />
      <ServicesStack.Screen name="ContactSupport" component={ContactSupportScreen} options={{headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function ServicesStackScreen() {
  return (
    <ServicesStack.Navigator>
      <ServicesStack.Screen name="ServicesHome" component={ServicesScreen} options={{ headerShown: false }} />
      <ServicesStack.Screen name="FilteredRides" component={FilteredRidesScreen} options={{ headerShown: false }} />
      <ServicesStack.Screen name="ManagePayments" component={ManagePaymentsScreen} options={{
       headerShown: true,
       headerTitle: 'Manage Payments',
       headerStyle: { backgroundColor: '#00bfff' },
       headerTintColor: '#fff',
       }} />
      <ServicesStack.Screen name="PendingPayments" component={PendingPaymentsScreen} options={{
       headerShown: true,
       headerTitle: 'Pending Payments',
       headerStyle: { backgroundColor: '#00bfff' },
       headerTintColor: '#fff',
       }} />  
    </ServicesStack.Navigator>
  );
}

function AccountStackScreen() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="AccountHome" component={AccountScreen} options={{ headerShown: false }} />
      <AccountStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ headerShown: false }} />
      <AccountStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
    </AccountStack.Navigator>
  );
}

function MyTripsStackScreen() {
  return (
    <MyTripsStack.Navigator>
      <MyTripsStack.Screen name="MyTripsHome" component={MyTripsScreen} options={{ headerShown: false }} />
      <MyTripsStack.Screen name="TripDetails" component={TripDetailsScreen} options={{ 
         headerShown: true, 
         headerTitle: 'Trip Details', 
         headerStyle: { backgroundColor: '#00bfff' }, 
         headerTintColor: '#fff' 
       }} />
      <MyTripsStack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
      <MyTripsStack.Screen name="RouteDetails" component={RouteDetailsScreen} options={{ headerShown: false }} />
      <MyTripsStack.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      <MyTripsStack.Screen name="ChatWithDriver" component={ChatWithDriverScreen} options={{ headerShown: false }} />
      <MyTripsStack.Screen name="HelpAnswer" component={GetHelpScreen} options={{ headerShown: false }}/>
      <MyTripsStack.Screen name="CheckPoint" component={CheckPointScreen} options={{ 
         headerShown: true, 
         headerTitle: 'Check-Points Submission', 
         headerStyle: { backgroundColor: '#00bfff' }, 
         headerTintColor: '#fff'  }} />
    </MyTripsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTrips"
        component={MyTripsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
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

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="SignIn">
        <RootStack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
