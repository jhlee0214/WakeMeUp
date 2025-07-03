import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.homeButton}
      onPress={() => navigation.navigate('Main')}
    >
      <Ionicons name="home-outline" size={24} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  homeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    padding: 10,
  },
});

export default HomeButton; 