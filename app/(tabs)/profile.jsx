import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { getUserProfile, updateUserProfile } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/welcome');
      } else {
        setUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          setFirstName(profile?.firstName || '');
          setLastName(profile?.lastName || '');
          setUsername(profile?.username || '');
        } catch (error) {
          console.error('Error fetching user profile:', error);
          Alert.alert('Error', 'Failed to load profile data');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
      };
      
      await updateUserProfile(user.uid, updatedProfile);
      setUserProfile({ ...userProfile, ...updatedProfile });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
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

  if (!user) {
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

            <Text style={styles.title}>Profile</Text>
            
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userProfile?.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </Text>
              </View>
              
              <Text style={styles.emailText}>{user.email}</Text>
              
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                  
                  <View style={styles.buttonRow}>
                   <TouchableOpacity 
                      style={styles.button}
                      onPress={handleSaveProfile}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => {
                        setIsEditing(false);
                        setFirstName(userProfile?.firstName || '');
                        setLastName(userProfile?.lastName || '');
                        setUsername(userProfile?.username || '');
                      }}
                    >
                      <Text style={styles.buttonText2}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{userProfile?.firstName || 'Not set'}</Text>
                  </View>
                  
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <Text style={styles.value}>{userProfile?.lastName || 'Not set'}</Text>
                  </View>
                  
                  <View style={styles.infoContainer}>
                    <Text style={styles.label}>Username:</Text>
                    <Text style={styles.value}>{userProfile?.username || 'Not set'}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>
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
  profileContainer: {
    backgroundColor: 'rgba(255, 243, 216, 0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#261605',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFF3D8',
    fontSize: 40,
    fontWeight: 'bold',
  },
  emailText: {
    color: '#261605',
    fontSize: 16,
    marginBottom: 20,
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
  button: {
    backgroundColor: '#261605',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#FFF3D8',
    borderWidth: 3, 
    borderColor: '#261605',

  },
  buttonText: {
    color: '#FFF3D8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText2: {
    color: '#261605',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    color: '#261605',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: '#261605',
    fontSize: 16,
  },
}); 