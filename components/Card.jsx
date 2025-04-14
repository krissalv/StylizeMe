import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { getPlatformComponent } from '../utils/platform';

// Import platform-specific components
import WebCard from './Card.web';

// Default Card component (for iOS and Android)
const DefaultCard = ({ title, description, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

// Select the appropriate component based on platform
const Card = getPlatformComponent({
  default: DefaultCard,
  web: WebCard,
});

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
  },
}); 