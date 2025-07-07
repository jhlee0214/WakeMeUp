import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TransportStop, Route, Destination, GooglePlacePrediction } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors, StatusStyles } from '../styles/common';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type DestinationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Destination'>;
type DestinationRouteProp = RouteProp<RootStackParamList, 'Destination'>;

interface DestinationPageProps {
  navigation: DestinationNavigationProp;
  route: DestinationRouteProp;
}

// Mock Google Places API key - replace with actual key
const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

export default function DestinationPage({ navigation, route }: DestinationPageProps) {
  const { transportType, currentStop, route: selectedRoute } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock popular destinations for demo purposes
  const popularDestinations: Destination[] = [
    {
      id: '1',
      name: 'Melbourne Central',
      address: '211 La Trobe St, Melbourne VIC 3000',
      latitude: -37.8100,
      longitude: 144.9540,
    },
    {
      id: '2',
      name: 'Flinders Street Station',
      address: 'Flinders St, Melbourne VIC 3000',
      latitude: -37.8183,
      longitude: 144.9671,
    },
    {
      id: '3',
      name: 'Southern Cross Station',
      address: 'Spencer St, Melbourne VIC 3008',
      latitude: -37.8184,
      longitude: 144.9534,
    },
    {
      id: '4',
      name: 'Crown Casino',
      address: '8 Whiteman St, Southbank VIC 3006',
      latitude: -37.8225,
      longitude: 144.9583,
    },
    {
      id: '5',
      name: 'Queen Victoria Market',
      address: 'Queen St, Melbourne VIC 3000',
      latitude: -37.8076,
      longitude: 144.9568,
    },
  ];

  // Search destinations using Google Places API (mock implementation)
  const searchDestinations = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual Google Places API
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&components=country:au&types=establishment`
      // );
      // const data = await response.json();
      
      // Mock response for demo
      const mockPredictions: GooglePlacePrediction[] = [
        {
          description: `${query} Station, Melbourne VIC`,
          place_id: 'mock_1',
          structured_formatting: {
            main_text: `${query} Station`,
            secondary_text: 'Melbourne VIC',
          },
        },
        {
          description: `${query} Shopping Centre, Melbourne VIC`,
          place_id: 'mock_2',
          structured_formatting: {
            main_text: `${query} Shopping Centre`,
            secondary_text: 'Melbourne VIC',
          },
        },
        {
          description: `${query} University, Melbourne VIC`,
          place_id: 'mock_3',
          structured_formatting: {
            main_text: `${query} University`,
            secondary_text: 'Melbourne VIC',
          },
        },
      ];

      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error searching destinations:', error);
      setError('Failed to search destinations');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDestinations(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDestinationSelect = (destination: Destination) => {
    navigation.navigate('AlarmTimeSetting', {
      transportType,
      currentStop,
      route: selectedRoute,
      destination,
    });
  };

  const handlePredictionSelect = (prediction: GooglePlacePrediction) => {
    // Mock destination creation from prediction
    const destination: Destination = {
      id: prediction.place_id,
      name: prediction.structured_formatting.main_text,
      address: prediction.description,
      latitude: -37.8100, // Mock coordinates
      longitude: 144.9540,
      placeId: prediction.place_id,
    };

    handleDestinationSelect(destination);
  };



  const getTransportIcon = () => {
    switch (transportType) {
      case 'train': return 'train';
      case 'tram': return 'car';
      case 'bus': return 'bus';
      default: return 'location';
    }
  };

  return (
    <View style={ContainerStyles.screen}>
      <HeaderWithHomeButton
        navigation={navigation}
        title="Select Destination"
        subtitle="Where are you going?"
      />

      {/* Search Input */}
      <View style={{ padding: 20 }}>
        <View style={[ContainerStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons 
              name={getTransportIcon() as any} 
              size={24} 
              color={Colors.primary} 
              style={{ marginRight: 10 }}
            />
            <Text style={TextStyles.subtitle}>Route {selectedRoute.number}</Text>
          </View>
          <Text style={TextStyles.caption}>From: {currentStop.name}</Text>
        </View>

        <View style={{ position: 'relative' }}>
          <TextInput
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.button,
            }}
            placeholder="Search destination..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {loading && (
            <ActivityIndicator 
              size="small" 
              color={Colors.primary} 
              style={{ position: 'absolute', right: 15, top: 15 }}
            />
          )}
        </View>
      </View>

      {/* Search Results */}
      {predictions.length > 0 && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {predictions.map((prediction) => (
            <TouchableOpacity
              key={prediction.place_id}
              style={ContainerStyles.card}
              onPress={() => handlePredictionSelect(prediction)}
              activeOpacity={0.8}
            >
              <View style={ContainerStyles.row}>
                <Ionicons name="location" size={20} color={Colors.primary} style={{ marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                  <Text style={TextStyles.button}>{prediction.structured_formatting.main_text}</Text>
                  <Text style={TextStyles.caption}>{prediction.structured_formatting.secondary_text}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Popular Destinations */}
      {!searchQuery && predictions.length === 0 && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text style={[TextStyles.subtitle, { marginBottom: 15, textAlign: 'left' }]}>
            Popular Destinations
          </Text>
          {popularDestinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={ContainerStyles.card}
              onPress={() => handleDestinationSelect(destination)}
              activeOpacity={0.8}
            >
              <View style={ContainerStyles.row}>
                <Ionicons name="star" size={20} color={Colors.accent} style={{ marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                  <Text style={TextStyles.button}>{destination.name}</Text>
                  <Text style={TextStyles.caption}>{destination.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Error State */}
      {error && (
        <View style={{ padding: 15, backgroundColor: Colors.error, margin: 20, borderRadius: 10 }}>
          <Text style={{ color: Colors.white, textAlign: 'center' }}>{error}</Text>
        </View>
      )}
    </View>
  );
} 