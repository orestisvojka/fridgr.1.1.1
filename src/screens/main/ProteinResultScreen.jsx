// src/screens/main/ProteinResultScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

export default function ProteinResultScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Ionicons name="close" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Your protein today</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.centerBox}>
          <Text style={styles.bigNumber}>67g</Text>
          <Text style={styles.unit}>Protein available</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '67%' }]} />
          </View>
          <Text style={styles.progressText}>67% of your daily goal</Text>
        </View>

        <View style={styles.insightBox}>
          <Ionicons name="bulb" size={24} color="#15803D" style={{ marginBottom: 12 }} />
          <Text style={styles.insightText}>
            You already have enough ingredients for a high-protein meal
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Go to My Tracking" 
          full 
          size="lg"
          onPress={() => navigation.navigate(ROUTES.PROTEIN_TRACKING)} 
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBox: {
    alignItems: 'center',
    marginBottom: 60,
  },
  bigNumber: {
    fontSize: 100,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: -4,
  },
  unit: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1917',
    marginTop: -10,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#F0EDE8',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#15803D',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  insightBox: {
    backgroundColor: '#EBF7EE',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  insightText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803D',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});
