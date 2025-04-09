import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
        <Text style={styles.title}>Explore Styles</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <MaterialIcons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  searchButton: {
    padding: 10,
  },
  content: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    color: '#333',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 