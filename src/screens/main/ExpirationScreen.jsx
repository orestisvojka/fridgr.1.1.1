// src/screens/main/ExpirationScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';

const EXPIRING_ITEMS = [
  { id: '1', name: 'Milk', left: '1 day left', color: '#FEF2F2', icon: 'beaker' },
  { id: '2', name: 'Cheese', left: '2 days left', color: '#FFF7ED', icon: 'pizza' },
  { id: '3', name: 'Spinach', left: '3 days left', color: '#EBF7EE', icon: 'leaf' },
];

export default function ExpirationScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Use this before it expires</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
           <Ionicons name="alert-circle" size={20} color="#B45309" />
           <Text style={styles.infoText}>You have 3 items expiring soon. Let's find a recipe for them.</Text>
        </View>

        <View style={styles.list}>
          {EXPIRING_ITEMS.map((item) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: item.color }]}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={24} color="#15803D" />
              </View>
              <View style={styles.details}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.leftText}>{item.left}</Text>
              </View>
              <TouchableOpacity style={styles.recipeBtn}>
                <Text style={styles.recipeBtnText}>Find Recipe</Text>
              </TouchableOpacity>
            </View>
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 20,
  },
  list: {
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    ...shadows.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
  },
  leftText: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 2,
  },
  recipeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0EDE8',
  },
  recipeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
