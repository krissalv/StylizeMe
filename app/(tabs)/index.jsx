import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ImageBackground, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { isWeb, isMobile } from '../../utils/platform';
import { auth } from '../../config/firebaseConfig';
import { getUserProfile, getUserItems, addItem, deleteItem } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";
import logo from "@/assets/images/logo.png";
import * as ImagePicker from "expo-image-picker"

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/welcome');
      } else {
        setUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          const userItems = await getUserItems(user.uid);
          setItems(userItems);
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your item');
      return;
    }

    try {
      const itemData = {
        title: newItemTitle.trim(),
        description: newItemDescription.trim()
      };
      
      await addItem(user.uid, itemData);
      
      // Refresh items list
      const updatedItems = await getUserItems(user.uid);
      setItems(updatedItems);
      
      // Clear input fields
      setNewItemTitle('');
      setNewItemDescription('');
      
      Alert.alert('Success', 'Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      
      // Refresh items list
      const updatedItems = await getUserItems(user.uid);
      setItems(updatedItems);
      
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handleViewItem = (itemId) => {
    router.push(`/item/${itemId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const [image, setImage] = useState(); 

  const uploadImage = async()=> {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect:[1,1],
        quality: 1,
      }); 
      
      if (!result.canceled){
        await saveImage(result.assets[0].uri);
      }
    } catch (error){
      alert("Error uploading image: " + error.message); 
      setModalVisible(false); 
    }
  };

  const saveImage = async(image)=>{
    try {
      setImage(image)
      setModalVisible(false);
    } catch (error){
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Image
              source={logo}
              style={{ alignSelf: 'center', width: 250, height: 150, resizeMode: "contain" }}
            />
          </View>
          <Text style={styles.subtitle}>
            Your personal styling companion
          </Text>

          <View style={styles.userContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, {userProfile?.firstName || user.email}
            </Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push('/profile')}
              >
                <Text style={styles.navButtonText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push('/settings')}
              >
                <Text style={styles.navButtonText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleSignOut}
              >
                <Text style={styles.navButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addItemContainer}>
            <Text style={styles.sectionTitle}>Let's Build an Outfit!</Text>
            <TextInput
              style={styles.input}
              placeholder="Style Name"
              value={newItemTitle}
              onChangeText={setNewItemTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Item Description"
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAddItem}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            {items.length > 0 ? (
              items.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.itemCard}
                  onPress={() => handleViewItem(item.id)}
                >
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteItem(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No items found</Text>
            )}
          </View>

          <View style={styles.platformInfo}>
            <Text style={styles.platformText}>
              Running on: {Platform.OS}
            </Text>
            {isWeb && (
              <Text style={styles.platformText}>
                Web platform detected
              </Text>
            )}
            {isMobile && (
              <Text style={styles.platformText}>
                Mobile platform detected
              </Text>
            )}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#261605',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#261605',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  userContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#F5E6D3',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navButton: {
    backgroundColor: '#4A3B2B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  navButtonText: {
    color: '#F5E6D3',
    fontSize: 14,
  },
  addItemContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: '#261605',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A3B2B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5E6D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#261605',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#8B4513',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#F5E6D3',
    fontSize: 12,
  },
  emptyText: {
    color: '#F5E6D3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  platformInfo: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
  },
  platformText: {
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingText: {
    color: '#F5E6D3',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});