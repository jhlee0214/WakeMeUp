import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HomeButton from '../components/HomeButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlarmPreview'>;
type RouteProps = RouteProp<RootStackParamList, 'AlarmTimeSetting'>;

const AlarmTimeSettingPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [selectedTime, setSelectedTime] = useState<number>(5);

  const timeOptions: number[] = [3, 5, 7, 10, 15];

  const handleContinue = () => {
    navigation.navigate('AlarmPreview', {
      transport: route.params?.transport || '',
      destination: route.params?.destination || '',
      alarmTime: selectedTime,
    });
  };

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Set Alarm Time</Text>
      <Text style={styles.subtitle}>Minutes before destination</Text>

      <View style={styles.timeOptionsContainer}>
        {timeOptions.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              selectedTime === time && styles.selectedTimeButton,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeButtonText,
                selectedTime === time && styles.selectedTimeButtonText,
              ]}
            >
              {time} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  timeButton: {
    backgroundColor: '#E8D5B5',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#D4B483',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedTimeButtonText: {
    color: '#FFF',
  },
  continueButton: {
    backgroundColor: '#E8D5B5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default AlarmTimeSettingPage; 