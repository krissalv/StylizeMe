import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import appBgImg from '@/assets/images/appBg.png';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground source={appBgImg} style={styles.image}>
        <Text style={styles.text}>Sign-Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(newText) => setFirstName(newText)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(newText) => setLastName(newText)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          onChangeText={(newText) => setEmail(newText)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(newText) => setUsername(newText)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(newText) => setNewPassword(newText)}
          value={newPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={(newText) => setConfirmPassword(newText)}
          value={confirmPassword}
        />
        <TouchableOpacity style={styles.button}>
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

export default Register;
