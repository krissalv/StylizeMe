import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import appBgImg from "@/assets/images/appBg.png";

export default function StyleTips() {
  const router = useRouter();

  const styleTips = [
    {
      id: 1,
      title: 'Color Coordination',
      tip: 'Use the color wheel to create harmonious outfits. Complementary colors (opposite on the wheel) create bold looks, while analogous colors (next to each other) create harmonious looks.',
      icon: '🎨'
    },
    {
      id: 2,
      title: 'Layering Basics',
      tip: 'Start with lighter pieces and add heavier ones on top. Mix textures and lengths for visual interest. Remember: thin to thick, short to long.',
      icon: '👔'
    },
    {
      id: 3,
      title: 'Accessorizing',
      tip: 'Less is more. Choose one statement piece and build around it. Mix metals carefully and consider the occasion when selecting accessories.',
      icon: '💍'
    },
    {
      id: 4,
      title: 'Fit Matters',
      tip: 'Clothes that fit well look more expensive. Focus on proper fit in shoulders, waist, and length. Tailoring can transform basic pieces.',
      icon: '📏'
    },
    {
      id: 5,
      title: 'Seasonal Transitions',
      tip: 'Layer lightweight pieces for spring/fall. Use scarves and jackets to adapt summer clothes for cooler weather.',
      icon: '🌤️'
    }
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#261605" />
          </TouchableOpacity>
          <Text style={styles.title}>Style Tips</Text>
        </View>

        <ScrollView style={styles.content}>
          {styleTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipText}>{tip.tip}</Text>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261605',
  },
  image: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#261605',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tipCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#261605',
  },
  tipText: {
    fontSize: 16,
    color: '#261605',
    lineHeight: 24,
  },
}); 