// App.jsx — FRIDGR Premium
// Root entry point: providers + navigation

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native';

// Force Poppins_400Regular on every single Text component in the app globally
const oldTextRender = Text.render;
Text.render = function(...args) {
  const origin = oldTextRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: 'Poppins_400Regular' }, origin.props.style]
  });
};

const oldTextInputRender = TextInput.render;
if (oldTextInputRender) {
  TextInput.render = function(...args) {
    const origin = oldTextInputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Poppins_400Regular' }, origin.props.style]
    });
  };
}

import { AuthProvider }       from './src/context/AuthContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { RecipesProvider }    from './src/context/RecipesContext';
import { ThemeProvider }      from './src/context/ThemeContext';

import { 
  useFonts,
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';

import RootNavigator from './src/navigation/RootNavigator';
import { AppStatusBar } from './src/components/AppStatusBar';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

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
