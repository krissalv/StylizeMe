import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import appBgImg from '@/assets/images/appBg.png';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  // Create separate state variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={appBgImg} style={styles.image}>
        <Text style={styles.text}>Log-In</Text>
        
        {/* Username input field */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(newText) => setUsername(newText)}  // Update the username state
          value={username}  // Set value to the username state
        />
        
        {/* Password input field */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(newText) => setPassword(newText)}  // Update the password state
          value={password}  // Set value to the password state
        />
        
        {/* Submit button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  text: {
    color: '#261605',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF3D8',
    height: 40,
    marginVertical: 7,
    marginHorizontal: 30,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#261605',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 30,
    marginVertical: 7,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Login;
