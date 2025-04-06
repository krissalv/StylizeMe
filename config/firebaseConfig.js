// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Helper function to get environment variables across platforms
const getEnvVar = (key) => {
  // For Expo/React Native
  if (process.env[`EXPO_PUBLIC_${key}`]) {
    return process.env[`EXPO_PUBLIC_${key}`];
  }
  // For React web
  if (process.env[`REACT_APP_${key}`]) {
    return process.env[`REACT_APP_${key}`];
  }
  // For direct access (development)
  if (process.env[key]) {
    return process.env[key];
  }
  return null;
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
  databaseURL: getEnvVar('FIREBASE_DATABASE_URL'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID'),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID'),
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics only on web platforms
let analytics = null;
if (typeof window !== 'undefined') {
  // Only import analytics on web platforms
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(error => {
    console.warn('Analytics initialization failed:', error);
  });
}

export { analytics };