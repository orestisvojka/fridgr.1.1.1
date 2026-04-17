// src/screens/main/MealSuggestionsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecipeCard from '../../components/RecipeCard';
import { colors, shadows, radius, spacing, fontSize, fontFamily, fontWeight } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const SUGGESTIONS = [
  {
    id: '1',
    title: 'High-protein omelette',
    prepTime: 10,
    difficulty: 'Easy',
    macros: { protein: 28 },
    emoji: '🍳',
    palette: { bg: '#FFF7ED', color: '#D97706' }
  },
  {
    id: '2',
    title: 'Chicken & tomato bowl',
    prepTime: 20,
    difficulty: 'Easy',
    macros: { protein: 42 },
    emoji: '🥗',
    palette: { bg: '#FDFCF9', color: '#15803D' }
  },
  {
    id: '3',
    title: 'Protein breakfast wrap',
    prepTime: 15,
    difficulty: 'Moderate',
    macros: { protein: 32 },
    emoji: '🌯',
    palette: { bg: '#EBF7EE', color: '#15803D' }
  },
];

export default function MealSuggestionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Meals you can cook right now</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
           <Ionicons name="home-outline" size={24} color="#1C1917" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={SUGGESTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <RecipeCard 
            recipe={item} 
            onPress={() => navigation.navigate(ROUTES.RECIPE_DETAIL, { recipe: item })}
          />
        )}
      />

      <TouchableOpacity 
        style={styles.floatingBtn}
        onPress={() => navigation.navigate(ROUTES.PROTEIN_RESULT)}
      >
        <Text style={styles.floatingBtnText}>View Daily Protein</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
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
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#1C1917',
    textAlign: 'center',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1C1917',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
    ...shadows.lg,
  },
  floatingBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    fontSize: 16, lineHeight: 24,
  },
});
