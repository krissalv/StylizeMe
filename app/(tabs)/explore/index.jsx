import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import appBgImg from "@/assets/images/appBg.png";

export default function Explore() {
  const router = useRouter();

  const categories = [
    {
      id: 1,
      title: 'Casual',
      icon: '👕',
      description: 'Everyday comfortable styles',
    },
    {
      id: 2,
      title: 'Formal',
      icon: '👔',
      description: 'Professional and business attire',
    },
    {
      id: 3,
      title: 'Sportswear',
      icon: '⚽',
      description: 'Active and athletic wear',
    },
    {
      id: 4,
      title: 'Evening',
      icon: '🌙',
      description: 'Elegant evening wear',
    },
  ];

  const handleCategoryPress = (category) => {
    // Navigate to category details
    router.push({
      pathname: '/item/[id]',
      params: { id: category.id.toString() }
    });
  };

  const handleSearchPress = () => {
    // Navigate to search screen
    router.push('/search');
  };

  const handlePlanOutfit = () => {
    // Navigate to plan outfit screen
    router.push('/plan-outfit');
  };

  const handleViewTips = () => {
    // Navigate to style tips screen
    router.push('/style-tips');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
          <Text style={styles.title}>Explore Styles</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchPress}
          >
            <MaterialIcons name="search" size={24} color="#F5E6D3" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Quick Actions Section */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4A3B2B' }]}
              onPress={handlePlanOutfit}
            >
              <MaterialIcons name="style" size={24} color="#F5E6D3" />
              <Text style={styles.actionText}>Plan Outfit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#8B4513' }]}
              onPress={handleViewTips}
            >
              <MaterialIcons name="lightbulb" size={24} color="#F5E6D3" />
              <Text style={styles.actionText}>View Tips</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#261605',
  },
  searchButton: {
    padding: 10,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    color: '#F5E6D3',
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#261605',
    textAlign: 'center',
  },
}); 