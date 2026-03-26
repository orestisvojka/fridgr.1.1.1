// src/screens/main/IngredientsResultScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const FOUND_ITEMS = [
  { id: '1', name: 'Eggs', color: '#FFF7ED', icon: 'egg' },
  { id: '2', name: 'Chicken', color: '#FDFCF9', icon: 'refrigerator' },
  { id: '3', name: 'Cheese', color: '#FFF7ED', icon: 'pizza' },
  { id: '4', name: 'Tomatoes', color: '#FEF2F2', icon: 'nutrition' },
  { id: '5', name: 'Milk', color: '#F5F4F0', icon: 'beaker' },
];

export default function IngredientsResultScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Ionicons name="close" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Here’s what we found</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {FOUND_ITEMS.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={24} color="#15803D" />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Show what I can cook" 
          full 
          size="lg"
          onPress={() => navigation.navigate(ROUTES.MEAL_SUGGESTIONS)} 
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
  scrollContent: {
    padding: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    ...shadows.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});
