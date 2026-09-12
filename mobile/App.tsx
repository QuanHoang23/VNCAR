import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { useAuthStore } from './src/store/useAuthStore';

import SplashScreen from './src/screens/shared/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OTPVerificationScreen from './src/screens/auth/OTPVerificationScreen';
import LocationPermissionScreen from './src/screens/customer/LocationPermissionScreen';
import PassengerHomeScreen from './src/screens/customer/PassengerHomeScreen';
import MyTripsScreen from './src/screens/customer/MyTripsScreen';
import CustomerAccountScreen from './src/screens/customer/CustomerAccountScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Sync user with backend if logged in
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Android Emulator uses 10.0.2.2 to access host localhost
          const apiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
          
          await fetch(`${apiUrl}/api/auth/sync`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('User synced with backend successfully.');
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
        }
      }

      if (isLoading) setLoading(false);
    });
    return subscriber; // unsubscribe on unmount
  }, [isLoading, setUser, setLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            // Unauthenticated Stack
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            </>
          ) : (
            // Authenticated Stack
            <>
              <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
              <Stack.Screen name="PassengerHome" component={PassengerHomeScreen} />
              <Stack.Screen name="MyTrips" component={MyTripsScreen} />
              <Stack.Screen name="CustomerAccount" component={CustomerAccountScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
