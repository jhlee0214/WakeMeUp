import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TransportStop, Route, Destination, AlarmSettings } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type AlarmTimeSettingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlarmTimeSetting'>;
type AlarmTimeSettingRouteProp = RouteProp<RootStackParamList, 'AlarmTimeSetting'>;

interface AlarmTimeSettingPageProps {
  navigation: AlarmTimeSettingNavigationProp;
  route: AlarmTimeSettingRouteProp;
}

export default function AlarmTimeSettingPage({ navigation, route }: AlarmTimeSettingPageProps) {
  const { transportType, currentStop, route: selectedRoute, destination } = route.params;
  
  // Time settings
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [bufferMinutes, setBufferMinutes] = useState(10);
  const [useRealTime, setUseRealTime] = useState(true);
  const [estimatedTravelTime, setEstimatedTravelTime] = useState(25); // minutes

  // Calculate alarm time based on departure time and buffer
  const calculateAlarmTime = (): Date => {
    const alarmTime = new Date(departureTime);
    alarmTime.setMinutes(alarmTime.getMinutes() - bufferMinutes);
    return alarmTime;
  };

  // Calculate arrival time
  const calculateArrivalTime = (): Date => {
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + estimatedTravelTime);
    return arrivalTime;
  };

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

  // Handle time adjustment
  const adjustTime = (minutes: number) => {
    const newTime = new Date(departureTime);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    setDepartureTime(newTime);
  };

  // Handle buffer time change
  const changeBufferTime = (minutes: number) => {
    setBufferMinutes(minutes);
  };

  const handleContinue = () => {
    const alarmSettings: AlarmSettings = {
      id: Date.now().toString(),
      currentStop,
      destination,
      route: selectedRoute,
      alarmTime: calculateAlarmTime(),
      departureTime,
      arrivalTime: calculateArrivalTime(),
      isActive: true,
      createdAt: new Date(),
      transportType,
    };

    navigation.navigate('AlarmPreview', { alarmSettings });
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
        title="Set Alarm Time"
        subtitle="Configure your departure time"
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Journey Summary */}
        <View style={ContainerStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Ionicons 
              name={getTransportIcon() as any} 
              size={24} 
              color={Colors.primary} 
              style={{ marginRight: 10 }}
            />
            <Text style={TextStyles.subtitle}>Journey Summary</Text>
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={TextStyles.caption}>From: {currentStop.name}</Text>
            <Text style={TextStyles.caption}>To: {destination.name}</Text>
            <Text style={TextStyles.caption}>Route: {selectedRoute.number} - {selectedRoute.name}</Text>
          </View>
        </View>

        {/* Departure Time Setting */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Departure Time</Text>
          
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Text style={[TextStyles.title, { fontSize: 48, marginBottom: 5 }]}>
              {formatTime(departureTime)}
            </Text>
            <Text style={TextStyles.caption}>{formatDate(departureTime)}</Text>
          </View>

          {/* Time Adjustment Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(-15)}
            >
              <Text style={TextStyles.button}>-15 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(-5)}
            >
              <Text style={TextStyles.button}>-5 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(5)}
            >
              <Text style={TextStyles.button}>+5 min</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(15)}
            >
              <Text style={TextStyles.button}>+15 min</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buffer Time Setting */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Buffer Time</Text>
          <Text style={TextStyles.caption}>
            How early do you want to be notified?
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
            {[5, 10, 15, 20].map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  ButtonStyles.small,
                  {
                    backgroundColor: bufferMinutes === minutes ? Colors.primary : Colors.button,
                  }
                ]}
                onPress={() => changeBufferTime(minutes)}
              >
                <Text style={[
                  TextStyles.button,
                  { color: bufferMinutes === minutes ? Colors.white : Colors.text }
                ]}>
                  {minutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Real-time Updates Toggle */}
        <View style={ContainerStyles.card}>
          <View style={ContainerStyles.spaceBetween}>
            <View>
              <Text style={TextStyles.subtitle}>Real-time Updates</Text>
              <Text style={TextStyles.caption}>
                Get notified of delays and changes
              </Text>
            </View>
            <Switch
              value={useRealTime}
              onValueChange={setUseRealTime}
              trackColor={{ false: Colors.textLight, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Time Summary */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Time Summary</Text>
          
          <View style={{ marginTop: 15 }}>
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Alarm will ring at:</Text>
              <Text style={[TextStyles.button, { color: Colors.primary }]}>
                {formatTime(calculateAlarmTime())}
              </Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Departure time:</Text>
              <Text style={TextStyles.button}>{formatTime(departureTime)}</Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Estimated arrival:</Text>
              <Text style={TextStyles.button}>{formatTime(calculateArrivalTime())}</Text>
            </View>
            
            <View style={ContainerStyles.spaceBetween}>
              <Text style={TextStyles.body}>Travel time:</Text>
              <Text style={TextStyles.button}>{estimatedTravelTime} minutes</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={TextStyles.button}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 