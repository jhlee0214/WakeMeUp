import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { PTV_API_KEY, PTV_USER_ID, PTV_BASE_URL, ROUTE_TYPES } from '../ptv-config';

// Type definitions
type Stop = {
  stop_name: string;
  stop_latitude: number;
  stop_longitude: number;
  stop_id: number;
  [key: string]: any;
};

type StopWithDistance = Stop & { 
  distance: number;
  routeTypes?: number[];
};

type PTVResponse = {
  stops?: Stop[];
  [key: string]: any;
};

// Haversine formula to calculate distance between two coordinates (in meters)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate signature for PTV API authentication
const generateSignature = async (requestPathWithQuery: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(PTV_API_KEY);
  const messageData = encoder.encode(requestPathWithQuery);
  
  const cryptoAPI = typeof window !== 'undefined' ? window.crypto : crypto;
  
  const cryptoKey = await cryptoAPI.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await cryptoAPI.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = new Uint8Array(signature);
  const signatureHex = Array.from(signatureArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signatureHex.toUpperCase();
};

// Convert transport type to display name
const getTransportTypeName = (routeType: number): string => {
  switch (routeType) {
    case ROUTE_TYPES.train: return 'Train';
    case ROUTE_TYPES.tram: return 'Tram';
    case ROUTE_TYPES.bus: return 'Bus';
    default: return 'Other';
  }
};

export default function HomeScreen() {
  const [stops, setStops] = useState<StopWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: -37.771221, // Default: Highpoint Shopping Centre
    longitude: 144.888086
  });

  // Request location permissions and get current location
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setLocationLoading(false);
        return false;
      }
      
      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        setLocationError('Location services are disabled');
        setLocationLoading(false);
        return false;
      }
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setLocationLoading(false);
      return true;
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Failed to get location');
      setLocationLoading(false);
      return false;
    }
  };

  // Fetch nearby stops
  const fetchNearbyStops = async () => {
    setLoading(true);
    try {
      let endpoint = `/v3/stops/location/${currentLocation.latitude},${currentLocation.longitude}?max_results=10&max_distance=700`;
      endpoint += endpoint.includes('?') ? `&devid=${PTV_USER_ID}` : `?devid=${PTV_USER_ID}`;
      
      const signature = await generateSignature(endpoint);
      const signedUrl = `${PTV_BASE_URL}${endpoint}&signature=${signature}`;
      
      const response = await fetch(signedUrl);
      const data = await response.json() as PTVResponse;
      
      if (data.stops && Array.isArray(data.stops)) {
        const stopsWithDistance: StopWithDistance[] = data.stops.map((stop: Stop) => ({
          ...stop,
          distance: getDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            stop.stop_latitude,
            stop.stop_longitude
          ),
        }));
        
        // Sort by distance
        stopsWithDistance.sort((a, b) => a.distance - b.distance);
        setStops(stopsWithDistance);
      } else {
        Alert.alert('Notice', 'No nearby stops found.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch stop information.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    const locationSuccess = await getCurrentLocation();
    if (locationSuccess) {
      await fetchNearbyStops();
    }
    setRefreshing(false);
  };

  // Handle stop selection
  const handleStopPress = (stop: StopWithDistance) => {
    Alert.alert(
      stop.stop_name,
      `Distance: ${stop.distance.toFixed(1)}m\nCoordinates: (${stop.stop_latitude}, ${stop.stop_longitude})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => console.log('Stop details:', stop.stop_id) }
      ]
    );
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const locationSuccess = await getCurrentLocation();
      if (locationSuccess) {
        fetchNearbyStops();
      }
    };
    
    initializeLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>WakeMeUp</Text>
        <Text style={styles.subtitle}>Nearby Stops</Text>
        {locationError && (
          <Text style={styles.locationError}>{locationError}</Text>
        )}
      </View>

      {/* Location status */}
      {locationLoading && (
        <View style={styles.locationLoadingContainer}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.locationLoadingText}>Getting your location...</Text>
        </View>
      )}

      {/* Refresh button */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={onRefresh}
        disabled={loading || locationLoading}
      >
        <Text style={styles.refreshButtonText}>
          {loading || locationLoading ? 'Loading...' : 'Refresh'}
        </Text>
      </TouchableOpacity>

      {/* Stops list */}
      <ScrollView 
        style={styles.stopsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && stops.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading stop information...</Text>
          </View>
        ) : (
          stops.map((stop, index) => (
            <TouchableOpacity
              key={stop.stop_id}
              style={styles.stopItem}
              onPress={() => handleStopPress(stop)}
            >
              <View style={styles.stopHeader}>
                <Text style={styles.stopName}>
                  {stop.stop_name}
                </Text>
                <Text style={styles.stopDistance}>
                  {stop.distance.toFixed(0)}m
                </Text>
              </View>
              
              <View style={styles.stopDetails}>
                <Text style={styles.stopCoordinates}>
                  ({stop.stop_latitude.toFixed(6)}, {stop.stop_longitude.toFixed(6)})
                </Text>
                <Text style={styles.stopId}>
                  ID: {stop.stop_id}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        {stops.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No nearby stops found.</Text>
            <Text style={styles.emptySubtext}>Please check your location.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stopsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  stopItem: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  stopDistance: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  stopDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopCoordinates: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  stopId: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  locationError: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 5,
  },
  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  locationLoadingText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
}); 