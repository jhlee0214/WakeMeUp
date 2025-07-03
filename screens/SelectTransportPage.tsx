import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HomeButton from '../components/HomeButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Destination'>;

interface TransportOption {
  name: string;
  icon: string;
}

const SelectTransportPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const transportOptions: TransportOption[] = [
    { name: 'Train', icon: '🚂' },
    { name: 'Bus', icon: '🚌' },
    { name: 'Tram', icon: '🚋' },
  ];

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Select Transport</Text>
      
      {transportOptions.map((option) => (
        <TouchableOpacity
          key={option.name}
          style={styles.button}
          onPress={() => navigation.navigate('Destination', { transport: option.name })}
        >
          <Text style={styles.buttonIcon}>{option.icon}</Text>
          <Text style={styles.buttonText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#E8D5B5',
    width: '80%',
    height: 80,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});

export default SelectTransportPage; 