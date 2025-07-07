import { Platform } from 'react-native';

// Accessibility utilities for web platform
export const getAccessibilityProps = (role?: 'button' | 'link' | 'tab', label?: string) => {
  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    accessibilityRole: role,
    accessibilityLabel: label,
    // Prevent focus issues with aria-hidden
    tabIndex: 0,
    onFocus: (e: any) => {
      // Ensure focus is properly handled
      e.target.style.outline = 'none';
    },
  };
};

// Focus management for web
export const focusableProps = Platform.OS === 'web' ? {
  tabIndex: 0,
  onKeyDown: (e: any) => {
    // Handle keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.target.click();
    }
  },
} : {};

// Prevent aria-hidden issues
export const preventAriaHiddenIssues = Platform.OS === 'web' ? {
  style: {
    outline: 'none',
  },
} : {}; 