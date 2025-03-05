import { StyleSheet, Text, View, ImageBackground, Image, Button } from 'react-native'
import React from 'react'
import {NavigationIndependentTree } from '@react-navigation/native'

import appBgImg from "@/assets/images/appBg.png"
import logo from "@/assets/images/logo.png"

const App = () => {
  return (
    <NavigationIndependentTree>
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
            onPress = {() =>
              navigation.navigate("login")
            }
            title = "Log-In"
            color = "#261605"
          />
          <View style = {styles.space}/>
          <Button 
            onPress = {() =>
              navigation.navigate("register")
            }
            title = "Sign-Up"
            color = "#261605"
          />
        </View>
      </ImageBackground>
    </View>
    </NavigationIndependentTree>
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