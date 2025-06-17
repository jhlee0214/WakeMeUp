import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HomeButton from '../components/HomeButton';

const DestinationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDestinationSelect = () => {
    navigation.navigate('AlarmTimeSetting', {
      transport: route.params?.transport,
      destination: searchQuery || 'Selected Location',
    });
  };

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>Select Destination</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destination..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Select a location on the map</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleDestinationSelect}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8D5B5',
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mapSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  button: {
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
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default DestinationPage; 