// App.jsx — FRIDGR Premium
// Root entry point: providers + navigation

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider }       from './src/context/AuthContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { RecipesProvider }    from './src/context/RecipesContext';
import { ThemeProvider }      from './src/context/ThemeContext';

import RootNavigator from './src/navigation/RootNavigator';
import { AppStatusBar } from './src/components/AppStatusBar';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OnboardingProvider>
              <RecipesProvider>
                <AppStatusBar />
                <RootNavigator />
              </RecipesProvider>
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
