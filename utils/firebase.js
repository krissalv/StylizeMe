import { auth, db, storage } from '../config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { isWeb } from './platform';

/**
 * Authentication utilities
 */

// Sign up with email and password
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update profile with display name
    await updateProfile(user, { 
      displayName: `${userData.firstName} ${userData.lastName}` 
    });
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * User Profile utilities
 */

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Items utilities
 */

// Image upload utilities
export const uploadImage = async (userId, imageUri, folder = 'coats') => {
  try {
    // Create a reference to the file location
    const imageRef = ref(storage, `${folder}/${userId}/${Date.now()}`);
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the image
    await uploadBytes(imageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);
    
    return {
      url: downloadURL,
      path: imageRef.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Add a new item
export const addItem = async (userId, itemData) => {
  try {
    const itemsRef = collection(db, 'items');
    const newItem = {
      ...itemData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // If there's an image to upload
    if (itemData.imageUri) {
      const { url, path } = await uploadImage(userId, itemData.imageUri);
      newItem.imageUrl = url;
      newItem.imagePath = path;
      delete newItem.imageUri; // Remove the temporary URI
    }

    const docRef = await addDoc(itemsRef, newItem);
    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Get user's items
export const getUserItems = async (userId) => {
  try {
    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user items:', error);
    throw error;
  }
};

// Update an item
export const updateItem = async (itemId, itemData) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const currentItem = await getDoc(itemRef);
    const currentData = currentItem.data();

    const updateData = {
      ...itemData,
      updatedAt: serverTimestamp()
    };

    // If there's a new image to upload
    if (itemData.imageUri) {
      // Delete old image if it exists
      if (currentData.imagePath) {
        await deleteImage(currentData.imagePath);
      }
      
      // Upload new image
      const { url, path } = await uploadImage(itemData.userId, itemData.imageUri);
      updateData.imageUrl = url;
      updateData.imagePath = path;
      delete updateData.imageUri; // Remove the temporary URI
    }

    await updateDoc(itemRef, updateData);
    const updatedDoc = await getDoc(itemRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (itemId) => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const itemDoc = await getDoc(itemRef);
    const itemData = itemDoc.data();

    // Delete the image if it exists
    if (itemData.imagePath) {
      await deleteImage(itemData.imagePath);
    }

    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Get a single item
export const getItem = async (itemId) => {
  try {
    const itemDoc = await getDoc(doc(db, 'items', itemId));
    if (itemDoc.exists()) {
      return { id: itemDoc.id, ...itemDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

/**
 * Firestore utilities
 */

// Add a document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Get documents from a collection
export const getDocuments = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply filters if provided
    if (options.filters) {
      options.filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    // Apply ordering if provided
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }
    
    // Apply limit if provided
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Storage utilities (if needed)
 */

// Platform-specific storage operations can be added here 