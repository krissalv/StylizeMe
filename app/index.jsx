import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import { useNavigation } from '@react-navigation/native'; // useNavigation hook to access navigation

import appBgImg from "@/assets/images/appBg.png";
import logo from "@/assets/images/logo.png";
import Login from './login'; // Import your login screen
import Register from './register'; // Import your register screen

const Stack = createStackNavigator(); // Create Stack Navigator

const WelcomePage = () => {
  const navigation = useNavigation(); // Use hook to access navigation

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.text}>Welcome to</Text>
        <Image
          source={logo}
          style={{ alignSelf: 'center' }}
        />
        <View style={styles.space} />
        <View style={[{ width: "70%", margin: 10, alignSelf: 'center' }]}>
          <Button
            onPress={() => navigation.navigate('Login')} // Navigate to Login screen
            title="Log-In"
            color="#261605"
          />
          <View style={styles.space} />
          <Button
            onPress={() => navigation.navigate('Register')} // Navigate to Register screen
            title="Sign-Up"
            color="#261605"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      {/* Disable header for all screens */}
      <Stack.Screen
        name="Welcome"
        component={WelcomePage}
        options={{ headerShown: false }} // Disable header for Welcome screen
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }} // Disable header for Login screen
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }} // Disable header for Register screen
      />
    </Stack.Navigator>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: '#261605',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  space: {
    width: 20,
    height: 20,
  },
});
