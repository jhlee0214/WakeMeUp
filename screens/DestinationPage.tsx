import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HomeButton from '../components/HomeButton';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlarmTimeSetting'>;
type RouteProps = RouteProp<RootStackParamList, 'Destination'>;

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

const DestinationPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -37.8136, // Melbourne default
    longitude: 144.9631,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is required to show your current location on the map.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const currentLocation: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        name: 'Current Location',
      };
      
      setUserLocation(currentLocation);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation: LocationData = {
      latitude,
      longitude,
      name: searchQuery || 'Selected Location',
    };
    setSelectedLocation(newLocation);
  };

  const handleDestinationSelect = () => {
    const destination = selectedLocation 
      ? `${selectedLocation.name} (${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)})`
      : searchQuery || 'Selected Location';
      
    navigation.navigate('AlarmTimeSetting', {
      transport: route.params?.transport || '',
      destination,
    });
  };

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Select Destination</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destination..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Destination"
              description={selectedLocation.name}
              pinColor="red"
            />
          )}
        </MapView>
        {selectedLocation && (
          <View style={styles.selectedLocationInfo}>
            <Text style={styles.selectedLocationText}>
              Selected: {selectedLocation.name}
            </Text>
            <Text style={styles.coordinatesText}>
              {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleDestinationSelect}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  selectedLocationInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
  },
  selectedLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#E8D5B5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default DestinationPage; 