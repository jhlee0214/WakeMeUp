import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/transport';
import { ContainerStyles, TextStyles, Colors } from '../styles/common';

type HeaderWithHomeButtonNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderWithHomeButtonProps {
  navigation: HeaderWithHomeButtonNavigationProp;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function HeaderWithHomeButton({ 
  navigation, 
  title, 
  subtitle, 
  showBackButton = true 
}: HeaderWithHomeButtonProps) {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={ContainerStyles.header}>
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity 
          onPress={handleBack} 
          style={{ position: 'absolute', left: 20, top: 50 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity 
        onPress={handleHome} 
        style={{ position: 'absolute', right: 20, top: 50 }}
      >
        <Ionicons name="home" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[TextStyles.title, { color: Colors.white, marginTop: 20 }]}>
        {title}
      </Text>
      
      {/* Subtitle */}
      {subtitle && (
        <Text style={[TextStyles.caption, { color: Colors.white, opacity: 0.8 }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
} 