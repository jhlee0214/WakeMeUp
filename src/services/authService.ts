import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { User, LoginResult, SocialProvider, TokenInfo } from '../types/auth';
import { AUTH_CONFIG, OAUTH_CONFIG, STORAGE_KEYS } from '../config/auth-config';

// 웹 브라우저 완료를 위한 설정
WebBrowser.maybeCompleteAuthSession();

export class AuthService {
  private static instance: AuthService;

  // 싱글톤 패턴 - 앱 전체에서 하나의 인스턴스만 사용
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Google 로그인
  async signInWithGoogle(): Promise<LoginResult> {
    try {
      console.log('🔐 Google 로그인 시작...');
      
      // Google OAuth 설정
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // 인증 요청 생성
      const request = new AuthSession.AuthRequest({
        clientId: AUTH_CONFIG.google.clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: OAUTH_CONFIG.redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      // 인증 요청 실행
      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        console.log('✅ Google 인증 성공');
        
        // 액세스 토큰으로 사용자 정보 가져오기
        const userInfo = await this.getGoogleUserInfo(result.params.code);
        
        if (userInfo) {
          const user: User = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            photoURL: userInfo.picture,
            provider: 'google',
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };

          // 사용자 정보 저장
          await this.saveUserData(user);
          
          return { success: true, user };
        }
      } else if (result.type === 'cancel') {
        console.log('❌ Google 로그인 취소됨');
        return { success: false, error: '로그인이 취소되었습니다.' };
      }

      return { success: false, error: '로그인에 실패했습니다.' };
    } catch (error) {
      console.error('❌ Google 로그인 오류:', error);
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  }

  // Google 사용자 정보 가져오기
  private async getGoogleUserInfo(code: string): Promise<any> {
    try {
      // 토큰 교환
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: AUTH_CONFIG.google.clientId,
          client_secret: AUTH_CONFIG.google.clientSecret,
          redirect_uri: OAUTH_CONFIG.redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        // 사용자 정보 가져오기
        const userResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
        );
        
        return await userResponse.json();
      }
    } catch (error) {
      console.error('❌ Google 사용자 정보 가져오기 오류:', error);
    }
    return null;
  }

  // Facebook 로그인 (구현 예정)
  async signInWithFacebook(): Promise<LoginResult> {
    // TODO: Facebook 로그인 구현
    console.log('🚧 Facebook 로그인은 아직 구현되지 않았습니다.');
    return { success: false, error: 'Facebook 로그인은 아직 구현되지 않았습니다.' };
  }

  // Twitter 로그인 (구현 예정)
  async signInWithTwitter(): Promise<LoginResult> {
    // TODO: Twitter 로그인 구현
    console.log('🚧 Twitter 로그인은 아직 구현되지 않았습니다.');
    return { success: false, error: 'Twitter 로그인은 아직 구현되지 않았습니다.' };
  }

  // 로그아웃
  async signOut(): Promise<void> {
    try {
      console.log('🔓 로그아웃 중...');
      
      // 저장된 데이터 삭제
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.AUTH_STATE,
      ]);
      
      console.log('✅ 로그아웃 완료');
    } catch (error) {
      console.error('❌ 로그아웃 오류:', error);
    }
  }

  // 사용자 데이터 저장
  async saveUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      console.log('💾 사용자 데이터 저장 완료');
    } catch (error) {
      console.error('❌ 사용자 데이터 저장 오류:', error);
    }
  }

  // 사용자 데이터 가져오기
  async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ 사용자 데이터 가져오기 오류:', error);
      return null;
    }
  }

  // 토큰 저장
  async saveToken(tokenInfo: TokenInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenInfo.accessToken);
      if (tokenInfo.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenInfo.refreshToken);
      }
    } catch (error) {
      console.error('❌ 토큰 저장 오류:', error);
    }
  }

  // 토큰 가져오기
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('❌ 토큰 가져오기 오류:', error);
      return null;
    }
  }

  // 인증 상태 확인
  async isAuthenticated(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      const token = await this.getToken();
      return !!(userData && token);
    } catch (error) {
      console.error('❌ 인증 상태 확인 오류:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const authService = AuthService.getInstance(); 