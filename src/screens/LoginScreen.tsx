import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, spacing } from '../styles/common';

export default function LoginScreen() {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInAsGuest,
    clearError,
  } = useAuth();

  // 오류 메시지 표시
  useEffect(() => {
    if (error) {
      Alert.alert('로그인 오류', error, [
        { text: '확인', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  // 로딩 중 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>로그인 상태 확인 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 이미 로그인된 경우
  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>환영합니다!</Text>
          <Text style={styles.welcomeSubtitle}>
            {user.name}님, 이미 로그인되어 있습니다.
          </Text>
          <Text style={styles.welcomeEmail}>{user.email}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 앱 로고 및 제목 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>WakeMeUp</Text>
          <Text style={styles.appSubtitle}>대중교통 알람 앱</Text>
          <Text style={styles.appDescription}>
            실시간 교통 정보로 정확한 알람을 받아보세요
          </Text>
        </View>

        {/* 로그인 버튼들 */}
        <View style={styles.loginSection}>
          <Text style={styles.loginTitle}>로그인</Text>
          <Text style={styles.loginSubtitle}>
            계정을 만들어 개인화된 서비스를 이용하세요
          </Text>

          {/* Google 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={signInWithGoogle}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Google로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* Facebook 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
            onPress={signInWithFacebook}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.facebookIcon}>f</Text>
              <Text style={styles.facebookButtonText}>Facebook으로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* Twitter 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.twitterButton]}
            onPress={signInWithTwitter}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.twitterIcon}>𝕏</Text>
              <Text style={styles.twitterButtonText}>Twitter로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* 게스트 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.guestButton]}
            onPress={signInAsGuest}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestButtonText}>비회원으로 시작하기</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 하단 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            로그인하면{' '}
            <Text style={styles.footerLink}>이용약관</Text>
            {' '}및{' '}
            <Text style={styles.footerLink}>개인정보처리방침</Text>
            에 동의하는 것으로 간주됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.medium,
    color: colors.textSecondary,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  welcomeTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  welcomeSubtitle: {
    fontSize: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  welcomeEmail: {
    fontSize: fonts.small,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: spacing.large,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.extraLarge * 2,
  },
  appTitle: {
    fontSize: fonts.extraLarge,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  appSubtitle: {
    fontSize: fonts.large,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.medium,
  },
  appDescription: {
    fontSize: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.large,
  },
  loginTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  loginSubtitle: {
    fontSize: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  socialButton: {
    height: 56,
    borderRadius: 12,
    marginBottom: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: spacing.medium,
  },
  googleButtonText: {
    fontSize: fonts.medium,
    fontWeight: '600',
    color: '#333333',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  facebookIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: spacing.medium,
  },
  facebookButtonText: {
    fontSize: fonts.medium,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  twitterIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: spacing.medium,
  },
  twitterButtonText: {
    fontSize: fonts.medium,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guestButton: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  guestIcon: {
    fontSize: 18,
    marginRight: spacing.medium,
  },
  guestButtonText: {
    fontSize: fonts.medium,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    paddingBottom: spacing.large,
  },
  footerText: {
    fontSize: fonts.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
}); 