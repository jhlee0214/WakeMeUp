import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ManualAlarm } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type ManualAlarmNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManualAlarm'>;

interface ManualAlarmPageProps {
  navigation: ManualAlarmNavigationProp;
}

export default function ManualAlarmPage({ navigation }: ManualAlarmPageProps) {
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);

  // Days of the week
  const daysOfWeek = [
    { id: 0, name: 'Sun', fullName: 'Sunday' },
    { id: 1, name: 'Mon', fullName: 'Monday' },
    { id: 2, name: 'Tue', fullName: 'Tuesday' },
    { id: 3, name: 'Wed', fullName: 'Wednesday' },
    { id: 4, name: 'Thu', fullName: 'Thursday' },
    { id: 5, name: 'Fri', fullName: 'Friday' },
    { id: 6, name: 'Sat', fullName: 'Saturday' },
  ];

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
    const newTime = new Date(alarmTime);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    setAlarmTime(newTime);
  };

  // Handle repeat day selection
  const toggleRepeatDay = (dayId: number) => {
    if (repeatDays.includes(dayId)) {
      setRepeatDays(repeatDays.filter(id => id !== dayId));
    } else {
      setRepeatDays([...repeatDays, dayId]);
    }
  };

  // Handle alarm creation
  const handleCreateAlarm = () => {
    if (!alarmTitle.trim()) {
      Alert.alert('Error', 'Please enter an alarm title');
      return;
    }

    const manualAlarm: ManualAlarm = {
      id: Date.now().toString(),
      title: alarmTitle.trim(),
      time: alarmTime,
      isActive: true,
      createdAt: new Date(),
      repeatDays: repeatEnabled ? repeatDays : undefined,
    };

    Alert.alert(
      'Alarm Created',
      `Alarm "${manualAlarm.title}" has been set for ${formatTime(alarmTime)}`,
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



  return (
    <View style={ContainerStyles.screen}>
      <HeaderWithHomeButton
        navigation={navigation}
        title="Manual Alarm"
        subtitle="Set a simple time-based alarm"
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Alarm Title */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Alarm Title</Text>
          <TextInput
            style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              borderWidth: 1,
              borderColor: Colors.button,
              marginTop: 10,
            }}
            placeholder="Enter alarm title..."
            value={alarmTitle}
            onChangeText={setAlarmTitle}
            maxLength={50}
          />
        </View>

        {/* Time Setting */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Alarm Time</Text>
          
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Text style={[TextStyles.title, { fontSize: 48, marginBottom: 5 }]}>
              {formatTime(alarmTime)}
            </Text>
            <Text style={TextStyles.caption}>{formatDate(alarmTime)}</Text>
          </View>

          {/* Time Adjustment Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(-30)}
            >
              <Text style={TextStyles.button}>-30 min</Text>
            </TouchableOpacity>
            
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
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => adjustTime(30)}
            >
              <Text style={TextStyles.button}>+30 min</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Settings */}
        <View style={ContainerStyles.card}>
          <View style={ContainerStyles.spaceBetween}>
            <View>
              <Text style={TextStyles.subtitle}>Repeat</Text>
              <Text style={TextStyles.caption}>
                Set alarm to repeat on specific days
              </Text>
            </View>
            <Switch
              value={repeatEnabled}
              onValueChange={setRepeatEnabled}
              trackColor={{ false: Colors.textLight, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          {repeatEnabled && (
            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      {
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: Colors.primary,
                      },
                      {
                        backgroundColor: repeatDays.includes(day.id) ? Colors.primary : Colors.white,
                      }
                    ]}
                    onPress={() => toggleRepeatDay(day.id)}
                  >
                    <Text style={[
                      { fontSize: 12, fontWeight: 'bold' },
                      { color: repeatDays.includes(day.id) ? Colors.white : Colors.primary }
                    ]}>
                      {day.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {repeatDays.length > 0 && (
                <Text style={[TextStyles.caption, { marginTop: 10, textAlign: 'center' }]}>
                  Repeats on: {repeatDays.map(id => daysOfWeek[id].fullName).join(', ')}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Quick Presets */}
        <View style={ContainerStyles.card}>
          <Text style={TextStyles.subtitle}>Quick Presets</Text>
          <Text style={TextStyles.caption}>Common alarm times</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => {
                const now = new Date();
                now.setHours(now.getHours() + 1);
                now.setMinutes(0);
                setAlarmTime(now);
              }}
            >
              <Text style={TextStyles.button}>1 Hour</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => {
                const now = new Date();
                now.setHours(now.getHours() + 2);
                now.setMinutes(0);
                setAlarmTime(now);
              }}
            >
              <Text style={TextStyles.button}>2 Hours</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={ButtonStyles.small}
              onPress={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(8, 0, 0, 0);
                setAlarmTime(tomorrow);
              }}
            >
              <Text style={TextStyles.button}>Tomorrow 8AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Alarm Button */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={handleCreateAlarm}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="alarm" size={24} color={Colors.white} style={{ marginRight: 10 }} />
            <Text style={[TextStyles.button, { color: Colors.white }]}>Create Alarm</Text>
          </View>
        </TouchableOpacity>

        {/* Info Note */}
        <View style={[ContainerStyles.card, { marginTop: 20, backgroundColor: Colors.secondary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
            <Text style={TextStyles.caption}>
              Manual alarms are simple time-based notifications.
              For transport-specific alarms, use the "Select Transport" option.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 