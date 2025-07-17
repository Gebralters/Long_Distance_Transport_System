import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import taxiIcon from '../assets/taxi-icon.jpg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { encode } from 'base64-arraybuffer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const TripDetailsScreen = ({ route, navigation }) => {
  const { trip } = route.params;
  const [driverLocation, setDriverLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [showDriverDetails, setShowDriverDetails] = useState(true);
  const [showParcelDetails, setShowParcelDetails] = useState(trip.B_TYPE === 2);
  const mapRef = useRef(null);

  useEffect(() => {
    if (trip.R_STATUS === 'Active') {
      fetchDriverLocation();
      const interval = setInterval(fetchDriverLocation, 5000); // Fetch driver location every 5 seconds
      return () => clearInterval(interval);
    }
  }, [trip]);

  const fetchDriverLocation = async () => {
    try {
      const response = await axios.get(`http://10.254.192.251:5000/api/tracking/location/${trip.R_ID}`);
      const location = response.data.location;

      if (location) {
        setDriverLocation(location);
        setPath((prevPath) => [
          ...prevPath,
          { latitude: parseFloat(location.DL_LATITUDE), longitude: parseFloat(location.DL_LONGITUDE) },
        ]);

        mapRef.current?.animateCamera({
          center: { latitude: parseFloat(location.DL_LATITUDE), longitude: parseFloat(location.DL_LONGITUDE) },
          zoom: 15,
        });
      }
    } catch (error) {
      console.error('Error fetching driver location:', error);
      Alert.alert('Error', 'Failed to fetch driver location.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const options = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    };
    return new Date(dateTime).toLocaleString('en-US', options);
  };

  const generateReceipt = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;

      page.drawText('Trip Receipt', {
        x: 50,
        y: height - 50,
        size: 24,
        font,
        color: rgb(0, 0.53, 0.71),
      });

      page.drawText(`From: ${trip.B_PICKUPLOCATION || trip.RideBooking?.Bookings[0]?.B_PICKUPLOCATION}`, {
        x: 50,
        y: height - 100,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`To: ${trip.B_DESTLOCATION || trip.RideBooking?.Bookings[0]?.B_DESTLOCATION}`, {
        x: 50,
        y: height - 120,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Booking Date: ${formatDateTime(trip.B_DATETIME || trip.RideBooking?.Bookings[0]?.B_DATETIME)}`, {
        x: 50,
        y: height - 140,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Scheduled Date & Time: ${formatDate(trip.BookingSlot?.BS_DATETIME || trip.RideBooking?.Bookings[0]?.BookingSlot?.BS_DATETIME)} at ${trip.BookingSlot?.BS_ARRIVALTIME || trip.RideBooking?.Bookings[0]?.BookingSlot?.BS_ARRIVALTIME}`, {
        x: 50,
        y: height - 160,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Status: ${trip.B_STATUS || trip.R_STATUS}`, {
        x: 50,
        y: height - 180,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Fare: R ${trip.Payments?.[0]?.PAY_AMOUNT || trip.RideBooking?.Bookings[0]?.Payments?.[0]?.PAY_AMOUNT || 'N/A'}`, {
        x: 50,
        y: height - 200,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      if (trip.Driver || trip.BookingSlot?.Driver) {
        const driver = trip.Driver || trip.BookingSlot?.Driver;

        page.drawText(`Driver Name: ${driver.User?.U_FIRSTNAME} ${driver.User?.U_SURNAME}`, {
          x: 50,
          y: height - 220,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Vehicle Model: ${driver.Vehicle?.V_MODEL}`, {
          x: 50,
          y: height - 240,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Vehicle Color: ${driver.Vehicle?.V_COLOR}`, {
          x: 50,
          y: height - 260,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Vehicle License Number: ${driver.Vehicle?.V_LICNUMBER}`, {
          x: 50,
          y: height - 280,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }

      if (trip.ParcelBookings?.length > 0) {
        const parcelBooking = trip.ParcelBookings[0];

        page.drawText(`Recipient Name: ${parcelBooking.P_RECIPIENTNAME}`, {
          x: 50,
          y: height - 300,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Recipient Contact: ${parcelBooking.P_RECIPIENTCONTACT}`, {
          x: 50,
          y: height - 320,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        page.drawText(`Parcel OTP: ${parcelBooking.P_OTP}`, {
          x: 50,
          y: height - 340,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const base64Pdf = encode(pdfBytes);
      const fileName = `${FileSystem.documentDirectory}trip_receipt.pdf`;

      await FileSystem.writeAsStringAsync(fileName, base64Pdf, { encoding: FileSystem.EncodingType.Base64 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileName, {
          mimeType: 'application/pdf',
          dialogTitle: 'Open Receipt',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to generate receipt: ${error.message}`);
      console.error('Error generating receipt:', error);
    }
  };

  const toggleDriverDetails = () => {
    setShowDriverDetails(!showDriverDetails);
  };

  const toggleParcelDetails = () => {
    setShowParcelDetails(!showParcelDetails);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      {/* Trip Information Section */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle-outline" size={20} color="#007BFF" />
          <Text style={styles.sectionTitle}>Trip Information</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="gray" />
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{trip.B_PICKUPLOCATION || trip.RideBooking?.Bookings[0]?.B_PICKUPLOCATION}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="gray" />
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{trip.B_DESTLOCATION || trip.RideBooking?.Bookings[0]?.B_DESTLOCATION}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text style={styles.label}>Booking Date:</Text>
          <Text style={styles.value}>{formatDateTime(trip.B_DATETIME || trip.RideBooking?.Bookings[0]?.B_DATETIME)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text style={styles.label}>Scheduled Date:</Text>
          <Text style={styles.value}>{formatDate(trip.BookingSlot?.BS_DATETIME || trip.RideBooking?.Bookings[0]?.BookingSlot?.BS_DATETIME)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: trip.R_STATUS === 'Active' ? 'yellow' : trip.R_STATUS === 'Completed' ? 'green' : 'red' }]}>
            {trip.B_STATUS || trip.R_STATUS}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="gray" />
          <Text style={styles.label}>Fare:</Text>
          <Text style={styles.value}>R {trip.Payments?.[0]?.PAY_AMOUNT || trip.RideBooking?.Bookings[0]?.Payments?.[0]?.PAY_AMOUNT || 'N/A'}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity onPress={toggleDriverDetails} style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={20} color="#007BFF" />
          <Text style={styles.sectionTitle}>Driver Information</Text>
          <Ionicons name={showDriverDetails ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#007BFF" />
        </TouchableOpacity>

        {/* Check if driver information exists in Bookings via BookingSlot */}
        {showDriverDetails && (trip?.BookingSlot?.Driver || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver) ? (
          <>
            <View style={styles.detailItem}>
              <Image
                source={{ uri: trip?.BookingSlot?.Driver?.DProfile?.DP_PICURL || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.DProfile?.DP_PICURL }}
                style={styles.driverImage}
              />
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>
                {trip?.BookingSlot?.Driver?.User?.U_FIRSTNAME || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.User?.U_FIRSTNAME}{' '}
                {trip?.BookingSlot?.Driver?.User?.U_SURNAME || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.User?.U_SURNAME}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Vehicle Model:</Text>
              <Text style={styles.value}>
                {trip?.BookingSlot?.Driver?.Vehicle?.V_MODEL || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.Vehicle?.V_MODEL}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Vehicle Color:</Text>
              <Text style={styles.value}>
                {trip?.BookingSlot?.Driver?.Vehicle?.V_COLOR || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.Vehicle?.V_COLOR}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Vehicle License Number:</Text>
              <Text style={styles.value}>
                {trip?.BookingSlot?.Driver?.Vehicle?.V_LICNUMBER || trip?.RideBooking?.Bookings?.[0]?.BookingSlot?.Driver?.Vehicle?.V_LICNUMBER}
              </Text>
            </View>
          </>
        ) : (
          showDriverDetails && (
            <View style={styles.detailItem}>
              <Text style={styles.value}>No driver assigned yet</Text>
            </View>
          )
        )}
      </Card>

      {/* Parcel Details Section (Collapsible, only for Parcel Bookings) */}
      {trip.B_TYPE === 2 && (
        <Card style={styles.card}>
          <TouchableOpacity onPress={toggleParcelDetails} style={styles.cardHeader}>
            <Ionicons name="cube-outline" size={20} color="#007BFF" />
            <Text style={styles.sectionTitle}>Parcel Details</Text>
            <Ionicons name={showParcelDetails ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#007BFF" />
          </TouchableOpacity>
          {showParcelDetails && trip.ParcelBookings?.length > 0 && (
            <>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Recipient Name:</Text>
                <Text style={styles.value}>{trip.ParcelBookings[0].P_RECIPIENTNAME}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Recipient Contact:</Text>
                <Text style={styles.value}>{trip.ParcelBookings[0].P_RECIPIENTCONTACT}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Parcel OTP:</Text>
                <Text style={styles.value}>{trip.ParcelBookings[0].P_OTP}</Text>
              </View>
            </>
          )}
        </Card>
      )}

      {/* Display map for active trips */}
      {trip.R_STATUS === 'Active' && driverLocation && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Driver's Current Location</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(driverLocation.DL_LATITUDE),
              longitude: parseFloat(driverLocation.DL_LONGITUDE),
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Polyline coordinates={path} strokeColor="#007BFF" strokeWidth={3} />
            <Marker coordinate={{ latitude: parseFloat(driverLocation.DL_LATITUDE), longitude: parseFloat(driverLocation.DL_LONGITUDE) }}>
              <Image source={taxiIcon} style={styles.taxiIcon} />
            </Marker>
          </MapView>
        </Card>
      )}

      {/* Download Receipt */}
      <TouchableOpacity style={styles.receiptButton} onPress={generateReceipt}>
        <Text style={styles.receiptButtonText}>Download Receipt</Text>
      </TouchableOpacity>

      {/* Completed Trip Actions */}
      {(trip.R_STATUS === 'Completed' || trip.B_STATUS === 'Completed') && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Feedback', { trip })}>
            <Text style={styles.buttonText}>Rate Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help', { trip })}>
            <Text style={styles.buttonText}>Get Help</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  map: {
    height: 200,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  taxiIcon: {
    width: 40,
    height: 40,
  },
  receiptButton: {
    marginTop: 20,
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  receiptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TripDetailsScreen;
