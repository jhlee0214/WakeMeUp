import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TransportStop, Route } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors, StatusStyles } from '../styles/common';
import { PTV_API_KEY, PTV_USER_ID, PTV_BASE_URL, ROUTE_TYPES } from '../ptv-config';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type SelectRouteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectRoute'>;
type SelectRouteRouteProp = RouteProp<RootStackParamList, 'SelectRoute'>;

interface SelectRoutePageProps {
  navigation: SelectRouteNavigationProp;
  route: SelectRouteRouteProp;
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

export default function SelectRoutePage({ navigation, route }: SelectRoutePageProps) {
  const { transportType, currentStop } = route.params;
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch routes for the selected stop
  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get route type number for PTV API
      const routeTypeNumber = ROUTE_TYPES[transportType];

      // Fetch routes from PTV API
      let endpoint = `/v3/routes?route_types=${routeTypeNumber}&stop_id=${currentStop.id}`;
      endpoint += endpoint.includes('?') ? `&devid=${PTV_USER_ID}` : `?devid=${PTV_USER_ID}`;
      
      const signature = await generateSignature(endpoint);
      const signedUrl = `${PTV_BASE_URL}${endpoint}&signature=${signature}`;
      
      const response = await fetch(signedUrl);
      const data = await response.json();

      if (data.routes && Array.isArray(data.routes)) {
        const formattedRoutes: Route[] = data.routes.map((route: any) => ({
          id: route.route_id,
          name: route.route_name,
          number: route.route_number || route.route_name,
          type: transportType,
          direction: route.direction_name || 'Unknown',
        }));

        setRoutes(formattedRoutes);
      } else {
        setError('No routes found for this station');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [currentStop.id, transportType]);

  const handleRouteSelect = (selectedRoute: Route) => {
    navigation.navigate('Destination', {
      transportType,
      currentStop,
      route: selectedRoute,
    });
  };



  const handleRefresh = () => {
    fetchRoutes();
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
        title="Select Route"
        subtitle={`Choose your ${getTransportName().toLowerCase()} route`}
      />

      {/* Current Stop Info */}
      <View style={[ContainerStyles.card, { margin: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons 
            name={getTransportIcon() as any} 
            size={24} 
            color={Colors.primary} 
            style={{ marginRight: 10 }}
          />
          <Text style={TextStyles.subtitle}>From: {currentStop.name}</Text>
        </View>
        <Text style={TextStyles.caption}>Select your route to continue</Text>
      </View>

      {/* Error State */}
      {error && (
        <View style={{ padding: 15, backgroundColor: Colors.error, margin: 20, borderRadius: 10 }}>
          <Text style={{ color: Colors.white, textAlign: 'center' }}>{error}</Text>
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
          <Text style={StatusStyles.loadingText}>Loading available routes...</Text>
        </View>
      )}

      {/* Routes List */}
      {!loading && routes.length > 0 && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={ContainerStyles.card}
              onPress={() => handleRouteSelect(route)}
              activeOpacity={0.8}
            >
              <View style={ContainerStyles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ 
                    backgroundColor: Colors.primary, 
                    borderRadius: 20, 
                    width: 40, 
                    height: 40, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginRight: 15
                  }}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 14 }}>
                      {route.number}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={TextStyles.button}>{route.name}</Text>
                    <Text style={TextStyles.caption}>Direction: {route.direction}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Empty State */}
      {!loading && routes.length === 0 && !error && (
        <View style={StatusStyles.emptyContainer}>
          <Ionicons name="map" size={64} color={Colors.textLight} />
          <Text style={StatusStyles.emptyText}>No routes available</Text>
          <TouchableOpacity onPress={handleRefresh} style={ButtonStyles.secondary}>
            <Text style={TextStyles.button}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 