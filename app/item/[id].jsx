import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { getItem, updateItem, deleteItem } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [fullDescription, setDescription] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/');
      } else {
        setUser(user);
        try {
          const itemData = await getItem(id);
          if (itemData) {
            setItem(itemData);
            setTitle(itemData.title || '');
            setDescription(itemData.fullDescription || '');
          } else {
            Alert.alert('Error', 'Item not found');
            router.back();
          }
        } catch (error) {
          console.error('Error fetching item:', error);
          Alert.alert('Error', 'Failed to load item data');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSaveItem = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your item');
      return;
    }

    setLoading(true);
    try {
      const updatedItem = {
        title: title.trim(),
        fullDescription: fullDescription.trim(),
      };
      
      await updateItem(id, updatedItem);
      setItem({ ...item, ...updatedItem });
      setIsEditing(false);
      Alert.alert('Success', 'Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(id);
              Alert.alert('Success', 'Item deleted successfully');
              router.back();
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user || !item) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Outfit Details</Text>
            
            <View style={styles.itemContainer}>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Style Name"
                    value={title}
                    onChangeText={setTitle}
                  />
                  
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Outfit Description"
                    value={fullDescription}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                  />
                  
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => {
                        setIsEditing(false);
                        setTitle(item.title || '');
                        setDescription(item.fullDescription || '');
                      }}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={handleSaveItem}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Style Name:</Text>
                    <Text style={styles.value}>{item.title}</Text>
                  </View>
                  
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Outfit Description:</Text>
                    <Text style={styles.value}>{item.fullDescription || 'No description'}</Text>
                  </View>
                  
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Created:</Text>
                    <Text style={styles.value}>
                      {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                    </Text>
                  </View>
                  
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => setIsEditing(true)}
                    >
                      <Text style={styles.buttonText}>Edit Item</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.button, styles.deleteButton]}
                      onPress={handleDeleteItem}
                    >
                      <Text style={styles.buttonText}>Delete Item</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#261605',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#261605',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 243, 216, 0.9)',
    borderRadius: 15,
    padding: 20,
  },
  input: {
    backgroundColor: "#FFF3D8",
    height: 50,
    marginVertical: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    fontSize: 16,
    width: '100%',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#261605',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  infoContainer: {
    marginVertical: 15,
  },
  label: {
    color: '#261605',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    color: '#261605',
    fontSize: 16,
    lineHeight: 24,
  },
}); 