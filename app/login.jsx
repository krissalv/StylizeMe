import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import appBgImg from "@/assets/images/appBg.png"
import logo from "@/assets/images/logo.png"

const login = () => {
    const [text, setText] = useState('');
  return (
    <View style = {styles.container} >
        <ImageBackground
                source = {appBgImg}
                resizeMode = "cover"
                style = {styles.image}
        >
        <Text style = {styles.text}>Log-In</Text>
        
        <TextInput
            style = {styles.input}
            placeholder = "Username"
            onChangeText = {newText => setText(newText)}
            defaultValue = {text}
        />
        <TextInput
            style = {styles.input}
            placeholder = "Password"
            onChangeText = {newText => setText(newText)}
            defaultValue = {text}
        />

        <TouchableOpacity style={{ backgroundColor: '#261605', padding: 10, borderRadius: 15, marginHorizontal: 30, marginVertical: 7}}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1, 
      flexDirection: 'column', 
      marginHorizontal: 16,
    },
    image:{
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
      marginVertical: 10,
    },
    input:{
        backgroundColor: "#FFF3D8",
        height: 40,
        marginVertical: 7, 
        marginHorizontal: 30,
        borderWidth: 2, 
        padding:10,
        borderRadius: 15,
    },
    space: {
      width: 20, 
      height: 20,
    },
  })