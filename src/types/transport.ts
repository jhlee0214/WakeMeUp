// Transport-related type definitions for WakeMeUp app

export interface TransportStop {
  id: number;
  name: string;
  type: 'train' | 'bus' | 'tram';
  latitude: number;
  longitude: number;
  distance?: number;
  routes?: Route[];
  suburb?: string;
}

export interface Route {
  id: number;
  name: string;
  number: string;
  type: 'train' | 'bus' | 'tram';
  direction: string;
  nextDeparture?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface NearbyStop extends TransportStop {
  distance: number;
  estimatedTime?: number; // minutes to walk
  suburb: string;
}

export interface Destination {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface AlarmSettings {
  id: string;
  currentStop: TransportStop;
  destination: Destination;
  route: Route;
  alarmTime: Date;
  departureTime: Date;
  arrivalTime: Date;
  isActive: boolean;
  createdAt: Date;
  transportType: 'train' | 'bus' | 'tram';
}

export interface ManualAlarm {
  id: string;
  title: string;
  time: Date;
  isActive: boolean;
  createdAt: Date;
  repeatDays?: number[]; // 0-6 (Sunday-Saturday)
}

export interface PTVResponse {
  stops?: TransportStop[];
  routes?: Route[];
  departures?: Departure[];
  [key: string]: any;
}

export interface Departure {
  id: number;
  routeId: number;
  direction: string;
  scheduledTime: string;
  estimatedTime?: string;
  platform?: string;
  status: 'on-time' | 'delayed' | 'cancelled';
}

export interface GooglePlacesResponse {
  predictions: GooglePlacePrediction[];
  status: string;
}

export interface GooglePlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Navigation parameter types
export type RootStackParamList = {
  Loading: undefined;
  Main: undefined;
  SelectTransport: undefined;
  SelectCurrentStation: { transportType: 'train' | 'bus' | 'tram' };
  SelectRoute: { 
    transportType: 'train' | 'bus' | 'tram';
    currentStop: TransportStop;
  };
  Destination: { 
    transportType: 'train' | 'bus' | 'tram';
    currentStop: TransportStop;
    route: Route;
  };
  AlarmTimeSetting: {
    transportType: 'train' | 'bus' | 'tram';
    currentStop: TransportStop;
    route: Route;
    destination: Destination;
  };
  AlarmPreview: {
    alarmSettings: AlarmSettings;
  };
  ArrivalAlarm: {
    alarmId: string;
  };
  ManualAlarm: undefined;
  History: undefined;
};

// API Error types
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
} 