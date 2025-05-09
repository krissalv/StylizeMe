import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import appBgImg from "@/assets/images/appBg.png";
import logo from "@/assets/images/logo.png";

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
            <Image
              source={logo}
              style={{ alignSelf: 'center', width: 300, height: 200, resizeMode: "contain", marginBottom: -25  }}
            />
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
              <Text style={styles.loginButtonText}>Login</Text>
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
    padding: 60,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
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
    borderWidth: 3,
    borderRadius: 15, 
    borderColor: '#261605',
    backgroundColor: '#FFF3D8',
  },
  buttonText: {
    color: '#FFF3D8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButtonText: {
    color: '#261605',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 