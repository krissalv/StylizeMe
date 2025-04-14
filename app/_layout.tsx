import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type RouteGroup = '(auth)' | '(tabs)';

function RootLayoutNav() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  const segments = useSegments();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded || loading) return;

    // Get the current route group
    const currentGroup = segments[0] as RouteGroup;

    if (!user && currentGroup !== '(auth)') {
      // Redirect to the welcome page if not signed in
      router.replace('/');
    } else if (user && currentGroup === '(auth)') {
      // Redirect to the home page if signed in
      router.replace('/(tabs)');
    }
  }, [loaded, user, loading, segments]);

  if (!loaded || loading) {
    return null;
  }

  return (
<<<<<<< HEAD
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown:false}}>
=======
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Main App Screens */}
>>>>>>> origin/master
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="item/[id]" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
<<<<<<< HEAD
}
=======
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
>>>>>>> origin/master
