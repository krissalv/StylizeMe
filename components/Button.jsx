import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { isWeb, getPlatformValue } from '../utils/platform';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled = false,
  ...props 
}) => {
  // Platform-specific styles
  const buttonStyles = getPlatformValue({
    web: {
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
    },
    ios: {
      opacity: disabled ? 0.5 : 1,
    },
    android: {
      elevation: disabled ? 0 : 2,
    },
    default: {},
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
  disabledText: {
    color: '#888888',
  },
});

export default Button; 