import { StyleSheet, Platform } from 'react-native';

// Color theme for WakeMeUp app
export const Colors = {
  background: '#F5F5DC', // Beige background
  button: '#E8D5B5', // Light beige button
  text: '#333', // Dark gray text
  textLight: '#666', // Light gray text
  primary: '#8B7355', // Brown primary
  secondary: '#D2B48C', // Tan secondary
  accent: '#CD853F', // Peru accent
  error: '#DC143C', // Crimson error
  success: '#228B22', // Forest green success
  warning: '#FF8C00', // Dark orange warning
  white: '#FFFFFF',
  shadow: '#000000',
};

// Common button styles
export const ButtonStyles = StyleSheet.create({
  primary: {
    width: '80%',
    height: 80,
    backgroundColor: Colors.button,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: 10,
    // Web accessibility
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      outline: 'none',
      ':focus': {
        outline: `2px solid ${Colors.primary}`,
        outlineOffset: '2px',
      },
    }),
  },
  secondary: {
    width: '80%',
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.button,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 8,
    // Web accessibility
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      outline: 'none',
      ':focus': {
        outline: `2px solid ${Colors.primary}`,
        outlineOffset: '2px',
      },
    }),
  },
  small: {
    width: '40%',
    height: 50,
    backgroundColor: Colors.button,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 5,
    // Web accessibility
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      outline: 'none',
      ':focus': {
        outline: `2px solid ${Colors.primary}`,
        outlineOffset: '2px',
      },
    }),
  },
});

// Common text styles
export const TextStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  error: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 5,
  },
  success: {
    fontSize: 14,
    color: Colors.success,
    textAlign: 'center',
    marginTop: 5,
  },
});

// Common container styles
export const ContainerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    // Web accessibility
    ...(Platform.OS === 'web' && {
      outline: 'none',
    }),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    // Web accessibility
    ...(Platform.OS === 'web' && {
      outline: 'none',
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

// Common loading and error styles
export const StatusStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
});

// Additional exports for LoginScreen
export const colors = {
  background: Colors.background,
  primary: Colors.primary,
  secondary: Colors.secondary,
  textPrimary: Colors.text,
  textSecondary: Colors.textLight,
  white: Colors.white,
  error: Colors.error,
  success: Colors.success,
};

export const fonts = {
  small: 14,
  medium: 16,
  large: 18,
  extraLarge: 28,
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 20,
  extraLarge: 32,
}; 