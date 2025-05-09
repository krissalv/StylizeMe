import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { addItem } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import appBgImg from "../assets/images/appBg.png";
import { ImageBackground } from 'react-native';

export default function CreateOutfit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateOutfit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your outfit');
      return;
    }

    try {
      const outfitData = {
        title: title.trim(),
        description: description.trim(),
        type: 'outfit',
        imageUri: image,
      };

      await addItem(user.uid, outfitData);
      Alert.alert('Success', 'Outfit created successfully!');
      router.back();
    } catch (error) {
      console.error('Error creating outfit:', error);
      Alert.alert('Error', 'Failed to create outfit. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={appBgImg}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create New Outfit</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#F5E6D3" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Outfit Title"
          placeholderTextColor="#F5E6D3"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          placeholderTextColor="#F5E6D3"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateOutfit}>
          <Text style={styles.buttonText}>Create Outfit</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#F5E6D3',
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    color: '#F5E6D3',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A3B2B',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#F5E6D3',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 