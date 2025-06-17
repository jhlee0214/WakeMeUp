import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeButton from '../components/HomeButton';

const ManualAlarmPage = () => {
  const navigation = useNavigation();
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSetAlarm = () => {
    const totalMinutes = selectedHours * 60 + selectedMinutes;
    navigation.navigate('AlarmPreview', {
      alarmTime: totalMinutes,
      isManual: true,
    });
  };

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Set Manual Alarm</Text>

      <View style={styles.timeContainer}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Hours</Text>
          <View style={styles.timePicker}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timeOption,
                  selectedHours === hour && styles.selectedTimeOption,
                ]}
                onPress={() => setSelectedHours(hour)}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    selectedHours === hour && styles.selectedTimeOptionText,
                  ]}
                >
                  {hour.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Minutes</Text>
          <View style={styles.timePicker}>
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.timeOption,
                  selectedMinutes === minute && styles.selectedTimeOption,
                ]}
                onPress={() => setSelectedMinutes(minute)}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    selectedMinutes === minute && styles.selectedTimeOptionText,
                  ]}
                >
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.setButton}
        onPress={handleSetAlarm}
      >
        <Text style={styles.setButtonText}>Set Alarm</Text>
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
    marginBottom: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  timeColumn: {
    alignItems: 'center',
    width: '45%',
  },
  timeLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  timePicker: {
    backgroundColor: '#E8D5B5',
    borderRadius: 10,
    padding: 10,
    maxHeight: 300,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 2,
  },
  selectedTimeOption: {
    backgroundColor: '#D4B483',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedTimeOptionText: {
    color: '#FFF',
  },
  setButton: {
    backgroundColor: '#E8D5B5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default ManualAlarmPage; 