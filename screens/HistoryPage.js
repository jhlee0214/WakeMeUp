import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeButton from '../components/HomeButton';

const HistoryPage = () => {
  const navigation = useNavigation();

  // Mock data for history items
  const historyItems = [
    {
      id: '1',
      transport: 'Tram',
      destination: 'Flinders Street Station',
      date: '2024-03-15',
    },
    {
      id: '2',
      transport: 'Bus',
      destination: 'Melbourne Central',
      date: '2024-03-14',
    },
    {
      id: '3',
      transport: 'Train',
      destination: 'Southern Cross Station',
      date: '2024-03-13',
    },
  ];

  const handleHistoryItemPress = (item) => {
    navigation.navigate('SelectTransport', {
      transport: item.transport,
      destination: item.destination,
    });
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistoryItemPress(item)}
    >
      <View style={styles.historyItemContent}>
        <Text style={styles.transportText}>{item.transport}</Text>
        <Text style={styles.destinationText}>{item.destination}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HomeButton />
      <Text style={styles.title}>History</Text>

      <FlatList
        data={historyItems}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#E8D5B5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  historyItemContent: {
    flex: 1,
  },
  transportText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  destinationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#666',
    marginLeft: 10,
  },
});

export default HistoryPage; 