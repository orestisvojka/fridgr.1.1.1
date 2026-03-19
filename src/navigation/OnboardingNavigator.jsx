// src/navigation/OnboardingNavigator.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../constants/routes';

import OnboardingCarouselScreen from '../screens/onboarding/OnboardingCarouselScreen';
import QuestionnaireScreen from '../screens/onboarding/QuestionnaireScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name={ROUTES.ONBOARDING_CAROUSEL} component={OnboardingCarouselScreen} />
      <Stack.Screen name={ROUTES.QUESTIONNAIRE}       component={QuestionnaireScreen} />
    </Stack.Navigator>
  );
}
