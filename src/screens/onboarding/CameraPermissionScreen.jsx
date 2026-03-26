// src/screens/onboarding/CameraPermissionScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import { shadows } from '../../styles/theme';
import { useOnboarding } from '../../context/OnboardingContext';

export default function CameraPermissionScreen({ navigation }) {
  const { completeOnboarding } = useOnboarding();

  const handleAllow = () => {
    // In a real app, request system permission here
    completeOnboarding(); 
    // Navigation will be handled by RootNavigator based on state
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.cameraCircle}>
            <Ionicons name="camera" size={50} color="#15803D" />
          </View>
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Let Fridgr see what’s in your fridge</Text>
        <Text style={styles.description}>
          We only use the camera to detect ingredients and suggest meals.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Allow Camera" 
          full 
          size="lg"
          onPress={handleAllow} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  cameraCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#15803D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FDFCF9',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});
