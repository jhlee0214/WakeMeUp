import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContainerStyles, TextStyles, Colors, StatusStyles } from '../styles/common';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Simulate loading time for app initialization
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <View style={[ContainerStyles.screen, ContainerStyles.center]}>
      {/* App Icon */}
      <View style={{ marginBottom: 30 }}>
        <Ionicons name="alarm" size={80} color={Colors.primary} />
      </View>

      {/* App Title */}
      <Text style={TextStyles.title}>WakeMeUp</Text>
      <Text style={TextStyles.caption}>Smart Transport Alarm</Text>

      {/* Loading Indicator */}
      <View style={StatusStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={StatusStyles.loadingText}>Initializing...</Text>
      </View>

      {/* Version Info */}
      <View style={{ position: 'absolute', bottom: 50 }}>
        <Text style={TextStyles.caption}>Version 1.0.0</Text>
      </View>
    </View>
  );
} 