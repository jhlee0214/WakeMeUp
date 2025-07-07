// 사용자 정보 인터페이스
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: 'google' | 'facebook' | 'twitter' | 'anonymous' | 'guest';
  createdAt: Date;
  lastLoginAt: Date;
}

// 인증 상태 인터페이스
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// 소셜 로그인 제공업체 타입
export type SocialProvider = 'google' | 'facebook' | 'twitter';
export type UserProvider = 'google' | 'facebook' | 'twitter' | 'anonymous' | 'guest';

// 로그인 결과 인터페이스

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

// 소셜 로그인 설정 인터페이스
export interface SocialLoginConfig {
  google: {
    clientId: string;
    clientSecret: string;
  };
  facebook: {
    appId: string;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
  };
}

// 토큰 정보 인터페이스
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
}

// 소셜 로그인 응답 인터페이스
export interface SocialLoginResponse {
  type: 'success' | 'cancel' | 'error';
  user?: User;
  error?: string;
  tokenInfo?: TokenInfo;
} 