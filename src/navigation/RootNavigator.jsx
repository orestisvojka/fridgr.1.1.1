// src/navigation/RootNavigator.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
import { buildNavigationTheme } from './navigationTheme';

import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';

const Root = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();
  const { hasCompletedOnboarding } = useOnboarding();
  const { colors, isDark } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const navTheme = buildNavigationTheme(colors, isDark);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSplashDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowSplash(false));
  };

  if (showSplash) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreen onDone={handleSplashDone} />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Root.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        {!hasCompletedOnboarding ? (
          <Root.Screen name={ROUTES.ONBOARDING} component={OnboardingNavigator} />
        ) : !isAuthenticated ? (
          <Root.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        ) : (
          <Root.Screen name={ROUTES.MAIN} component={MainNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
