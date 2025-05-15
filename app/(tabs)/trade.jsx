import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert, ScrollView, Platform, Modal, Image } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import top from "@/assets/images/top.jpg";
import dress from "@/assets/images/dress.jpg";

export default function trade() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [likedPosts, setLikedPosts] = useState({});


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

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
    });

    if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
    }
  };

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
    }));
  };

  const handleCloseTradeModal = () => {
    setSelectedImage(null);       
    setModalVisible(false);       
  };

  const handleCloseMessageModal = () => {
  setNewItemTitle('');          
  setModalMessageVisible(false);
};
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <Text style={styles.title}>Trading Market</Text>

        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}
        showsVerticalScrollIndicator = {false}
        >
            <View style={styles.post}>
                <Text style={styles.backButtonText}>ksalv003</Text>
                <Image
                    style={styles.imagePost}
                    source={whiteTop}
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10, width: '100%' }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                        <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => setModalMessageVisible(true)}>
                            <Entypo name="message" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => toggleLike('post1')}>
                            <Ionicons
                                name="heart"
                                size={30}
                                color={likedPosts['post1'] ? 'red' : '#FFF3D8'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.post}>
                <Text style={styles.backButtonText}>sSparkJay</Text>
                <Image
                    style={styles.imagePost}
                    source={skirt}
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10, width: '100%' }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setModalMessageVisible(true)}>
                            <Entypo name="message" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => toggleLike('post2')}>
                            <Ionicons
                                name="heart"
                                size={30}
                                color={likedPosts['post2'] ? 'red' : '#FFF3D8'}
                            />
                        </TouchableOpacity>                    
                    </View>
                </View>
            </View>

            <View style={styles.post}>
                <View style = {{
                    flexDirection: 'row',
                }}>
                    <Text style={styles.backButtonText}>Jessie.Day</Text>
                </View>
                <Image
                    style={styles.imagePost}
                    source={cardigan}
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10, width: '100%' }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setModalMessageVisible(true)}>
                            <Entypo name="message" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => toggleLike('post3')}>
                            <Ionicons
                                name="heart"
                                size={30}
                                color={likedPosts['post3'] ? 'red' : '#FFF3D8'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.post}>
                <View style = {{
                    flexDirection: 'row',
                }}>
                    <Text style={styles.backButtonText}>lexRes02</Text>
                </View>
                <Image
                    style={styles.imagePost}
                    source={top}
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10, width: '100%' }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setModalMessageVisible(true)}>
                            <Entypo name="message" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => toggleLike('post4')}>
                            <Ionicons
                                name="heart"
                                size={30}
                                color={likedPosts['post4'] ? 'red' : '#FFF3D8'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.post}>
                <View style = {{
                    flexDirection: 'row',
                }}>
                    <Text style={styles.backButtonText}>oogwaybom</Text>
                </View>
                <Image
                    style={styles.imagePost}
                    source={dress}
                />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10, width: '100%' }}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Octicons name="arrow-switch" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setModalMessageVisible(true)}>
                            <Entypo name="message" size={30} color={'#FFF3D8'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => toggleLike('post5')}>
                            <Ionicons
                                name="heart"
                                size={30}
                                color={likedPosts['post5'] ? 'red' : '#FFF3D8'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Offer a Trade</Text>
                <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload an Image from Gallery</Text>
                    <AntDesign name="upload" size={24} color="#F5E6D3" />
                </TouchableOpacity>
                {selectedImage && (
                    <Image
                    source={{ uri: selectedImage }}
                    style={{
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    marginBottom: 10,
                    }}
                    resizeMode="cover"
                    />
                )}
                <View style = {styles.buttonRow}>
                    <TouchableOpacity style = {styles.button2} onPress={() => handleCloseTradeModal()}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCloseTradeModal()} style={styles.button3}>
                        <Text style={styles.buttonText2}>Cancel</Text>
                    </TouchableOpacity>

                </View>
                </View>
            </View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalMessageVisible}
            onRequestClose={() => setModalMessageVisible(false)}
            >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Send Message to Owner</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Message..."
                    value={newItemTitle}
                    onChangeText={setNewItemTitle}
                />
                <View style = {styles.buttonRow}>
                    <TouchableOpacity style = {styles.button2} onPress={() => handleCloseMessageModal()}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCloseMessageModal()} style={styles.button3}>
                        <Text style={styles.buttonText2}>Cancel</Text>
                    </TouchableOpacity>

                </View>
                </View>
            </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post: {
    width: 350,                  
    height: 350,                 
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
    width: 250,
    height: 250,
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
    marginTop: 35,
    color: '#261605',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5, 
  },
  title: {
    color: '#261605',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '15%',
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
    height: 150,
    marginVertical: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    fontSize: 16,
    width: '100%',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#261605',
    margin: 10,
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  button2: {
    backgroundColor: '#4A3B2B',
    margin: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  button3: {
    backgroundColor: '#FFF3D8',
    borderWidth: 3, 
    borderColor: '#261605',
    margin: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  buttonText: {
    color: '#FFF3D8',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText2: {
    color: '#261605',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
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
  modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  maxHeight: '90%',
  backgroundColor: '#FFF3D8',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
borderWidth:3,
  borderColor: '#261605',
  padding: 20,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#261605',
},
uploadButton: {
  backgroundColor: '#261605',
  padding: 15,
  borderRadius: 10,
  marginVertical: 10,
  width: '100%',
  alignItems: 'center',
},
uploadButtonText: {
  color: '#FFF3D8',
  fontWeight: 'bold',
  fontSize: 16,
},

}); 