import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { AlarmProvider } from './src/context/AlarmContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import all screens
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainPage from './src/screens/MainPage';
import SelectTransportPage from './src/screens/SelectTransportPage';
import SelectCurrentStationPage from './src/screens/SelectCurrentStationPage';
import SelectRoutePage from './src/screens/SelectRoutePage';
import DestinationPage from './src/screens/DestinationPage';
import AlarmTimeSettingPage from './src/screens/AlarmTimeSettingPage';
import AlarmPreviewPage from './src/screens/AlarmPreviewPage';
import ArrivalAlarmPage from './src/screens/ArrivalAlarmPage';
import ManualAlarmPage from './src/screens/ManualAlarmPage';
import HistoryPage from './src/screens/HistoryPage';

// Import types
import { RootStackParamList } from './src/types/transport';

// 인증 상태에 따른 네비게이션 컴포넌트
function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsAppLoading(false);
  };

  // 앱 초기 로딩 중
  if (isAppLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // 인증 상태 확인 중
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // 로그인된 경우 - 메인 앱 네비게이션
  return (
    <NavigationContainer
      // Web accessibility configuration
      {...(Platform.OS === 'web' && {
        documentTitle: {
          formatter: (options, route) => 
            `${options?.title ?? route?.name} - WakeMeUp`,
        },
      })}
    >
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainPage}
          options={{
            title: 'WakeMeUp - Smart Transport Alarm',
          }}
        />
        <Stack.Screen 
          name="SelectTransport" 
          component={SelectTransportPage}
          options={{
            title: 'Select Transport Type',
          }}
        />
        <Stack.Screen 
          name="SelectCurrentStation" 
          component={SelectCurrentStationPage}
          options={{
            title: 'Select Current Station',
          }}
        />
        <Stack.Screen 
          name="SelectRoute" 
          component={SelectRoutePage}
          options={{
            title: 'Select Route',
          }}
        />
        <Stack.Screen 
          name="Destination" 
          component={DestinationPage}
          options={{
            title: 'Select Destination',
          }}
        />
        <Stack.Screen 
          name="AlarmTimeSetting" 
          component={AlarmTimeSettingPage}
          options={{
            title: 'Set Alarm Time',
          }}
        />
        <Stack.Screen 
          name="AlarmPreview" 
          component={AlarmPreviewPage}
          options={{
            title: 'Alarm Preview',
          }}
        />
        <Stack.Screen 
          name="ArrivalAlarm" 
          component={ArrivalAlarmPage}
          options={{
            title: 'Alarm Active',
          }}
        />
        <Stack.Screen 
          name="ManualAlarm" 
          component={ManualAlarmPage}
          options={{
            title: 'Manual Alarm',
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryPage}
          options={{
            title: 'Alarm History',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlarmProvider>
          <NavigationContent />
          <StatusBar style="auto" />
        </AlarmProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
