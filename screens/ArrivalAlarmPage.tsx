import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HomeButton from '../components/HomeButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ArrivalAlarmPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Vibrate pattern: 1 second on, 1 second off, repeat
    const vibrationPattern = [1000, 1000];
    Vibration.vibrate(vibrationPattern, true);

    // Cleanup vibration when component unmounts
    return () => Vibration.cancel();
  }, []);

  return (
    <View style={styles.container}>
      <HomeButton />
      <View style={styles.content}>
        <Text style={styles.emoji}>🐕</Text>
        <Text style={styles.title}>Wake Up!</Text>
        <Text style={styles.subtitle}>You're almost at your destination</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
  },
});

export default ArrivalAlarmPage; 