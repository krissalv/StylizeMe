import { Platform } from 'react-native';

/**
 * Utility functions for handling platform-specific code
 */

// Check if running on web
export const isWeb = Platform.OS === 'web';

// Check if running on iOS
export const isIOS = Platform.OS === 'ios';

// Check if running on Android
export const isAndroid = Platform.OS === 'android';

// Check if running on mobile (iOS or Android)
export const isMobile = isIOS || isAndroid;

// Get platform-specific value
export const getPlatformValue = (options) => {
  if (isWeb && options.web !== undefined) {
    return options.web;
  } else if (isIOS && options.ios !== undefined) {
    return options.ios;
  } else if (isAndroid && options.android !== undefined) {
    return options.android;
  }
  return options.default;
};

/**
 * Platform-specific component selection
 * 
 * Instead of using dynamic requires (which don't work in React Native),
 * use this pattern in your components:
 * 
 * import { Platform } from 'react-native';
 * 
 * // Import all platform variants
 * import DefaultComponent from './Component';
 * import WebComponent from './Component.web';
 * import IOSComponent from './Component.ios';
 * import AndroidComponent from './Component.android';
 * 
 * // Then use this function to select the right component
 * const Component = getPlatformComponent({
 *   default: DefaultComponent,
 *   web: WebComponent,
 *   ios: IOSComponent,
 *   android: AndroidComponent
 * });
 * 
 * export default Component;
 */
export const getPlatformComponent = (components) => {
  if (isWeb && components.web) {
    return components.web;
  } else if (isIOS && components.ios) {
    return components.ios;
  } else if (isAndroid && components.android) {
    return components.android;
  }
  return components.default;
}; 