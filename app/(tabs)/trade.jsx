import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert, ScrollView, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { getUserProfile, updateUserProfile } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";
import whiteTop from "@/assets/images/whiteTop.png";
import skirt from "@/assets/images/skirt.jpg";
import cardigan from "@/assets/images/cardigan.jpg";
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';

export default function trade() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/welcome');
      } else {
        setUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          setFirstName(profile?.firstName || '');
          setLastName(profile?.lastName || '');
          setUsername(profile?.username || '');
        } catch (error) {
          console.error('Error fetching user profile:', error);
          Alert.alert('Error', 'Failed to load profile data');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <Text style={styles.title}>Feed</Text>

        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}
        showsVerticalScrollIndicator = {false}
        >
            <View style={styles.post}>
                <Text style={styles.backButtonText}>accountName1</Text>
                <Image
                    style={styles.imagePost}
                    source={whiteTop}
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                        <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Entypo name="message" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.post}>
                <Text style={styles.backButtonText}>accountName2</Text>
                <Image
                    style={styles.imagePost}
                    source={skirt}
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                        <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Entypo name="message" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.post}>
                <View style = {{
                    flexDirection: 'row',
                }}>
                    <Text style={styles.backButtonText}>accountName3</Text>
                </View>
                <Image
                    style={styles.imagePost}
                    source={cardigan}
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                        <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Entypo name="message" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart" size={30} color={'#FFF3D8'} />
                    </TouchableOpacity>
                </View>
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
  post: {
    width: 400,                  // fixed width
    height: 400,                 // fixed height
    borderWidth: 5,
    borderRadius: 10,
    borderColor: '#261605',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#FFF3D8',  // makes it visible
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',  // centers vertically
    alignItems: 'center',      
  },
  imagePost: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    marginTop: 10,
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
  },
  profileContainer: {
    backgroundColor: 'rgba(255, 243, 216, 0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#261605',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFF3D8',
    fontSize: 40,
    fontWeight: 'bold',
  },
  emailText: {
    color: '#261605',
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF3D8",
    height: 50,
    marginVertical: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#261605',
    margin: 10,
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',    
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFF3D8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBotton: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    color: '#261605',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: '#261605',
    fontSize: 16,
  },
}); 