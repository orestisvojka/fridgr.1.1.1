// src/screens/onboarding/HabitScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../styles/theme';

export default function HabitScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>We’ll remind you before food expires.</Text>
        
        <View style={styles.illustration}>
          <View style={styles.bellCircle}>
            <Ionicons name="notifications" size={60} color="#15803D" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Fridgr will notify you when:</Text>
          <View style={styles.list}>
            <Text style={styles.item}>– food is about to expire</Text>
            <Text style={styles.item}>– you have enough ingredients for a meal</Text>
            <Text style={styles.item}>– you haven’t used your fridge scan recently</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Continue for Free" 
          full 
          size="lg"
          onPress={() => navigation.navigate('FreeTrial')} 
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
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 40,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 60,
  },
  bellCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  infoBox: {
    backgroundColor: '#F5F4F0',
    borderRadius: 24,
    padding: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  item: {
    fontSize: 16,
    fontWeight: '600',
    color: '#44403C',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});
