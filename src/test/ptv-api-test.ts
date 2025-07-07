import * as crypto from 'crypto';
import fetch from 'node-fetch';
import { PTV_API_KEY, PTV_USER_ID, PTV_BASE_URL } from '../ptv-config';

// Haversine formula to calculate distance between two coordinates (in meters)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate signature function (excluding Base URL)
function generateSignature(requestPathWithQuery: string): string {
  return crypto
    .createHmac('sha1', PTV_API_KEY)
    .update(requestPathWithQuery)
    .digest('hex')
    .toUpperCase();
}

// Stop type definition
type Stop = {
  stop_name: string;
  stop_latitude: number;
  stop_longitude: number;
  [key: string]: any;
};

type StopWithDistance = Stop & { distance: number };

// API response type definition
type PTVResponse = {
  stops?: Stop[];
  [key: string]: any;
};

// Fetch nearby tram stops (route type 1), display name, location, distance, sorted by proximity
async function fetchNearbyTramStops(latitude: number, longitude: number): Promise<void> {
  let endpoint = `/v3/stops/location/${latitude},${longitude}?route_types=1&max_results=10&max_distance=700`;
  endpoint += endpoint.includes('?') ? `&devid=${PTV_USER_ID}` : `?devid=${PTV_USER_ID}`;
  const signature = generateSignature(endpoint);
  const signedUrl = `${PTV_BASE_URL}${endpoint}&signature=${signature}`;

  try {
    const response = await fetch(signedUrl);
    const data = await response.json() as PTVResponse;
          if (data.stops && Array.isArray(data.stops)) {
        // Add distance calculation to each stop
        const stopsWithDistance: StopWithDistance[] = data.stops.map((stop: Stop) => ({
          ...stop,
          distance: getDistance(
            latitude,
            longitude,
            stop.stop_latitude,
            stop.stop_longitude
          ),
        }));
        // Sort by distance
        stopsWithDistance.sort((a, b) => a.distance - b.distance);

        stopsWithDistance.forEach((stop, idx) => {
          console.log(
            `[${idx + 1}] ${stop.stop_name} (${stop.stop_latitude}, ${stop.stop_longitude}) - Distance: ${stop.distance.toFixed(1)}m`
          );
        });
      } else {
        console.log('No tram stops found.');
      }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Test coordinates: Highpoint Shopping Centre, Maribyrnong, Victoria
const testLat = -37.771221;
const testLng = 144.888086;

fetchNearbyTramStops(testLat, testLng);