import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/transport';
import { ContainerStyles, TextStyles, ButtonStyles, Colors } from '../styles/common';
import ActiveAlarmBanner from '../components/ActiveAlarmBanner';
import HeaderWithHomeButton from '../components/HeaderWithHomeButton';

type SelectTransportNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectTransport'>;

interface SelectTransportPageProps {
  navigation: SelectTransportNavigationProp;
}

export default function SelectTransportPage({ navigation }: SelectTransportPageProps) {
  const handleTransportSelect = (transportType: 'train' | 'bus' | 'tram') => {
    navigation.navigate('SelectCurrentStation', { transportType });
  };



  return (
    <View style={ContainerStyles.screen}>
      <ActiveAlarmBanner />
      <HeaderWithHomeButton
        navigation={navigation}
        title="Select Transport"
        subtitle="Choose your preferred transport type"
      />

      {/* Transport Options */}
      <ScrollView style={{ flex: 1, paddingTop: 30 }}>
        {/* Train Option */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={() => handleTransportSelect('train')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="train" size={40} color={Colors.primary} style={{ marginRight: 20 }} />
            <View style={{ flex: 1 }}>
              <Text style={TextStyles.button}>Train</Text>
              <Text style={[TextStyles.caption, { marginTop: 4 }]}>
                Metropolitan train services
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
          </View>
        </TouchableOpacity>

        {/* Tram Option */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={() => handleTransportSelect('tram')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="car" size={40} color={Colors.primary} style={{ marginRight: 20 }} />
            <View style={{ flex: 1 }}>
              <Text style={TextStyles.button}>Tram</Text>
              <Text style={[TextStyles.caption, { marginTop: 4 }]}>
                Melbourne tram network
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
          </View>
        </TouchableOpacity>

        {/* Bus Option */}
        <TouchableOpacity
          style={ButtonStyles.primary}
          onPress={() => handleTransportSelect('bus')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="bus" size={40} color={Colors.primary} style={{ marginRight: 20 }} />
            <View style={{ flex: 1 }}>
              <Text style={TextStyles.button}>Bus</Text>
              <Text style={[TextStyles.caption, { marginTop: 4 }]}>
                Bus and coach services
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
          </View>
        </TouchableOpacity>

        {/* Info Card */}
        <View style={[ContainerStyles.card, { marginTop: 30 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={[TextStyles.subtitle, { marginLeft: 10 }]}>How it works</Text>
          </View>
          <Text style={TextStyles.body}>
            1. Select your transport type{'\n'}
            2. Choose your current station{'\n'}
            3. Select your route{'\n'}
            4. Set your destination{'\n'}
            5. Configure alarm time{'\n'}
            6. Get notified when it's time to leave!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 