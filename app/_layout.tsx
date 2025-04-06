import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!loaded) return;
      
      // Simple check for auth screens
      const isAuthScreen = !router.canGoBack();
      
      if (!user && !isAuthScreen) {
        // Redirect to the welcome page if not signed in
        router.replace('/welcome');
      } else if (user && isAuthScreen) {
        // Redirect to the home page if signed in
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        
        {/* Main App Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="item/[id]" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
