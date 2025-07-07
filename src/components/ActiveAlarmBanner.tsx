import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlarm } from '../context/AlarmContext';
import { Colors, TextStyles } from '../styles/common';

interface ActiveAlarmBannerProps {
  onPress?: () => void;
}

export default function ActiveAlarmBanner({ onPress }: ActiveAlarmBannerProps) {
  const { activeAlarm, clearActiveAlarm } = useAlarm();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animate banner when alarm becomes active
  useEffect(() => {
    if (activeAlarm) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [activeAlarm, fadeAnim]);

  if (!activeAlarm) {
    return null;
  }

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

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTransportIcon = () => {
    switch (activeAlarm.transportType) {
      case 'train': return 'train';
      case 'tram': return 'car';
      case 'bus': return 'bus';
      default: return 'location';
    }
  };

  const handleDismiss = () => {
    clearActiveAlarm();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: Colors.success,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        shadowColor: Colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons 
            name={getTransportIcon() as any} 
            size={24} 
            color={Colors.white} 
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[TextStyles.button, { color: Colors.white, fontSize: 16 }]}>
              {activeAlarm.route.number} to {activeAlarm.destination.name}
            </Text>
            <Text style={[TextStyles.caption, { color: Colors.white, opacity: 0.9 }]}>
              Departure: {formatTime(activeAlarm.departureTime)} ({getTimeRemaining(activeAlarm.departureTime)})
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={handleDismiss}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Ionicons name="close" size={20} color={Colors.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
} 