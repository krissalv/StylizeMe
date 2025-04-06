import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { auth } from '../config/firebaseConfig';
import { signOutUser, resetPassword } from '../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";

export default function SettingsScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataUsageEnabled, setDataUsageEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/welcome');
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.replace('/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No email address found');
      return;
    }

    try {
      await resetPassword(user.email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Not Implemented', 'Account deletion is not implemented yet.');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Settings</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email</Text>
              <Text style={styles.settingValue}>{user.email}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.settingButtonText}>Reset Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.settingButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#261605' }}
                thumbColor={notificationsEnabled ? '#FFF3D8' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#767577', true: '#261605' }}
                thumbColor={darkModeEnabled ? '#FFF3D8' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Data Usage</Text>
              <Switch
                value={dataUsageEnabled}
                onValueChange={setDataUsageEnabled}
                trackColor={{ false: '#767577', true: '#261605' }}
                thumbColor={dataUsageEnabled ? '#FFF3D8' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => Alert.alert('About', 'StylizeMe is a cross-platform styling app.')}
            >
              <Text style={styles.settingButtonText}>About StylizeMe</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            
            <TouchableOpacity 
              style={[styles.settingButton, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <Text style={styles.settingButtonText}>Sign Out</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Text style={[styles.settingButtonText, styles.deleteButtonText]}>Delete Account</Text>
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
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
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
  section: {
    backgroundColor: 'rgba(255, 243, 216, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#261605',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 22, 5, 0.1)',
  },
  settingLabel: {
    color: '#261605',
    fontSize: 16,
  },
  settingValue: {
    color: '#261605',
    fontSize: 16,
    opacity: 0.7,
  },
  settingButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 22, 5, 0.1)',
  },
  settingButtonText: {
    color: '#261605',
    fontSize: 16,
  },
  signOutButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  deleteButton: {
    borderBottomWidth: 0,
    marginTop: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  deleteButtonText: {
    color: '#ff6b6b',
    textAlign: 'center',
  },
}); 