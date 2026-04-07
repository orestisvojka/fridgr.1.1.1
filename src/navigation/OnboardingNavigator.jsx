// src/navigation/OnboardingNavigator.jsx
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ROUTES } from '../constants/routes';

import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';

const Stack = createStackNavigator();

const FADE = { cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter, gestureEnabled: false };

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.QUESTIONNAIRE} component={QuestionnaireScreen} options={FADE} />
    </Stack.Navigator>
  );
}
