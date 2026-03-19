// src/navigation/MainNavigator.jsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONT, SHADOWS } from '../constants/theme';
import { ROUTES } from '../constants/routes';

import DashboardScreen    from '../screens/main/DashboardScreen';
import ScanScreen         from '../screens/main/ScanScreen';
import RecipesScreen      from '../screens/main/RecipesScreen';
import FavoritesScreen    from '../screens/main/FavoritesScreen';
import ProfileScreen      from '../screens/main/ProfileScreen';
import ResultsScreen      from '../screens/recipe/ResultsScreen';
import DetailScreen       from '../screens/recipe/DetailScreen';
import SubscriptionScreen from '../screens/premium/SubscriptionScreen';
import SettingsScreen     from '../screens/settings/SettingsScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Stack Wrappers ────────────────────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.DASHBOARD}    component={DashboardScreen} />
      <Stack.Screen name={ROUTES.RESULTS}      component={ResultsScreen} />
      <Stack.Screen name={ROUTES.DETAIL}       component={DetailScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}

function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SCAN}    component={ScanScreen} />
      <Stack.Screen name={ROUTES.RESULTS} component={ResultsScreen} />
      <Stack.Screen name={ROUTES.DETAIL}  component={DetailScreen} />
    </Stack.Navigator>
  );
}

function RecipesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.RECIPES} component={RecipesScreen} />
      <Stack.Screen name={ROUTES.DETAIL}  component={DetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      <Stack.Screen name={ROUTES.DETAIL}    component={DetailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.PROFILE}      component={ProfileScreen} />
      <Stack.Screen name={ROUTES.SETTINGS}     component={SettingsScreen} />
      <Stack.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}

// ─── Custom Tab Bar ────────────────────────────────────────────────────────────
function TabIcon({ name, focused, label }) {
  const icons = {
    Home:      focused ? 'home' : 'home-outline',
    Scan:      focused ? 'scan' : 'scan-outline',
    Recipes:   focused ? 'book' : 'book-outline',
    Favorites: focused ? 'heart' : 'heart-outline',
    Profile:   focused ? 'person' : 'person-outline',
  };
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Ionicons
        name={icons[name]}
        size={focused ? 22 : 21}
        color={focused ? COLORS.primary : COLORS.textTertiary}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main Tab Navigator ────────────────────────────────────────────────────────
export default function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          ...SHADOWS.sm,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} label="Home" /> }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.scanButton}>
              <Ionicons name="scan" size={26} color={COLORS.white} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Recipes" focused={focused} label="Recipes" /> }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Favorites" focused={focused} label="Saved" /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} label="Profile" /> }}
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
  tabIconActive: {},
  tabLabel: {
    ...FONT.caption,
    color: COLORS.textTertiary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  scanButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...SHADOWS.green,
  },
});
