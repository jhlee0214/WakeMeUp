import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import { getAccessibilityProps } from '../utils/accessibility';
import ActiveAlarmBanner from '../components/ActiveAlarmBanner';
import { useAlarm } from '../context/AlarmContext';
import { useAuth } from '../context/AuthContext';

type MainPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface MainPageProps {
  navigation: MainPageNavigationProp;
}

export default function MainPage({ navigation }: MainPageProps) {
  const { activeAlarm } = useAlarm();
  const { user, signOut } = useAuth();
  
  const handleSelectTransport = () => {
    navigation.navigate('SelectTransport');
  };

  const handleManualAlarm = () => {
    navigation.navigate('ManualAlarm');
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: signOut 
        },
      ]
    );
  };

  return (
    <View style={ContainerStyles.screen}>
      <ActiveAlarmBanner 
        onPress={() => {
          if (activeAlarm) {
            navigation.navigate('ArrivalAlarm', { alarmId: activeAlarm.id });
          }
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={ContainerStyles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[TextStyles.title, { color: Colors.white }]}>WakeMeUp</Text>
              <Text style={[TextStyles.caption, { color: Colors.white, opacity: 0.8 }]}>
                Smart Transport Alarm
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          {/* 사용자 정보 */}
          {user && (
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name={user.provider === 'guest' ? 'person-outline' : 'person-circle-outline'} 
                size={20} 
                color={Colors.white} 
              />
              <Text style={[TextStyles.caption, { color: Colors.white, marginLeft: 8 }]}>
                {user.name} {user.provider === 'guest' ? '(비회원)' : `(${user.provider})`}
              </Text>
            </View>
          )}
        </View>

      {/* Main Content */}
      <View style={[ContainerStyles.center, { paddingTop: 40 }]}>
        {/* Select Transport Button */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={handleSelectTransport}
          activeOpacity={0.8}
          {...getAccessibilityProps('button', 'Select Transport')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="train" size={32} color={Colors.text} style={{ marginRight: 15 }} />
            <View>
              <Text style={TextStyles.button}>Select Transport</Text>
              <Text style={[TextStyles.caption, { marginTop: 2 }]}>
                Set alarm based on transport schedule
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Manual Alarm Button */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={handleManualAlarm}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time" size={32} color={Colors.text} style={{ marginRight: 15 }} />
            <View>
              <Text style={TextStyles.button}>Manual Alarm</Text>
              <Text style={[TextStyles.caption, { marginTop: 2 }]}>
                Set a simple time-based alarm
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={handleHistory}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="list" size={32} color={Colors.text} style={{ marginRight: 15 }} />
            <View>
              <Text style={TextStyles.button}>History</Text>
              <Text style={[TextStyles.caption, { marginTop: 2 }]}>
                View your alarm history
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={{ paddingBottom: 30, alignItems: 'center' }}>
        <Text style={TextStyles.caption}>
          Powered by PTV API
        </Text>
        <Text style={TextStyles.caption}>
          Real-time transport information
        </Text>
      </View>
      </ScrollView>
    </View>
  );
} 