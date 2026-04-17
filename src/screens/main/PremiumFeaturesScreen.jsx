// src/screens/main/PremiumFeaturesScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, shadows, radius, spacing, fontSize, fontFamily, fontWeight } from '../../styles/theme';

const FEATURES = [
  { id: '1', title: 'Unlimited scans', desc: 'Scan as many times as you like, no limits.', icon: 'camera' },
  { id: '2', title: 'Advanced protein tracking', desc: 'Detailed charts and muscle-building insights.', icon: 'bar-chart' },
  { id: '3', title: 'Personalized meal suggestions', desc: 'AI-driven recipes based on your tastes.', icon: 'restaurant' },
  { id: '4', title: 'Smart expiration detection', desc: 'Real-time alerts for your cooling stock.', icon: 'alert-circle' },
];

export default function PremiumFeaturesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Why go Premium?</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.featureList}>
          {FEATURES.map((item) => (
            <View key={item.id} style={styles.featureItem}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={24} color="#15803D" />
              </View>
              <View style={styles.details}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.planCard}>
           <Text style={styles.planLabel}>FRIDGR PRO</Text>
           <Text style={styles.planPrice}>$49.99 <Text style={styles.planPeriod}>/ year</Text></Text>
           <Text style={styles.planSavings}>Save 60% compared to monthly</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Upgrade Now" 
          full 
          size="lg"
          onPress={() => {}} 
        />
        <TouchableOpacity style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>
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
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#1C1917',
  },
  scrollContent: {
    padding: 24,
  },
  featureList: {
    gap: 24,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EBF7EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#1C1917',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#78716C',
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: '#1C1917',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#15803D',
    letterSpacing: 1,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  planSavings: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  restoreBtn: {
    marginTop: 16,
  },
  restoreText: {
    fontSize: 13,
    color: '#A8A29E',
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
});
