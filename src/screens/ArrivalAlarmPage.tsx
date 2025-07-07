import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, AlarmSettings } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type ArrivalAlarmNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ArrivalAlarm'>;
type ArrivalAlarmRouteProp = RouteProp<RootStackParamList, 'ArrivalAlarm'>;

interface ArrivalAlarmPageProps {
  navigation: ArrivalAlarmNavigationProp;
  route: ArrivalAlarmRouteProp;
}

export default function ArrivalAlarmPage({ navigation, route }: ArrivalAlarmPageProps) {
  const { alarmId } = route.params;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings | null>(null);

  // Mock alarm settings - in real app, fetch from storage
  useEffect(() => {
    const mockAlarmSettings: AlarmSettings = {
      id: alarmId,
      currentStop: { id: 1, name: 'Flinders Street Station', type: 'train', latitude: -37.8183, longitude: 144.9671 },
      destination: { id: '1', name: 'Melbourne Central', address: '211 La Trobe St, Melbourne VIC 3000', latitude: -37.8100, longitude: 144.9540 },
      route: { id: 1, name: 'Craigieburn Line', number: 'Craigieburn', type: 'train', direction: 'Craigieburn' },
      alarmTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      departureTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      arrivalTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      isActive: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      transportType: 'train',
    };

    setAlarmSettings(mockAlarmSettings);
  }, [alarmId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (targetTime: Date): string => {
    const diffMs = targetTime.getTime() - currentTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) {
      return 'Past due';
    } else if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  // Handle snooze
  const handleSnooze = () => {
    Alert.alert(
      'Snooze Alarm',
      'Alarm will ring again in 5 minutes',
      [
        { text: 'OK' }
      ]
    );
  };

  // Handle dismiss
  const handleDismiss = () => {
    Alert.alert(
      'Dismiss Alarm',
      'Are you sure you want to dismiss this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss',
          style: 'destructive',
          onPress: () => {
            // Here you would typically update the alarm status
            navigation.navigate('Main');
          }
        }
      ]
    );
  };

  // Handle view details
  const handleViewDetails = () => {
    // Navigate to alarm details or back to main
    navigation.navigate('Main');
  };

  if (!alarmSettings) {
    return (
      <View style={[ContainerStyles.screen, ContainerStyles.center]}>
        <Text style={TextStyles.body}>Loading alarm...</Text>
      </View>
    );
  }

  const getTransportIcon = () => {
    switch (alarmSettings.transportType) {
      case 'train': return 'train';
      case 'tram': return 'car';
      case 'bus': return 'bus';
      default: return 'location';
    }
  };

  const getTransportName = () => {
    switch (alarmSettings.transportType) {
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
        title={formatTime(currentTime)}
        subtitle="Current Time"
        showBackButton={false}
      />

      {/* Alarm Status */}
      <View style={[ContainerStyles.card, { margin: 20, backgroundColor: Colors.primary }]}>
        <View style={{ alignItems: 'center' }}>
          <Ionicons 
            name={getTransportIcon() as any} 
            size={48} 
            color={Colors.white} 
            style={{ marginBottom: 15 }}
          />
          <Text style={[TextStyles.title, { color: Colors.white, marginBottom: 5 }]}>
            Time to Leave!
          </Text>
          <Text style={[TextStyles.caption, { color: Colors.white, opacity: 0.9, textAlign: 'center' }]}>
            Your {getTransportName().toLowerCase()} is departing soon
          </Text>
        </View>
      </View>

      {/* Journey Details */}
      <View style={[ContainerStyles.card, { marginHorizontal: 20 }]}>
        <Text style={TextStyles.subtitle}>Journey Details</Text>
        
        <View style={{ marginTop: 15 }}>
          <View style={ContainerStyles.spaceBetween}>
            <Text style={TextStyles.body}>From:</Text>
            <Text style={TextStyles.button}>{alarmSettings.currentStop.name}</Text>
          </View>
          
          <View style={ContainerStyles.spaceBetween}>
            <Text style={TextStyles.body}>To:</Text>
            <Text style={TextStyles.button}>{alarmSettings.destination.name}</Text>
          </View>
          
          <View style={ContainerStyles.spaceBetween}>
            <Text style={TextStyles.body}>Route:</Text>
            <Text style={TextStyles.button}>{alarmSettings.route.number}</Text>
          </View>
        </View>
      </View>

      {/* Time Information */}
      <View style={[ContainerStyles.card, { marginHorizontal: 20 }]}>
        <Text style={TextStyles.subtitle}>Time Information</Text>
        
        <View style={{ marginTop: 15 }}>
          <View style={ContainerStyles.spaceBetween}>
            <Text style={TextStyles.body}>Departure:</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={TextStyles.button}>{formatTime(alarmSettings.departureTime)}</Text>
              <Text style={TextStyles.caption}>
                {getTimeRemaining(alarmSettings.departureTime)}
              </Text>
            </View>
          </View>
          
          <View style={ContainerStyles.spaceBetween}>
            <Text style={TextStyles.body}>Arrival:</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={TextStyles.button}>{formatTime(alarmSettings.arrivalTime)}</Text>
              <Text style={TextStyles.caption}>
                {getTimeRemaining(alarmSettings.arrivalTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ padding: 20, paddingTop: 10 }}>
        <TouchableOpacity
          style={[ButtonStyles.primary, { backgroundColor: Colors.success }]}
          onPress={handleViewDetails}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="information-circle" size={24} color={Colors.white} style={{ marginRight: 10 }} />
            <Text style={[TextStyles.button, { color: Colors.white }]}>View Details</Text>
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <TouchableOpacity
            style={[ButtonStyles.secondary, { flex: 1, marginRight: 10 }]}
            onPress={handleSnooze}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="time" size={20} color={Colors.text} style={{ marginRight: 8 }} />
              <Text style={TextStyles.button}>Snooze</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[ButtonStyles.secondary, { flex: 1, marginLeft: 10 }]}
            onPress={handleDismiss}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="close" size={20} color={Colors.error} style={{ marginRight: 8 }} />
              <Text style={[TextStyles.button, { color: Colors.error }]}>Dismiss</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Note */}
      <View style={[ContainerStyles.card, { margin: 20, backgroundColor: Colors.secondary }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
          <Text style={TextStyles.caption}>
            Make sure you have enough time to reach the station. 
            Consider traffic and walking time.
          </Text>
        </View>
      </View>
    </View>
  );
} 