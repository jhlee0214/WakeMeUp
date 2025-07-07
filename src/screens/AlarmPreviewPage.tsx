import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, AlarmSettings } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import { useAlarm } from '../context/AlarmContext';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type AlarmPreviewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlarmPreview'>;
type AlarmPreviewRouteProp = RouteProp<RootStackParamList, 'AlarmPreview'>;

interface AlarmPreviewPageProps {
  navigation: AlarmPreviewNavigationProp;
  route: AlarmPreviewRouteProp;
}

export default function AlarmPreviewPage({ navigation, route }: AlarmPreviewPageProps) {
  const { alarmSettings } = route.params;
  const { setActiveAlarm } = useAlarm();

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate time difference
  const getTimeDifference = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) {
      return 'Past';
    } else if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  const handleActivateAlarm = () => {
    // Set the alarm as active in global state
    setActiveAlarm(alarmSettings);
    
    Alert.alert(
      'Alarm Activated',
      'Your transport alarm has been set successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Here you would typically save the alarm to storage
            // and set up the actual alarm notification
            navigation.navigate('Main');
          }
        }
      ]
    );
  };

  const handleEditAlarm = () => {
    // Navigate back to edit the alarm settings
    navigation.goBack();
  };



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
        title="Alarm Preview"
        subtitle="Review your alarm settings"
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Journey Summary */}
        <View style={ContainerStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Ionicons 
              name={getTransportIcon() as any} 
              size={28} 
              color={Colors.primary} 
              style={{ marginRight: 12 }}
            />
            <Text style={TextStyles.subtitle}>Journey Details</Text>
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="location" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={TextStyles.body}>From: {alarmSettings.currentStop.name}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="location" size={16} color={Colors.accent} style={{ marginRight: 8 }} />
              <Text style={TextStyles.body}>To: {alarmSettings.destination.name}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="map" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={TextStyles.body}>Route: {alarmSettings.route.number} - {alarmSettings.route.name}</Text>
            </View>
          </View>
        </View>

        {/* Time Schedule */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Time Schedule</Text>
          
          <View style={{ marginTop: 15 }}>
            <View style={ContainerStyles.spaceBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="alarm" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={TextStyles.body}>Alarm time:</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[TextStyles.button, { color: Colors.primary, fontSize: 20 }]}>
                  {formatTime(alarmSettings.alarmTime)}
                </Text>
                <Text style={TextStyles.caption}>
                  {getTimeDifference(alarmSettings.alarmTime)} from now
                </Text>
              </View>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time" size={20} color={Colors.accent} style={{ marginRight: 8 }} />
                <Text style={TextStyles.body}>Departure:</Text>
              </View>
              <Text style={TextStyles.button}>{formatTime(alarmSettings.departureTime)}</Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="flag" size={20} color={Colors.success} style={{ marginRight: 8 }} />
                <Text style={TextStyles.body}>Arrival:</Text>
              </View>
              <Text style={TextStyles.button}>{formatTime(alarmSettings.arrivalTime)}</Text>
            </View>
          </View>
        </View>

        {/* Alarm Details */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Alarm Details</Text>
          
          <View style={{ marginTop: 15 }}>
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Transport type:</Text>
              <Text style={TextStyles.button}>{getTransportName()}</Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Buffer time:</Text>
              <Text style={TextStyles.button}>
                {Math.floor((alarmSettings.departureTime.getTime() - alarmSettings.alarmTime.getTime()) / (1000 * 60))} minutes
              </Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Travel time:</Text>
              <Text style={TextStyles.button}>
                {Math.floor((alarmSettings.arrivalTime.getTime() - alarmSettings.departureTime.getTime()) / (1000 * 60))} minutes
              </Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Date:</Text>
              <Text style={TextStyles.button}>{formatDate(alarmSettings.departureTime)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={[ButtonStyles.primary, { backgroundColor: Colors.success }]}
            onPress={handleActivateAlarm}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.white} style={{ marginRight: 10 }} />
              <Text style={[TextStyles.button, { color: Colors.white }]}>Activate Alarm</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={ButtonStyles.secondary}
            onPress={handleEditAlarm}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="create" size={20} color={Colors.text} style={{ marginRight: 10 }} />
              <Text style={TextStyles.button}>Edit Settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={[ContainerStyles.card, { marginTop: 20, backgroundColor: Colors.secondary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
            <Text style={TextStyles.caption}>
              Your alarm will notify you when it's time to leave for your transport.
              Make sure to keep the app running for real-time updates.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 