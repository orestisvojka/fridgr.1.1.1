// src/navigation/AuthNavigator.jsx
import React from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { ROUTES } from '../constants/routes';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name={ROUTES.WELCOME}   component={WelcomeScreen} />
      <Stack.Screen name={ROUTES.LOGIN}     component={LoginScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP}   component={SignUpScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PW} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
