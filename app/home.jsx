import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, TouchableOpacity, Touchable } from 'react-native';
import axios from 'axios'; 

import appBgImg from "@/assets/images/appBg.png";

//const [fashionNews, setFashionNews] = useState([]);

const HomeScreen = () => {
  



  const generateOutfit = () =>{
    fetch("https://api.openai.com/v1/responses", {
      method: "POST", 
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer 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`
      },
      body:JSON.stringify({
        "model": "gpt-4o",
        "input":[
          {
            role: "user",
            content: [
              {type: "input_text", text: "Build me a Shoujo outfit around this piece."},
              {
                type: "input_image",
                image_url: "https://i.pinimg.com/736x/32/c5/66/32c5660ca6b74df63344aecd56a9341a.jpg"
              }
            ]
          }
        ]
      })
    }).then((response) => response.json()).then((data)=>{
        console.log(data)
    }) 
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
      <Text style = {styles.header}>Welcome Back!</Text>
      <View style = {styles.smallerContainer}>
        <Text style = {styles.title}>Let's Build an Outift!</Text>
        <TouchableOpacity 
          style = {styles.button}
          onPress = {generateOutfit}
        >
          <Text style = {styles.buttonText}>Start!</Text>
        </TouchableOpacity> 
      </View>
      <View style = {styles.space}></View>
      <View style = {styles.smallerContainer}>
        <Text style = {styles.containerHeader}>Recent Fashion Sustainability News</Text>
      </View>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;  // Ensure this is exported correctly

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  smallerContainer: {
    borderColor: '#261605',
    borderWidth: 2, 
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 30,
    borderRadius: 14,
    backgroundColor: '#FFF3D8',
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerHeader: {
    color: '#261605',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 3,
    paddingHorizontal: 6, 
  },
  header: {
    color: '#261605',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'left',
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: '#261605',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 30,
    marginVertical: 7,
  },
  title:{
    color: '#261605',
    fontWeight:'bold',
    textAlign: 'center', 
    fontSize: 50,
  },
  buttonText: {
    color: '#FFF3D8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});