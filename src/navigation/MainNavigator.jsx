// src/navigation/MainNavigator.jsx
import { useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { Home, ScanLine, BookOpen, Heart, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT, SHADOWS } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { useThemeColors } from '../context/ThemeContext';
import { ICON_STROKE } from '../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_START,
  PREMIUM_CTA_VERTICAL_END,
} from '../constants/premiumScreenTheme';

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

// Animated wrapper for regular tab buttons — spring bounce on press
function TabButton({ onPress, onLongPress, accessibilityState, children, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.86,
      useNativeDriver: true,
      speed: 80,
      bounciness: 0,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 10,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityState={accessibilityState}
      style={[styles.tabButtonBase, style]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Animated scan button — spring scale + opacity
function ScanButton({ onPress, onLongPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.91,
      useNativeDriver: true,
      speed: 80,
      bounciness: 0,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 12,
    }).start();
  }, [scale]);

  return (
    <View style={styles.scanWrapper}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.scanPressable}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={styles.scanCircle}
          >
            <ScanLine size={26} color="#FFFFFF" strokeWidth={ICON_STROKE + 0.25} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
}

function TabIcon({ focused, Icon, label, colors }) {
  return (
    <View style={styles.tabIconWrap}>
      <Icon
        size={22}
        color={focused ? colors.primary : '#A0A0A0'}
        strokeWidth={focused ? ICON_STROKE + 0.3 : ICON_STROKE}
      />
      <Text style={[styles.tabLabel, { color: focused ? colors.primary : '#A0A0A0' }, focused && styles.tabLabelActive]}>
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
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderTopColor: 'rgba(228,221,210,0.6)',
      borderTopWidth: 1,
      height: 64 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 0,
      elevation: 16,
      shadowColor: '#1A1410',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    }),
    [insets.bottom],
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
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Home} label="Home" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={FavoritesStack}
        options={{
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={Heart} label="Saved" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanStack}
        options={{
          tabBarButton: (props) => (
            <ScanButton onPress={props.onPress} onLongPress={props.onLongPress} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStack}
        options={{
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={BookOpen} label="Recipes" colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={User} label="Profile" colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButtonBase: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    gap: 3,
    minWidth: 52,
  },
  tabLabel: {
    ...FONT.caption,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  // Scan button
  scanWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  scanCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3E6B50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
});
