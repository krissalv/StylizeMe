import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ImageBackground, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import appBgImg from "@/assets/images/appBg.png";

export default function PlanOutfit() {
  const router = useRouter();
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [notes, setNotes] = useState('');

  const outfitTypes = [
    {
      id: 1,
      title: 'Business Casual',
      description: 'Professional yet comfortable',
      icon: '👔'
    },
    {
      id: 2,
      title: 'Weekend Casual',
      description: 'Relaxed and comfortable',
      icon: '👕'
    },
    {
      id: 3,
      title: 'Evening Out',
      description: 'Elegant and sophisticated',
      icon: '🌙'
    },
    {
      id: 4,
      title: 'Active Wear',
      description: 'Comfortable for movement',
      icon: '🏃'
    }
  ];

  const handleOutfitSelect = (outfit) => {
    // Here you would typically save the selected outfit and show recommendations
    router.push({
      pathname: '/outfit-recommendations',
      params: { 
        type: outfit.title,
        occasion: occasion,
        weather: weather,
        notes: notes
      }
    });
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#261605" />
          </TouchableOpacity>
          <Text style={styles.title}>Plan Your Outfit</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Occasion</Text>
            <TextInput
              style={styles.input}
              value={occasion}
              onChangeText={setOccasion}
              placeholder="e.g., Work meeting, Date night"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Weather</Text>
            <TextInput
              style={styles.input}
              value={weather}
              onChangeText={setWeather}
              placeholder="e.g., Sunny, Rainy, Cold"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any specific requirements or preferences"
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.sectionTitle}>Select Outfit Type</Text>
          <View style={styles.outfitGrid}>
            {outfitTypes.map((outfit) => (
              <TouchableOpacity
                key={outfit.id}
                style={styles.outfitCard}
                onPress={() => handleOutfitSelect(outfit)}
              >
                <Text style={styles.outfitIcon}>{outfit.icon}</Text>
                <Text style={styles.outfitTitle}>{outfit.title}</Text>
                <Text style={styles.outfitDescription}>{outfit.description}</Text>
              </TouchableOpacity>
            ))}
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
  inputContainer: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#261605',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
  },
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  outfitCard: {
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
  outfitIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  outfitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 5,
    textAlign: 'center',
  },
  outfitDescription: {
    fontSize: 14,
    color: '#261605',
    textAlign: 'center',
  },
}); 