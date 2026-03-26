// src/screens/main/HistoryScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const HISTORY_DATA = [
  { id: '1', date: 'Yesterday', items: 'Eggs, Spinach, Chicken', icon: 'camera' },
  { id: '2', date: '2 days ago', items: 'Tomato, Cheese, Pasta', icon: 'camera' },
  { id: '3', date: 'Last week', items: 'Salmon, Asparagus', icon: 'camera' },
];

export default function HistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your previous fridge scans</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {HISTORY_DATA.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={20} color="#15803D" />
              </View>
              <View style={styles.details}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.items} numberOfLines={1}>{item.items}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A8A29E" />
            </TouchableOpacity>
          ))}
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
  },
  list: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    ...shadows.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EBF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  items: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 2,
  },
});
