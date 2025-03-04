import { StyleSheet, Text, View, ImageBackground, Image, Button } from 'react-native'
import React from 'react'

import appBgImg from "@/assets/images/appBg.png"
import logo from "@/assets/images/logo.png"

const App = () => {
  return (
    <View style = {styles.container}>
      <ImageBackground
        source = {appBgImg}
        resizeMode = "cover"
        style = {styles.image}
        >
        <Text style = {styles.text}>Welcome to</Text>
        <Image 
          source = {logo}
          style ={{alignSelf: 'center'}}
        />
        <View style = {styles.space}/>
        <View style = {[{width: "70%", margin: 10, alignSelf: 'center'}]}>
          <Button 
            title = "Log-In"
            color = "#261605"
          />
          <View style = {styles.space}/>
          <Button 
            title = "Sign-Up"
            color = "#261605"
          />
        </View>
      </ImageBackground>
    </View>
  )
}

export default App

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
  },
  space: {
    width: 20, 
    height: 20,
  },
})