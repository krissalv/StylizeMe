import React, { useRef, useState, useEffect } from 'react';
import { Linking, Animated, Dimensions, Modal, ActivityIndicator, View, Text, StyleSheet, ScrollView, Platform, ImageBackground, TouchableOpacity, TextInput, Alert, Image, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { isWeb, isMobile } from '../../utils/platform';
import { auth } from '../../config/firebaseConfig';
import { getUserProfile, getUserItems, addItem, deleteItem } from '../../utils/firebase';
import appBgImg from "@/assets/images/appBg.png";
import logo from "@/assets/images/logo.png";
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from 'expo-image-manipulator';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [visible, setVisible] = useState(false);
  const [output, setOutput] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [showExtras, setShowExtras] = useState(false);
  const animatedHeight = useRef(new Animated.Value(300)).current;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [showOutputOnly, setShowOutputOnly] = useState(false);
  const [articles, setArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState([]);
  const API_KEY = ''; // Replace with your actual API key
  const query = 'fashion sustainability'; // Search query



  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/welcome');
      } else {
        setUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          const userItems = await getUserItems(user.uid);
          setItems(userItems);
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  
useEffect(() => {
  const targetHeight = output !== '' ? SCREEN_HEIGHT : imageUri ? 600 : 300;

  Animated.timing(animatedHeight, {
    toValue: targetHeight,
    duration: 300,
    useNativeDriver: false,
  }).start();
}, [imageUri, output]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  useEffect(() => {
    // Function to fetch the news data
    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=5`);
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const resetFields = () => {
    setNewItemTitle('');
    setImageUri(null);
    setOutput('');
    setLoading(false);
  };
  
  const handleAddItem = async () => {
    if (!newItemTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your item');
      return;
    }

    try {
      const itemData = {
        title: newItemTitle.trim(),
        description: output.length > 150 ? output.slice(0, 150) + '...' : output,
        fullDescription: output,
        image: imageUri || null
      };
      
      await addItem(user.uid, itemData);
      
      // Refresh items list
      const updatedItems = await getUserItems(user.uid);
      setItems(updatedItems);
      
      // Clear input fields
      resetFields();
      setVisible(false);
      
      Alert.alert('Success', 'Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);

      setItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      
      // Refresh items list
      const updatedItems = await getUserItems(user.uid);
      setItems(updatedItems);
      
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handleViewItem = (itemId) => {
    router.push(`/item/${itemId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  }
  const resizeImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 512 } }], // Resize to a width of 512px (safe for API)
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
  
      return manipResult.base64;
    } catch (error) {
      console.error("Error resizing image:", error);
      throw error;
    }
  };
  
  
  const handleImageSelection = async () => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        { text: "Camera", onPress: () => pickFromCamera() },
        { text: "Gallery", onPress: () => pickFromGallery() },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      base64: true, 
    });
  
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const resizedUri = await resizeImage(uri); // Resize the image
      const base64 = result.assets[0].base64;  // Access base64 string
      saveImage(uri, base64);
    }
  };
  
  
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Media library access is required.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      base64: true, // This is important to get the base64 string
    });
  
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const resizedUri = await resizeImage(uri); // Resize the image
      const base64 = result.assets[0].base64;  // Access base64 string
      saveImage(uri, base64);
    }
  };
  

  const saveImage = async (resizedUri, base64) => {
    try {
      setImageUri(resizedUri); // Set URI for image preview
      setImageBase64(base64); 
      setModalVisible(false); // Close modal after image is selected
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };
  
  const generateOutfit = async (styleName) => {
    if (loading) return;
    try {
      console.log("🔍 Style Name:", styleName);
      console.log("🖼️ Base64 Length:", imageBase64?.length);
  
      const resizedBase64 = await resizeImage(imageUri);
      console.log(resizedBase64?.slice(0, 100)); 
      console.log(`Final image string length: ${resizedBase64.length}`);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": "", 
        },
        body: JSON.stringify({
          model: "gpt-4o", 
          messages: [
            {
              role: "user",
              content: [
                {type: "text", text: `Build me a ${styleName} outfit around this piece.`},
                {
                  type: "image_url", 
                  image_url: {
                    url: `data:image/jpeg;base64,${resizedBase64}`
                  }
                }
              ],
            }
          ],
        }),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data?.choices?.[0]?.message?.content) {
        const textResponse = data?.choices[0]?.message?.content;
        const cleanedResponse = textResponse
          .replace(/\*/g, '') // Remove all asterisks
          .replace(/-/g, '•');  // Remove all hyphens
        console.log("Cleaned Output:", cleanedResponse);
        setOutput(cleanedResponse);
        setShowOutputOnly(true); 
      } else {
        setOutput("No content in response.");
      }
    } catch (error) {
      console.error("API error:", error);
      setOutput("Error Generating outfit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={appBgImg}
        resizeMode="cover"
        style={styles.image}
      >
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Image
              source={logo}
              style={{ alignSelf: 'center', width: 250, height: 150, resizeMode: "contain" }}
            />
          </View>
          <Text style={styles.subtitle}>
            Your personal styling companion
          </Text>

          <View style={styles.userContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, {userProfile?.firstName || user.email}
            </Text>
            <View style={styles.navButtons}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push('/profile')}
              >
                <Text style={styles.navButtonText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push('/settings')}
              >
                <Text style={styles.navButtonText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleSignOut}
              >
                <Text style={styles.navButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.userContainer}>
            <Text style = {styles.title}> Let's Build an Outfit!</Text>
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
              <Text style={styles.buttonText}>Open Outfit Builder</Text>
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" transparent = {true}>
              <View style = {styles.modalOverlay}>
                <Animated.View style={[styles.modalContent, {height: animatedHeight}]}>
                    {output === '' ? (
                      <View style = {styles.content}>
                        <Text style={styles.sectionTitle2}>Build an Outfit</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter style name"
                          value={newItemTitle}
                          onChangeText={setNewItemTitle}
                        />

                        <TouchableOpacity
                          style={{
                            backgroundColor: '#261605',
                            borderRadius: 15,
                            width: '85%',
                            padding: 10,
                            marginBottom: 10,
                          }}
                          onPress={handleImageSelection}
                        >
                          <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, color: '#F5E6D3' }}>
                              Upload Your Image Here!
                            </Text>
                            <AntDesign name="upload" size={24} color="#F5E6D3" />
                          </View>
                        </TouchableOpacity>

                        {imageUri && (
                          <Image
                            source={{ uri: imageUri }}
                            style={{
                              width: 200,
                              height: 200,
                              borderRadius: 10,
                              marginBottom: 10,
                            }}
                            resizeMode="cover"
                          />
                        )}
                        <View style={styles.navButtons}>
                          <TouchableOpacity
                            style={styles.navButton2}
                            onPress={() => generateOutfit(newItemTitle)}
                          >
                            <Text style={styles.buttonText}>Build</Text>
                          </TouchableOpacity>

                          {loading && <ActivityIndicator size="large" color="#000" />}

                          <TouchableOpacity
                            style={styles.navButton2}
                            onPress={() => {
                              resetFields();
                              setVisible(false);
                            }}
                          >
                            <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={{ flex: 1 }}>
                        <ScrollView
                          style={{ flex: 1 }}
                          contentContainerStyle={{
                            paddingTop: 32,
                            paddingHorizontal: 15,
                            paddingBottom: 100, 
                          }}
                          showsVerticalScrollIndicator={true}
                        >
                          <Text style={styles.output}>{output}</Text>
                        </ScrollView>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}
                        >
                          <TouchableOpacity
                            style={styles.navButton2}
                            onPress={ () => {handleAddItem(); setVisible(false);}}
                          >
                            <Text style={styles.buttonText}>Save Outfit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.navButton2}
                            onPress={() => {
                              resetFields();
                              setVisible(false);
                            }}
                          >
                            <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                </Animated.View>
              </View>
            </Modal>
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.sectionTitle}>Your Outfits</Text>
            {items.length > 0 ? (
              items.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.itemCard}
                  onPress={() => handleViewItem(item.id)}
                >
                {item.imageUri && (
                  <Image
                    source = {{uri: item.imageUri}}
                    style = {{height: 150, borderRadius: 10  }}
                    resizeMode = "cover"
                  />
                )}
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteItem(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No items found</Text>
            )}
          </View>

          <View style = {styles.userContainer}>
            <Text style = {styles.title}>Recent Fashion Sustainability News</Text>
            <Text style = {styles.header2}>Click on the headlines to view the Articles!</Text>
              {articles.map((article) => (
                <TouchableOpacity
                  key={article.url}
                  style={styles.articleCard}
                  onPress={() => Linking.openURL(article.url)}
                >
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleSource}>{article.source.name}</Text>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.platformInfo}>
            <Text style={styles.platformText}>
              Running on: {Platform.OS}
            </Text>
            {isWeb && (
              <Text style={styles.platformText}>
                Web platform detected
              </Text>
            )}
            {isMobile && (
              <Text style={styles.platformText}>
                Mobile platform detected
              </Text>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261605',
  },
  content: {
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'flex-start',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  modalContent: {
    backgroundColor: '#F5E6D3',
    borderWidth:3,
    borderColor: '#261605',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  outputContainer: {
    maxHeight: 400,
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  outputFullScreen: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    },
  output: {
    fontSize: 16,
    color: '#261605',
    textAlign: 'left',
    padding: 10,
    marginTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#261605',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#261605',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 16,
    color: 'rgb(34, 25, 16)',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  userContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#F5E6D3',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navButton: {
    backgroundColor: '#4A3B2B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  navButton2: {
    backgroundColor: '#4A3B2B',
    paddingVertical: 8,
    paddingHorizontal: 60,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 'auto',
  },
  
  navButtonText: {
    color: '#F5E6D3',
    fontSize: 14,
  },
  addItemContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 5,
    textAlign: 'center',
  },
  articleCard: {
  marginBottom: 15,
  padding: 10,
  backgroundColor: 'rgba(245, 230, 211, 0.9)',
  borderRadius: 10,
},
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a0e02',
  },
  description: {
    fontSize: 17,
    color: '#261605',
    marginBottom: 15,
  },
  articleSource: {
    fontSize: 15,
    fontWeight: 'bold',    
    color: '#4A3B2B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5E6D3',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    width: '85%',
    marginBottom: 15,
    textAlign: 'center',
    borderWidth:2,
    borderColor:'#261605',
    color: '#261605',
    alignContent: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A3B2B',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5E6D3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(245, 230, 211, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#261605',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#261605',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#8B4513',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#F5E6D3',
    fontSize: 12,
  },
  emptyText: {
    color: '#F5E6D3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  platformInfo: {
    backgroundColor: 'rgba(74, 59, 43, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
  },
  platformText: {
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingText: {
    color: '#F5E6D3',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});