// App.jsx
// Root entry point — splash → onboarding → app

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { RecipesProvider } from './src/context/RecipesContext';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  const [phase, setPhase] = useState('splash'); // 'splash' | 'onboarding' | 'app'

  return (
    <SafeAreaProvider>
      <RecipesProvider>
        <StatusBar style="light" />
        <AppNavigator />
        {phase === 'splash' && (
          <SplashScreen onDone={() => setPhase('onboarding')} />
        )}
        {phase === 'onboarding' && (
          <OnboardingScreen onDone={() => setPhase('app')} />
        )}
      </RecipesProvider>
    </SafeAreaProvider>
  );
}
