import { SocialLoginConfig } from '../types/auth';

// 환경 변수에서 설정을 가져오거나 기본값 사용
export const AUTH_CONFIG: SocialLoginConfig = {
  google: {
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id-here',
    clientSecret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here',
  },
  facebook: {
    appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'your-facebook-app-id-here',
  },
  twitter: {
    apiKey: process.env.EXPO_PUBLIC_TWITTER_API_KEY || 'your-twitter-api-key-here',
    apiSecret: process.env.EXPO_PUBLIC_TWITTER_API_SECRET || 'your-twitter-api-secret-here',
  },
};

// OAuth 리다이렉트 URI 설정
export const OAUTH_CONFIG = {
  redirectUri: 'exp://localhost:8081', // 개발 환경
  // redirectUri: 'wakeup://auth', // 프로덕션 환경 (앱 스킴 사용)
};

// 토큰 저장 키
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_STATE: 'auth_state',
};

// 인증 만료 시간 (밀리초)
export const AUTH_EXPIRY = {
  ACCESS_TOKEN: 3600000, // 1시간
  REFRESH_TOKEN: 2592000000, // 30일
}; 