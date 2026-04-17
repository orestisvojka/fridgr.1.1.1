// src/navigation/AppNavigator.jsx
// Bottom tab navigator + stack navigators for each tab

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import DetailScreen from '../screens/DetailScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';

import { colors, fontSize, fontFamily, fontWeight, radius, spacing } from '../styles/theme';

const Tab = createBottomTabNavigator();
const CookStack = createStackNavigator();
const SavedStack = createStackNavigator();

// ─── Cook tab stack ───────────────────────────────────────────────────────────
function CookStackNavigator() {
  return (
    <CookStack.Navigator screenOptions={{ headerShown: false }}>
      <CookStack.Screen name="Home" component={HomeScreen} />
      <CookStack.Screen name="Results" component={ResultsScreen} />
      <CookStack.Screen name="Detail" component={DetailScreen} />
    </CookStack.Navigator>
  );
}

// ─── Saved tab stack ──────────────────────────────────────────────────────────
function SavedStackNavigator() {
  return (
    <SavedStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedStack.Screen name="SavedList" component={SavedRecipesScreen} />
      <SavedStack.Screen name="Detail" component={DetailScreen} />
    </SavedStack.Navigator>
  );
}

// ─── Custom tab bar label ─────────────────────────────────────────────────────
function TabLabel({ label, focused }) {
  return (
    <Text
      style={[
        styles.tabLabel,
        focused ? styles.tabLabelActive : styles.tabLabelInactive,
      ]}
    >
      {label}
    </Text>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.green,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Cook: focused ? 'restaurant' : 'restaurant-outline',
              Saved: focused ? 'heart' : 'heart-outline',
            };
            return (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <Ionicons name={icons[route.name]} size={21} color={color} />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => (
            <TabLabel label={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="Cook" component={CookStackNavigator} />
        <Tab.Screen name="Saved" component={SavedStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
    paddingHorizontal: spacing.xxxl,
  },
  tabIconWrap: {
    width: 44,
    height: 30,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: colors.greenLight,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontFamily: 'Poppins_400Regular',
    color: colors.green,
  },
  tabLabelInactive: {
    fontFamily: 'Poppins_400Regular',
    color: colors.textMuted,
  },
});
