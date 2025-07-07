import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AlarmSettings, ManualAlarm } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors, StatusStyles } from '../styles/common';
import ActiveAlarmBanner from '../components/ActiveAlarmBanner';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type HistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface HistoryPageProps {
  navigation: HistoryNavigationProp;
}

export default function HistoryPage({ navigation }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [transportAlarms, setTransportAlarms] = useState<AlarmSettings[]>([]);
  const [manualAlarms, setManualAlarms] = useState<ManualAlarm[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock transport alarms
    const mockTransportAlarms: AlarmSettings[] = [
      {
        id: '1',
        currentStop: { id: 1, name: 'Flinders Street Station', type: 'train', latitude: -37.8183, longitude: 144.9671 },
        destination: { id: '1', name: 'Melbourne Central', address: '211 La Trobe St, Melbourne VIC 3000', latitude: -37.8100, longitude: 144.9540 },
        route: { id: 1, name: 'Craigieburn Line', number: 'Craigieburn', type: 'train', direction: 'Craigieburn' },
        alarmTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000), // 2h 10min from now
        arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 35 * 60 * 1000), // 2h 35min from now
        isActive: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        transportType: 'train',
      },
      {
        id: '2',
        currentStop: { id: 2, name: 'Southern Cross Station', type: 'train', latitude: -37.8184, longitude: 144.9534 },
        destination: { id: '2', name: 'Crown Casino', address: '8 Whiteman St, Southbank VIC 3006', latitude: -37.8225, longitude: 144.9583 },
        route: { id: 2, name: 'Werribee Line', number: 'Werribee', type: 'train', direction: 'Werribee' },
        alarmTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        departureTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000), // 1h 50min ago
        arrivalTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 25 * 60 * 1000), // 1h 35min ago
        isActive: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        transportType: 'train',
      },
    ];

    // Mock manual alarms
    const mockManualAlarms: ManualAlarm[] = [
      {
        id: '3',
        title: 'Morning Meeting',
        time: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        isActive: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: '4',
        title: 'Gym Session',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isActive: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        repeatDays: [1, 3, 5], // Mon, Wed, Fri
      },
    ];

    setTransportAlarms(mockTransportAlarms);
    setManualAlarms(mockManualAlarms);
  }, []);

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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Get status text and color
  const getStatusInfo = (alarm: AlarmSettings | ManualAlarm) => {
    if (alarm.isActive) {
      const now = new Date();
      const alarmTime = 'alarmTime' in alarm ? alarm.alarmTime : alarm.time;
      
      if (alarmTime > now) {
        return { text: 'Active', color: Colors.success };
      } else {
        return { text: 'Missed', color: Colors.error };
      }
    } else {
      return { text: 'Completed', color: Colors.textLight };
    }
  };

  // Handle alarm deletion
  const handleDeleteAlarm = (alarmId: string, type: 'transport' | 'manual') => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (type === 'transport') {
              setTransportAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
            } else {
              setManualAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
            }
          }
        }
      ]
    );
  };

  // Handle alarm toggle
  const handleToggleAlarm = (alarmId: string, type: 'transport' | 'manual') => {
    if (type === 'transport') {
      setTransportAlarms(prev => 
        prev.map(alarm => 
          alarm.id === alarmId 
            ? { ...alarm, isActive: !alarm.isActive }
            : alarm
        )
      );
    } else {
      setManualAlarms(prev => 
        prev.map(alarm => 
          alarm.id === alarmId 
            ? { ...alarm, isActive: !alarm.isActive }
            : alarm
        )
      );
    }
  };



  // Filter alarms based on active tab
  const getFilteredAlarms = () => {
    const allAlarms = [
      ...transportAlarms.map(alarm => ({ ...alarm, type: 'transport' as const })),
      ...manualAlarms.map(alarm => ({ ...alarm, type: 'manual' as const }))
    ];

    if (activeTab === 'active') {
      return allAlarms.filter(alarm => alarm.isActive);
    } else {
      return allAlarms.filter(alarm => !alarm.isActive);
    }
  };

  const filteredAlarms = getFilteredAlarms();

  return (
    <View style={ContainerStyles.screen}>
      <ActiveAlarmBanner />
      <HeaderWithHomeButton
        navigation={navigation}
        title="Alarm History"
        subtitle="View your alarm history"
      />

      {/* Tab Buttons */}
      <View style={{ flexDirection: 'row', padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity
          style={[
            ButtonStyles.small,
            {
              backgroundColor: activeTab === 'active' ? Colors.primary : Colors.white,
              marginRight: 10,
            }
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[
            TextStyles.button,
            { color: activeTab === 'active' ? Colors.white : Colors.text }
          ]}>
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ButtonStyles.small,
            {
              backgroundColor: activeTab === 'completed' ? Colors.primary : Colors.white,
            }
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[
            TextStyles.button,
            { color: activeTab === 'completed' ? Colors.white : Colors.text }
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alarms List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {filteredAlarms.length > 0 ? (
          filteredAlarms.map((alarm) => {
            const statusInfo = getStatusInfo(alarm);
            const isTransport = 'type' in alarm && alarm.type === 'transport';
            const transportAlarm = alarm as AlarmSettings;
            const manualAlarm = alarm as ManualAlarm;

            return (
              <View key={alarm.id} style={ContainerStyles.card}>
                {/* Header */}
                <View style={ContainerStyles.spaceBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name={isTransport ? 'train' : 'alarm'} 
                      size={20} 
                      color={Colors.primary} 
                      style={{ marginRight: 8 }}
                    />
                    <Text style={TextStyles.button}>
                      {isTransport ? transportAlarm.route.number : manualAlarm.title}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[TextStyles.caption, { color: statusInfo.color, marginRight: 8 }]}>
                      {statusInfo.text}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleToggleAlarm(alarm.id, isTransport ? 'transport' : 'manual')}
                    >
                      <Ionicons 
                        name={alarm.isActive ? 'pause' : 'play'} 
                        size={20} 
                        color={Colors.primary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Details */}
                <View style={{ marginTop: 10 }}>
                  {isTransport ? (
                    <>
                      <Text style={TextStyles.caption}>
                        From: {transportAlarm.currentStop.name}
                      </Text>
                      <Text style={TextStyles.caption}>
                        To: {transportAlarm.destination.name}
                      </Text>
                      <Text style={TextStyles.caption}>
                        Alarm: {formatTime(transportAlarm.alarmTime)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={TextStyles.caption}>
                        Time: {formatTime(manualAlarm.time)}
                      </Text>
                      {manualAlarm.repeatDays && manualAlarm.repeatDays.length > 0 && (
                        <Text style={TextStyles.caption}>
                          Repeats: {manualAlarm.repeatDays.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={TextStyles.caption}>
                    Created: {formatDate(alarm.createdAt)}
                  </Text>
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleDeleteAlarm(alarm.id, isTransport ? 'transport' : 'manual')}
                    style={{ marginLeft: 15 }}
                  >
                    <Ionicons name="trash" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={StatusStyles.emptyContainer}>
            <Ionicons name="list" size={64} color={Colors.textLight} />
            <Text style={StatusStyles.emptyText}>
              No {activeTab} alarms found
            </Text>
            <Text style={TextStyles.caption}>
              {activeTab === 'active' 
                ? 'Create a new alarm to get started'
                : 'Completed alarms will appear here'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 