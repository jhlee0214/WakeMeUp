import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PTV_API_KEY, PTV_USER_ID, PTV_BASE_URL } from '../ptv-config';

// Haversine formula로 두 좌표 간 거리 계산 (미터 단위)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // 지구 반지름(m)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// stop 타입 정의
type Stop = {
  stop_name: string;
  stop_latitude: number;
  stop_longitude: number;
  [key: string]: any;
};

type StopWithDistance = Stop & { distance: number };

// API 응답 타입 정의
type PTVResponse = {
  stops?: Stop[];
  [key: string]: any;
};

// 시그니처 생성 함수 (Base URL 제외)
const generateSignature = async (requestPathWithQuery: string): Promise<string> => {
  // HMAC-SHA1 구현
  const encoder = new TextEncoder();
  const keyData = encoder.encode(PTV_API_KEY);
  const messageData = encoder.encode(requestPathWithQuery);
  
  // 웹 환경에서는 window.crypto.subtle 사용
  const cryptoAPI = typeof window !== 'undefined' ? window.crypto : crypto;
  
  const cryptoKey = await cryptoAPI.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await cryptoAPI.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = new Uint8Array(signature);
  const signatureHex = Array.from(signatureArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signatureHex.toUpperCase();
};

export default function PTVTestScreen() {
  const [stops, setStops] = useState<StopWithDistance[]>([]);
  const [loading, setLoading] = useState(false);

  // 테스트용: 빅토리아주 마리부농 하이포인트 쇼핑몰 좌표
  const testLat = -37.771221;
  const testLng = 144.888086;

  const fetchNearbyTramStops = async () => {
    setLoading(true);
    try {
      let endpoint = `/v3/stops/location/${testLat},${testLng}?route_types=1&max_results=10&max_distance=700`;
      endpoint += endpoint.includes('?') ? `&devid=${PTV_USER_ID}` : `?devid=${PTV_USER_ID}`;
      
      const signature = await generateSignature(endpoint);
      const signedUrl = `${PTV_BASE_URL}${endpoint}&signature=${signature}`;
      
      // React Native에서는 node-fetch 대신 fetch 사용
      const response = await fetch(signedUrl);
      const data = await response.json() as PTVResponse;
      
      if (data.stops && Array.isArray(data.stops)) {
        // 각 정류장에 거리 계산 추가
        const stopsWithDistance: StopWithDistance[] = data.stops.map((stop: Stop) => ({
          ...stop,
          distance: getDistance(
            testLat,
            testLng,
            stop.stop_latitude,
            stop.stop_longitude
          ),
        }));
        // 거리순 정렬
        stopsWithDistance.sort((a, b) => a.distance - b.distance);
        setStops(stopsWithDistance);
      } else {
        Alert.alert('알림', '트램 정류장을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('오류', 'API 호출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyTramStops();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PTV API 테스트</Text>
      <Text style={styles.subtitle}>근처 트램 정류장 목록</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={fetchNearbyTramStops}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '로딩 중...' : '새로고침'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.stopsList}>
        {stops.map((stop, index) => (
          <View key={index} style={styles.stopItem}>
            <Text style={styles.stopName}>
              [{index + 1}] {stop.stop_name}
            </Text>
            <Text style={styles.stopDetails}>
              좌표: ({stop.stop_latitude}, {stop.stop_longitude})
            </Text>
            <Text style={styles.stopDistance}>
              거리: {stop.distance.toFixed(1)}m
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  stopsList: {
    flex: 1,
  },
  stopItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  stopDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  stopDistance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
}); 