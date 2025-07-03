import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HomeButton from '../components/HomeButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ArrivalAlarm'>;
type RouteProps = RouteProp<RootStackParamList, 'AlarmPreview'>;

const AlarmPreviewPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [timeRemaining, setTimeRemaining] = useState<number>(route.params?.alarmTime || 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.navigate('ArrivalAlarm');
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Time Remaining</Text>
      
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{timeRemaining}</Text>
        <Text style={styles.countdownLabel}>minutes</Text>
      </View>

      <View style={styles.dogContainer}>
        <Text style={styles.dogText}>🐕 Tori</Text>
        <Text style={styles.dogMessage}>I'll wake you up when we're close!</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {route.params?.transport} to {route.params?.destination}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 60,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#333',
  },
  countdownLabel: {
    fontSize: 24,
    color: '#666',
    marginTop: 10,
  },
  dogContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogText: {
    fontSize: 48,
    marginBottom: 20,
  },
  dogMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#E8D5B5',
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default AlarmPreviewPage; 