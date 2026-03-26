// src/navigation/OnboardingNavigator.jsx
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ROUTES } from '../constants/routes';

import OnboardingCarouselScreen from '../screens/onboarding/OnboardingCarouselScreen';
import QuestionnaireScreen       from '../screens/onboarding/QuestionnaireScreen';
import TrialScreen               from '../screens/onboarding/TrialScreen';
import OnboardingHandoffScreen   from '../screens/onboarding/OnboardingHandoffScreen';

const Stack = createStackNavigator();

const SLIDE = { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureEnabled: false };
const FADE  = { cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,  gestureEnabled: false };

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ONBOARDING_CAROUSEL} component={OnboardingCarouselScreen} options={FADE} />
      <Stack.Screen name={ROUTES.QUESTIONNAIRE}        component={QuestionnaireScreen}       options={SLIDE} />
      <Stack.Screen name={ROUTES.TRIAL}                component={TrialScreen}               options={SLIDE} />
      <Stack.Screen name={ROUTES.ONBOARDING_HANDOFF}   component={OnboardingHandoffScreen}   options={FADE} />
    </Stack.Navigator>
  );
}
