import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ImageBackground, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { getUserProfile, getUserItems, addItem, deleteItem } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/welcome');
        return;
      }

      setUser(currentUser);
      try {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
        const userItems = await getUserItems(currentUser.uid);
        setItems(userItems);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/welcome');
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5E6D3" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            const currentUser = auth.currentUser;
            if (currentUser) {
              getUserProfile(currentUser.uid)
                .then(setUserProfile)
                .then(() => getUserItems(currentUser.uid))
                .then(setItems)
                .catch(setError)
                .finally(() => setLoading(false));
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="light" />
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome, {userProfile?.firstName || 'User'}</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            {items.length === 0 ? (
              <Text style={styles.emptyText}>No items yet. Add your first item!</Text>
            ) : (
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
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Title"
              value={newItemTitle}
              onChangeText={setNewItemTitle}
              placeholderTextColor="#F5E6D3"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Item Description"
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              multiline
              placeholderTextColor="#F5E6D3"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddItem}
            >
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#261605',
  },
  loadingText: {
    color: '#F5E6D3',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#261605',
    padding: 20,
  },
  errorText: {
    color: '#F5E6D3',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A3B2B',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#F5E6D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5E6D3',
  },
  settingsButton: {
    padding: 10,
  },
  settingsButtonText: {
    color: '#F5E6D3',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
  },
  emptyText: {
    color: '#F5E6D3',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#F5E6D3',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#8B0000',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#F5E6D3',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    color: '#F5E6D3',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4A3B2B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F5E6D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});