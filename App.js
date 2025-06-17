import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoadingScreen from './screens/LoadingScreen';
import MainPage from './screens/MainPage';
import SelectTransportPage from './screens/SelectTransportPage';
import DestinationPage from './screens/DestinationPage';
import AlarmTimeSettingPage from './screens/AlarmTimeSettingPage';
import AlarmPreviewPage from './screens/AlarmPreviewPage';
import ArrivalAlarmPage from './screens/ArrivalAlarmPage';
import ManualAlarmPage from './screens/ManualAlarmPage';
import HistoryPage from './screens/HistoryPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="SelectTransport" component={SelectTransportPage} />
        <Stack.Screen name="Destination" component={DestinationPage} />
        <Stack.Screen name="AlarmTimeSetting" component={AlarmTimeSettingPage} />
        <Stack.Screen name="AlarmPreview" component={AlarmPreviewPage} />
        <Stack.Screen name="ArrivalAlarm" component={ArrivalAlarmPage} />
        <Stack.Screen name="ManualAlarm" component={ManualAlarmPage} />
        <Stack.Screen name="History" component={HistoryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
