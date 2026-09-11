import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/shared/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import OTPVerificationScreen from './src/screens/auth/OTPVerificationScreen';
import LocationPermissionScreen from './src/screens/customer/LocationPermissionScreen';
import PassengerHomeScreen from './src/screens/customer/PassengerHomeScreen';
import MyTripsScreen from './src/screens/customer/MyTripsScreen';
import CustomerAccountScreen from './src/screens/customer/CustomerAccountScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
          <Stack.Screen name="PassengerHome" component={PassengerHomeScreen} />
          <Stack.Screen name="MyTrips" component={MyTripsScreen} />
          <Stack.Screen name="CustomerAccount" component={CustomerAccountScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
