import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TransportStop, NearbyStop } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors, StatusStyles } from '../styles/common';
import { PTV_API_KEY, PTV_USER_ID, PTV_BASE_URL, ROUTE_TYPES } from '../ptv-config';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type SelectCurrentStationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectCurrentStation'>;
type SelectCurrentStationRouteProp = RouteProp<RootStackParamList, 'SelectCurrentStation'>;

interface SelectCurrentStationPageProps {
  navigation: SelectCurrentStationNavigationProp;
  route: SelectCurrentStationRouteProp;
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

// Calculate distance between two coordinates using Haversine formula
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
};

export default function SelectCurrentStationPage({ navigation, route }: SelectCurrentStationPageProps) {
  const { transportType } = route.params;
  const [stops, setStops] = useState<NearbyStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get current location and fetch nearby stops
  const fetchNearbyStops = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setLoading(false);
        return;
      }

      // Check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        setLocationError('Location services are disabled');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(userLocation);

      // Get route type number for PTV API
      const routeTypeNumber = ROUTE_TYPES[transportType];

      // Fetch nearby stops from PTV API
      let endpoint = `/v3/stops/location/${userLocation.latitude},${userLocation.longitude}?route_types=${routeTypeNumber}&max_results=20&max_distance=2000`;
      endpoint += endpoint.includes('?') ? `&devid=${PTV_USER_ID}` : `?devid=${PTV_USER_ID}`;
      
      const signature = await generateSignature(endpoint);
      const signedUrl = `${PTV_BASE_URL}${endpoint}&signature=${signature}`;
      
      const response = await fetch(signedUrl);
      const data = await response.json();

      if (data.stops && Array.isArray(data.stops)) {
        const stopsWithDistance: NearbyStop[] = data.stops.map((stop: any) => ({
          id: stop.stop_id,
          name: stop.stop_name,
          type: transportType,
          latitude: stop.stop_latitude,
          longitude: stop.stop_longitude,
          distance: getDistance(
            userLocation.latitude,
            userLocation.longitude,
            stop.stop_latitude,
            stop.stop_longitude
          ),
          suburb: stop.stop_suburb || 'Unknown',
        }));

        // Sort by distance
        stopsWithDistance.sort((a, b) => a.distance - b.distance);
        setStops(stopsWithDistance);
      } else {
        setLocationError('No stops found nearby');
      }
    } catch (error) {
      console.error('Error fetching stops:', error);
      setLocationError('Failed to fetch nearby stops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyStops();
  }, [transportType]);

  const handleStopSelect = (stop: TransportStop) => {
    navigation.navigate('SelectRoute', {
      transportType,
      currentStop: stop,
    });
  };



  const handleRefresh = () => {
    fetchNearbyStops();
  };

  const getTransportIcon = () => {
    switch (transportType) {
      case 'train': return 'train';
      case 'tram': return 'car';
      case 'bus': return 'bus';
      default: return 'location';
    }
  };

  const getTransportName = () => {
    switch (transportType) {
      case 'train': return 'Train';
      case 'tram': return 'Tram';
      case 'bus': return 'Bus';
      default: return 'Transport';
    }
  };

  return (
    <View style={ContainerStyles.screen}>
      <HeaderWithHomeButton
        navigation={navigation}
        title={`Select ${getTransportName()} Station`}
        subtitle="Choose your current station"
      />

      {/* Location Error */}
      {locationError && (
        <View style={{ padding: 15, backgroundColor: Colors.error, margin: 20, borderRadius: 10 }}>
          <Text style={{ color: Colors.white, textAlign: 'center' }}>{locationError}</Text>
          <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 10 }}>
            <Text style={{ color: Colors.white, textAlign: 'center', fontWeight: 'bold' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={StatusStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={StatusStyles.loadingText}>Finding nearby stations...</Text>
        </View>
      )}

      {/* Stops List */}
      {!loading && stops.length > 0 && (
        <ScrollView style={{ flex: 1, paddingTop: 20 }}>
          {stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[ContainerStyles.card, { marginHorizontal: 20 }]}
              onPress={() => handleStopSelect(stop)}
              activeOpacity={0.8}
            >
              <View style={ContainerStyles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons 
                    name={getTransportIcon() as any} 
                    size={24} 
                    color={Colors.primary} 
                    style={{ marginRight: 15 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={TextStyles.button}>{stop.name}</Text>
                    <Text style={TextStyles.caption}>{stop.suburb}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[TextStyles.button, { color: Colors.primary }]}>
                    {stop.distance.toFixed(0)}m
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && stops.length === 0 && !locationError && (
        <View style={StatusStyles.emptyContainer}>
          <Ionicons name="location" size={64} color={Colors.textLight} />
          <Text style={StatusStyles.emptyText}>No stations found nearby</Text>
          <TouchableOpacity onPress={handleRefresh} style={ButtonStyles.secondary}>
            <Text style={TextStyles.button}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 