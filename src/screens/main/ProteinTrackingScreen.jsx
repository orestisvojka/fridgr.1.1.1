// src/screens/main/ProteinTrackingScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function ProteinTrackingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your weekly protein intake</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Chart Mockup */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
             <Text style={styles.avgLabel}>WEEKLY AVG</Text>
             <Text style={styles.avgValue}>72g <Text style={styles.perDay}>/ day</Text></Text>
          </View>
          
          <View style={styles.bars}>
            {[45, 67, 89, 54, 72, 95, 60].map((h, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { height: `${h}%`, backgroundColor: h > 70 ? '#15803D' : '#78716C' }]} />
                </View>
                <Text style={styles.dayLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Highest Day</Text>
            <Text style={styles.statValue}>95g</Text>
            <Text style={styles.statSub}>Saturday</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Goal Met</Text>
            <Text style={styles.statValue}>5/7</Text>
            <Text style={styles.statSub}>This week</Text>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Ionicons name="flame" size={24} color="#D97706" style={{ marginBottom: 12 }} />
          <Text style={styles.tipTitle}>Keep it up!</Text>
          <Text style={styles.tipText}>You're 20% higher than last week. Great progress on muscle maintenance.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1917',
    lineHeight: 30,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 24,
    ...shadows.md,
  },
  chartHeader: {
    marginBottom: 32,
  },
  avgLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 1,
    marginBottom: 4,
  },
  avgValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1C1917',
  },
  perDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78716C',
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barColumn: {
    alignItems: 'center',
    width: (width - 96 - 48) / 7,
  },
  barBg: {
    width: 6,
    height: '100%',
    backgroundColor: '#F5F4F0',
    borderRadius: 3,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A8A29E',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...shadows.sm,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78716C',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 12,
    color: '#A8A29E',
  },
  tipBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
});
