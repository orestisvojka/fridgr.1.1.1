// src/screens/main/ScanningAnimationScreen.jsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ROUTES } from '../../constants/routes';

export default function ScanningAnimationScreen({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      navigation.navigate(ROUTES.INGREDIENTS_RESULT);
    }, 3500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.center}>
        <View style={styles.iconBox}>
          <Ionicons name="scan" size={60} color="#15803D" />
        </View>
        <Text style={styles.title}>Analyzing your ingredients…</Text>
        
        <View style={styles.barContainer}>
          <Animated.View 
            style={[
              styles.barFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </View>

        <View style={styles.tasks}>
          <Text style={styles.task}>Detecting protein sources...</Text>
          <Text style={styles.task}>Detecting vegetables...</Text>
          <Text style={styles.task}>Finding meal ideas...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  center: {
    alignItems: 'center',
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#EBF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#1C1917',
    marginBottom: 40,
  },
  barContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0EDE8',
    borderRadius: 4,
    marginBottom: 40,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#15803D',
  },
  tasks: {
    gap: 12,
    alignItems: 'center',
  },
  task: {
    fontSize: 14, lineHeight: 21,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#78716C',
  },
});
