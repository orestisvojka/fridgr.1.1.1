// src/navigation/MainNavigator.jsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import {
  Home,
  ScanLine,
  BookOpen,
  Heart,
  User,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT, SHADOWS } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { useThemeColors } from '../context/ThemeContext';
import { ICON_STROKE } from '../constants/icons';

import DashboardScreen from '../screens/main/DashboardScreen';
import ScanScreen from '../screens/main/ScanScreen';
import RecipesScreen from '../screens/main/RecipesScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ResultsScreen from '../screens/recipe/ResultsScreen';
import DetailScreen from '../screens/recipe/DetailScreen';
import SubscriptionScreen from '../screens/premium/SubscriptionScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PrivacyPolicyScreen from '../screens/info/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/info/TermsOfServiceScreen';
import HelpSupportScreen from '../screens/info/HelpSupportScreen';
import RateAppScreen from '../screens/info/RateAppScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stackScreenOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  gestureEnabled: true,
};

const TAB_ICONS = {
  Home: Home,
  Scan: ScanLine,
  Recipes: BookOpen,
  Favorites: Heart,
  Profile: User,
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
      <Stack.Screen name={ROUTES.RESULTS} component={ResultsScreen} />
      <Stack.Screen name={ROUTES.DETAIL} component={DetailScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={ROUTES.SCAN} component={ScanScreen} />
      <Stack.Screen name={ROUTES.RESULTS} component={ResultsScreen} />
      <Stack.Screen name={ROUTES.DETAIL} component={DetailScreen} />
    </Stack.Navigator>
  );
}

function RecipesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={ROUTES.RECIPES} component={RecipesScreen} />
      <Stack.Screen name={ROUTES.DETAIL} component={DetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      <Stack.Screen name={ROUTES.DETAIL} component={DetailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
      <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
      <Stack.Screen name={ROUTES.TERMS_OF_SERVICE} component={TermsOfServiceScreen} />
      <Stack.Screen name={ROUTES.HELP_SUPPORT} component={HelpSupportScreen} />
      <Stack.Screen name={ROUTES.RATE_APP} component={RateAppScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused, label, colors }) {
  const Icon = TAB_ICONS[name];
  const active = focused ? colors.primary : colors.textTertiary;
  const size = focused ? 22 : 21;
  return (
    <View style={styles.tabIcon}>
      <Icon size={size} color={active} strokeWidth={focused ? ICON_STROKE + 0.25 : ICON_STROKE} />
      <Text style={[styles.tabLabel, { color: colors.textTertiary }, focused && { color: colors.primary, fontWeight: '600' }]}>
        {label}
      </Text>
    </View>
  );
}

export default function MainNavigator() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopColor: colors.borderLight,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: 60 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 0,
      ...SHADOWS.sm,
    }),
    [colors.surface, colors.borderLight, insets.bottom],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Home" focused={focused} label="Home" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStack}
        options={{
          tabBarIcon: () => (
            <Pressable
              style={({ pressed }) => [
                styles.scanButton,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
                SHADOWS.green,
              ]}
            >
              <ScanLine size={26} color={colors.white} strokeWidth={ICON_STROKE + 0.25} />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Recipes" focused={focused} label="Recipes" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Favorites" focused={focused} label="Saved" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Profile" focused={focused} label="Profile" colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    gap: 3,
    minWidth: 48,
  },
  tabLabel: {
    ...FONT.caption,
  },
  scanButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
});
