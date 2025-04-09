import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import appBgImg from "@/assets/images/appBg.png";

export default function WelcomeScreen() {
  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.appName}>Stylize</Text>
            <Text style={styles.appName}>Me</Text>
          </View>
          <Text style={styles.subtitle}>
            Your personal styling companion
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.loginButton]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  appName: {
    color: '#261605',
    fontSize: 42, 
    fontWeight: 'bold', 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#261605',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#261605',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#4A3B2B',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 