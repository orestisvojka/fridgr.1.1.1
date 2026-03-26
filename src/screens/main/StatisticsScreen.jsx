// src/screens/main/StatisticsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';

export default function StatisticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your food habits</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Most Used Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most used ingredients</Text>
          <View style={styles.habitCard}>
             <View style={styles.habitRow}>
                <Text style={styles.habitName}>Eggs</Text>
                <View style={[styles.habitBar, { width: '80%' }]} />
                <Text style={styles.habitCount}>24x</Text>
             </View>
             <View style={styles.habitRow}>
                <Text style={styles.habitName}>Chicken</Text>
                <View style={[styles.habitBar, { width: '65%' }]} />
                <Text style={styles.habitCount}>18x</Text>
             </View>
             <View style={styles.habitRow}>
                <Text style={styles.habitName}>Spinach</Text>
                <View style={[styles.habitBar, { width: '40%' }]} />
                <Text style={styles.habitCount}>12x</Text>
             </View>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.statsGrid}>
          <View style={styles.miniCard}>
            <Ionicons name="restaurant" size={24} color="#15803D" />
            <Text style={styles.miniValue}>42</Text>
            <Text style={styles.miniLabel}>Meals cooked</Text>
          </View>
          <View style={styles.miniCard}>
            <Ionicons name="leaf" size={24} color="#15803D" />
            <Text style={styles.miniValue}>1.2kg</Text>
            <Text style={styles.miniLabel}>Waste saved</Text>
          </View>
        </View>

        {/* Weekly Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily activity</Text>
          <View style={styles.activityGrid}>
            {Array.from({ length: 28 }).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.activityDot, 
                  { backgroundColor: Math.random() > 0.5 ? '#15803D' : '#F5F4F0' }
                ]} 
              />
            ))}
          </View>
          <Text style={styles.gridLegend}>Consistent cooking leads to better health.</Text>
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 16,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...shadows.sm,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  habitName: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
    color: '#44403C',
  },
  habitBar: {
    height: 8,
    backgroundColor: '#EBF7EE',
    borderRadius: 4,
    flex: 1,
  },
  habitCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    ...shadows.sm,
  },
  miniValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 8,
    marginBottom: 2,
  },
  miniLabel: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '600',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    justifyContent: 'center',
    ...shadows.sm,
  },
  activityDot: {
    width: 25,
    height: 25,
    borderRadius: 4,
  },
  gridLegend: {
    fontSize: 12,
    color: '#A8A29E',
    marginTop: 12,
    textAlign: 'center',
  },
});
