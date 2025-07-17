import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusBar from '../components/StatusBar';

export default function CompleteParcelBookingScreen({ route, navigation }) {
  const { ride, pickupLocation, destLocation } = route.params;
  const [parcelCategory, setParcelCategory] = useState('');
  const [parcelCategories, setParcelCategories] = useState([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [dimensionError, setDimensionError] = useState('');
  const [pictures, setPictures] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);

  const verificationMethods = [
    { label: 'Dimensions', value: 'dimensions' },
    { label: 'Pictures', value: 'pictures' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://10.254.192.251:5000/api/parcels/categories');
        const categories = response.data.map((category) => ({
          label: category.P_DISCRIP,
          value: category.P_CATID,
        }));
        setParcelCategories(categories);
      } catch (error) {
        console.error('Error fetching parcel categories:', error);
        Alert.alert('Error', 'Could not fetch parcel categories.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const selectedCategory = parcelCategories.find((cat) => cat.value === parcelCategory)?.label;
    if (selectedCategory && ['Documents', 'Files', 'Books'].includes(selectedCategory)) {
      setRequiresVerification(false);
      setVerificationMethod(null);
    } else {
      setRequiresVerification(true);
    }
  }, [parcelCategory, parcelCategories]);

  const handleDimensionChange = (dimension, value) => {
    setDimensions({ ...dimensions, [dimension]: value });

    if (verificationMethod === 'dimensions') {
      const length = parseFloat(dimension === 'length' ? value : dimensions.length);
      const width = parseFloat(dimension === 'width' ? value : dimensions.width);
      const height = parseFloat(dimension === 'height' ? value : dimensions.height);

      if (length > 50 || width > 50 || height > 50) {
        setDimensionError('One or more dimensions exceed the allowed size of 50 cm.');
      } else {
        setDimensionError('');
      }
    }
  };

  const pickImage = async () => {
    if (pictures.length >= 4) {
      Alert.alert('Error', 'You can only upload a maximum of 4 images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPictures([...pictures, result.assets[0].uri]);
    } else {
      Alert.alert('No selection', 'No image selected. Please try again.');
    }
  };

  const takeImage = async () => {
    if (pictures.length >= 4) {
      Alert.alert('Error', 'You can only upload a maximum of 4 images.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPictures([...pictures, result.assets[0].uri]);
    } else {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const removeImage = (index) => {
    const updatedPictures = [...pictures];
    updatedPictures.splice(index, 1);
    setPictures(updatedPictures);
  };

  const handleConfirmBooking = async () => {
    if (!recipientName || !recipientContact || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (requiresVerification && !verificationMethod) {
      Alert.alert('Error', 'Please select a verification method.');
      return;
    }

    if (verificationMethod === 'dimensions') {
      if (!dimensions.length || !dimensions.width || !dimensions.height) {
        Alert.alert('Error', 'Please provide all dimensions.');
        return;
      }
      if (dimensionError) {
        Alert.alert('Booking Rejected', dimensionError);
        return;
      }
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please sign in.');
        return;
      }

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('bookingSlotId', ride.BS_ID);
      formData.append('pickupLocation', pickupLocation);
      formData.append('destLocation', destLocation);
      formData.append('categoryId', parcelCategory);
      formData.append('numParcels', quantity);
      formData.append('recipientName', recipientName);
      formData.append('recipientContact', recipientContact);
      formData.append('verificationMethod', requiresVerification ? verificationMethod : null);

      if (verificationMethod === 'dimensions') {
        formData.append('dimensionsLength', dimensions.length);
        formData.append('dimensionsWidth', dimensions.width);
        formData.append('dimensionsHeight', dimensions.height);
      }

      if (verificationMethod === 'pictures') {
        if (pictures.length === 0) {
          Alert.alert('Error', 'Please upload at least one image.');
          return;
        }

        pictures.forEach((uri, index) => {
          const fileName = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(fileName);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('parcelImages', {
            uri,
            name: fileName,
            type,
          });
        });
      }

      console.log('Booking Payload:', formData);

      const bookingResponse = await axios.post(
        'http://10.254.192.251:5000/api/parcels/book',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const bookingId = bookingResponse.data.bookingId;

      if (verificationMethod === 'pictures') {
        Alert.alert(
          'Booking Submitted',
          'Your parcel booking has been received and is currently under review. You will be notified once it has been approved.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('HomeScreen'),
            },
          ]
        );
      } else {
        const totalPrice = ride.BS_PARCELPRICE * quantity;
        navigation.navigate('Payment', {
          ride,
          bookingId,
          parcelCategory,
          recipientName,
          recipientContact,
          verificationMethod,
          dimensions,
          pictures,
          quantity,
          totalPrice,
          bookingType: 2,
          pickupLocation,
          destLocation,
        });
      }
    } catch (error) {
      console.error('Error booking parcel:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'There was a problem booking your parcel. Please try again later.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Confirm Parcel Booking</Text>
      </View>
      <StatusBar steps={['Find a Ride', 'Available Rides', 'Parcel Details', 'Review and Pay']} currentStep={3} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{pickupLocation}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{destLocation}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Pickup Date:</Text>
        <Text style={styles.value}>{new Date(ride.BS_DATETIME).toDateString()}</Text>
      </View>

      <Text style={styles.sectionHeader}>Parcel Details</Text>
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={styles.inputContainer}>
        <Ionicons name="cube-outline" size={24} color="black" style={styles.inputIcon} />
        <RNPickerSelect
          onValueChange={(value) => setParcelCategory(value)}
          items={parcelCategories}
          placeholder={{ label: 'Select Parcel Category', value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {requiresVerification && (
        <View style={styles.inputContainer}>
          <Ionicons name="checkmark-circle-outline" size={24} color="black" style={styles.inputIcon} />
          <RNPickerSelect
            onValueChange={(value) => setVerificationMethod(value)}
            items={verificationMethods}
            placeholder={{ label: 'Select Verification Method', value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      )}

      {verificationMethod === 'dimensions' && (
        <View>
          <TextInput
            placeholder="Enter Length (cm)"
            value={dimensions.length}
            onChangeText={(value) => handleDimensionChange('length', value)}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Enter Width (cm)"
            value={dimensions.width}
            onChangeText={(value) => handleDimensionChange('width', value)}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Enter Height (cm)"
            value={dimensions.height}
            onChangeText={(value) => handleDimensionChange('height', value)}
            style={styles.input}
            keyboardType="numeric"
          />
          {dimensionError ? <Text style={styles.errorText}>{dimensionError}</Text> : null}
        </View>
      )}

      {verificationMethod === 'pictures' && (
        <View>
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
              <Ionicons name="images-outline" size={24} color="white" />
              <Text style={styles.imageUploadButtonText}>Upload Images</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takeImage} style={styles.imageUploadButton}>
              <Ionicons name="camera-outline" size={24} color="white" />
              <Text style={styles.imageUploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {pictures.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.sectionHeader}>Receiver Information</Text>
      <TextInput
        placeholder="Recipient Name"
        value={recipientName}
        onChangeText={setRecipientName}
        style={styles.input}
      />
      <TextInput
        placeholder="Recipient Contact Number"
        value={recipientContact}
        onChangeText={setRecipientContact}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirmBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 35,
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 55,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    marginHorizontal: 16,
    paddingLeft: 10,
    backgroundColor: '#f8f8f8',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: '#3F3D3D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingLeft: 10,
    fontSize: 16,
    marginHorizontal: 16,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: 'red',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageUploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 25,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  imageUploadButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 100,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});
