import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginResult } from '../types/auth';
import { authService } from '../services/authService';

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  // 상태
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // 메서드
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 컨텍스트 사용을 위한 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 인증 프로바이더 컴포넌트
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 인증 상태 관리
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // 앱 시작 시 저장된 사용자 정보 확인
  useEffect(() => {
    checkAuthState();
  }, []);

  // 인증 상태 확인
  const checkAuthState = async () => {
    try {
      console.log('🔍 저장된 인증 상태 확인 중...');
      
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const userData = await authService.getUserData();
        if (userData) {
          setAuthState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          console.log('✅ 기존 로그인 상태 확인됨');
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        console.log('❌ 로그인되지 않은 상태');
      }
    } catch (error) {
      console.error('❌ 인증 상태 확인 오류:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: '인증 상태 확인 중 오류가 발생했습니다.',
      });
    }
  };

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result: LoginResult = await authService.signInWithGoogle();
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        console.log('🎉 Google 로그인 성공!');
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '로그인에 실패했습니다.',
        }));
        console.log('❌ Google 로그인 실패:', result.error);
      }
    } catch (error) {
      console.error('❌ Google 로그인 오류:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '로그인 중 오류가 발생했습니다.',
      }));
    }
  };

  // Facebook 로그인
  const signInWithFacebook = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result: LoginResult = await authService.signInWithFacebook();
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        console.log('🎉 Facebook 로그인 성공!');
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '로그인에 실패했습니다.',
        }));
        console.log('❌ Facebook 로그인 실패:', result.error);
      }
    } catch (error) {
      console.error('❌ Facebook 로그인 오류:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '로그인 중 오류가 발생했습니다.',
      }));
    }
  };

  // Twitter 로그인
  const signInWithTwitter = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result: LoginResult = await authService.signInWithTwitter();
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        console.log('🎉 Twitter 로그인 성공!');
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '로그인에 실패했습니다.',
        }));
        console.log('❌ Twitter 로그인 실패:', result.error);
      }
    } catch (error) {
      console.error('❌ Twitter 로그인 오류:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '로그인 중 오류가 발생했습니다.',
      }));
    }
  };

  // 게스트 로그인
  const signInAsGuest = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const guestUser: User = {
        id: 'guest_' + Date.now(),
        email: '',
        name: '게스트',
        photoURL: undefined,
        provider: 'guest',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      // 게스트 사용자 정보 저장
      await authService.saveUserData(guestUser);
      
      setAuthState({
        user: guestUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      
      console.log('🎭 게스트 로그인 완료');
    } catch (error) {
      console.error('❌ 게스트 로그인 오류:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '게스트 로그인 중 오류가 발생했습니다.',
      }));
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.signOut();
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      console.log('👋 로그아웃 완료');
    } catch (error) {
      console.error('❌ 로그아웃 오류:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: '로그아웃 중 오류가 발생했습니다.',
      }));
    }
  };

  // 오류 메시지 초기화
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // 컨텍스트 값
  const contextValue: AuthContextType = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInAsGuest,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 