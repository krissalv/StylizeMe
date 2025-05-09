import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import appBgImg from "@/assets/images/appBg.png";

export default function OutfitRecommendations() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const recommendations = [
    {
      id: 1,
      title: 'Top',
      items: ['Button-down shirt', 'Blouse', 'Sweater'],
      icon: '👚'
    },
    {
      id: 2,
      title: 'Bottom',
      items: ['Tailored pants', 'Skirt', 'Jeans'],
      icon: '👖'
    },
    {
      id: 3,
      title: 'Outerwear',
      items: ['Blazer', 'Cardigan', 'Jacket'],
      icon: '🧥'
    },
    {
      id: 4,
      title: 'Shoes',
      items: ['Loafers', 'Heels', 'Boots'],
      icon: '👞'
    },
    {
      id: 5,
      title: 'Accessories',
      items: ['Watch', 'Scarf', 'Belt'],
      icon: '⌚'
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
          <Text style={styles.title}>Outfit Recommendations</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Your Preferences</Text>
            <Text style={styles.infoText}>Type: {params.type}</Text>
            <Text style={styles.infoText}>Occasion: {params.occasion}</Text>
            <Text style={styles.infoText}>Weather: {params.weather}</Text>
            {params.notes && <Text style={styles.infoText}>Notes: {params.notes}</Text>}
          </View>

          <Text style={styles.sectionTitle}>Recommended Items</Text>
          {recommendations.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              <View style={styles.itemsList}>
                {category.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>• {item}</Text>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              // Here you would typically save the outfit
              router.back();
            }}
          >
            <Text style={styles.saveButtonText}>Save This Outfit</Text>
          </TouchableOpacity>
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
  infoCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#261605',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#261605',
  },
  itemsList: {
    marginLeft: 40,
  },
  itemText: {
    fontSize: 16,
    color: '#261605',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#261605',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#F5E6D3',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 