// src/screens/main/ScanScreen.jsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { COLORS, FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

const { width } = Dimensions.get('window');

const SUGGESTIONS = [
  'eggs', 'tomatoes', 'garlic', 'onion', 'pasta', 'chicken',
  'spinach', 'cheese', 'butter', 'olive oil', 'lemon', 'rice',
];

const SIMULATED_SCAN_WORDS = [
  ['tomatoes', 'eggs', 'onion', 'garlic'],
  ['pasta', 'butter', 'parmesan', 'garlic'],
  ['chicken', 'broccoli', 'soy sauce', 'ginger'],
  ['rice', 'eggs', 'spring onion', 'sesame oil'],
  ['avocado', 'lemon', 'sourdough bread'],
];

export default function ScanScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addRecentScan } = useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [inputText,   setInputText]   = useState('');
  const [scanning,    setScanning]    = useState(false);
  const [searching,   setSearching]   = useState(false);

  const inputRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const addIngredient = (text) => {
    const trimmed = text.trim().toLowerCase();
    if (trimmed.length < 2 || ingredients.includes(trimmed) || ingredients.length >= 20) return;
    setIngredients(prev => [...prev, trimmed]);
    setInputText('');
  };

  const removeIngredient = (item) => {
    setIngredients(prev => prev.filter(i => i !== item));
  };

  const handleScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera Access', 'Please allow camera access to scan ingredients.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) simulateScan();
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Gallery Access', 'Please allow gallery access to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) simulateScan();
  };

  const simulateScan = () => {
    setScanning(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ]), { iterations: 3 }
    ).start();

    setTimeout(() => {
      const set = SIMULATED_SCAN_WORDS[Math.floor(Math.random() * SIMULATED_SCAN_WORDS.length)];
      const newIngredients = set.filter(i => !ingredients.includes(i));
      setIngredients(prev => [...prev, ...newIngredients].slice(0, 20));
      setScanning(false);
    }, 2000);
  };

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) return;
    setSearching(true);
    await new Promise(r => setTimeout(r, 800));
    const results = findMatchingRecipes(ingredients);
    addRecentScan(ingredients, results.length);
    setSearching(false);
    navigation.navigate(ROUTES.RESULTS, { ingredients, results });
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#0A1F0E', '#15803D']}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <Text style={styles.headerTitle}>Scan Ingredients</Text>
        <Text style={styles.headerSub}>Take a photo or type what you have</Text>

        {/* Scan buttons */}
        <View style={styles.scanBtns}>
          <TouchableOpacity style={styles.scanBtn} onPress={handleScan} activeOpacity={0.85} disabled={scanning}>
            <Animated.View style={[styles.scanBtnInner, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.scanIcon}>
                <Ionicons name="camera" size={26} color={COLORS.primary} />
              </View>
              <Text style={styles.scanBtnLabel}>Camera</Text>
              <Text style={styles.scanBtnSub}>Take a photo</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.scanBtn} onPress={handleGallery} activeOpacity={0.85} disabled={scanning}>
            <View style={styles.scanBtnInner}>
              <View style={[styles.scanIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="image" size={26} color="#7C3AED" />
              </View>
              <Text style={styles.scanBtnLabel}>Gallery</Text>
              <Text style={styles.scanBtnSub}>Upload photo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Scanning indicator */}
        {scanning && (
          <View style={styles.scanningBanner}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.scanningText}>AI is detecting your ingredients…</Text>
          </View>
        )}

        {/* Input field */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Or type ingredients manually</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrap}>
              <Ionicons name="search-outline" size={18} color={COLORS.textTertiary} style={styles.inputIcon} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Add ingredient…"
                placeholderTextColor={COLORS.textTertiary}
                onSubmitEditing={() => addIngredient(inputText)}
                returnKeyType="done"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.addBtn, !inputText.trim() && styles.addBtnDisabled]}
              onPress={() => addIngredient(inputText)}
              disabled={!inputText.trim()}
            >
              <Ionicons name="add" size={22} color={inputText.trim() ? COLORS.white : COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick suggestions */}
        {ingredients.length < 5 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Quick add</Text>
            <View style={styles.suggestionChips}>
              {SUGGESTIONS.filter(s => !ingredients.includes(s)).slice(0, 8).map(s => (
                <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => addIngredient(s)}>
                  <Text style={styles.suggestionChipText}>+ {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Ingredient chips */}
        {ingredients.length > 0 && (
          <View style={styles.ingredientsSection}>
            <View style={styles.ingredientsHeader}>
              <Text style={styles.ingredientsTitle}>
                {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
              </Text>
              <TouchableOpacity onPress={() => setIngredients([])}>
                <Text style={styles.clearAll}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chips}>
              {ingredients.map(item => (
                <View key={item} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeIngredient(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {ingredients.length === 0 && !scanning && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Add your ingredients</Text>
            <Text style={styles.emptySub}>
              Scan a photo or type what's in your fridge to get personalized recipes
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Find Recipes CTA */}
      {ingredients.length > 0 && (
        <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + SPACING.md }]}>
          <TouchableOpacity
            style={[styles.ctaBtn, searching && { opacity: 0.8 }]}
            onPress={handleFindRecipes}
            disabled={searching}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#16A34A', '#15803D']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.ctaBtnGradient}
            >
              {searching
                ? <ActivityIndicator color={COLORS.white} />
                : (
                  <View style={styles.ctaBtnContent}>
                    <Ionicons name="sparkles" size={20} color={COLORS.white} />
                    <Text style={styles.ctaBtnText}>Find Recipes ({ingredients.length})</Text>
                  </View>
                )
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  headerTitle: { ...FONT.h2, color: '#FFFFFF', marginBottom: SPACING.xs },
  headerSub: { ...FONT.body, color: 'rgba(255,255,255,0.6)', marginBottom: SPACING.xl },
  scanBtns: { flexDirection: 'row', gap: SPACING.md },
  scanBtn: { flex: 1 },
  scanBtnInner: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  scanIcon: {
    width: 56, height: 56, borderRadius: RADIUS.lg,
    backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
  },
  scanBtnLabel: { ...FONT.bodySemiBold, color: '#FFFFFF' },
  scanBtnSub: { ...FONT.caption, color: 'rgba(255,255,255,0.5)' },

  scroll: { padding: SPACING.xl, paddingBottom: 100 },

  scanningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.primaryFaint,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.primaryPale,
  },
  scanningText: { ...FONT.bodyMedium, color: COLORS.primary },

  inputSection: { gap: SPACING.sm, marginBottom: SPACING.lg },
  inputLabel: { ...FONT.label, color: COLORS.text },
  inputRow: { flexDirection: 'row', gap: SPACING.sm },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, height: 50,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, ...FONT.body, color: COLORS.text },
  addBtn: {
    width: 50, height: 50, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: COLORS.surface2 },

  suggestions: { marginBottom: SPACING.lg },
  suggestionsLabel: { ...FONT.label, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  suggestionChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  suggestionChip: {
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderWidth: 1, borderColor: COLORS.border,
  },
  suggestionChipText: { ...FONT.bodySmallMedium, color: COLORS.textSecondary },

  ingredientsSection: { gap: SPACING.md },
  ingredientsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ingredientsTitle: { ...FONT.bodySemiBold, color: COLORS.text },
  clearAll: { ...FONT.bodySmallMedium, color: COLORS.error },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: COLORS.primaryFaint, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.primaryPale,
  },
  chipText: { ...FONT.bodySmallMedium, color: COLORS.primary },

  emptyState: { alignItems: 'center', paddingTop: SPACING.section, gap: SPACING.md },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { ...FONT.h4, color: COLORS.text },
  emptySub: { ...FONT.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  ctaBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.green },
  ctaBtnGradient: { height: 54, alignItems: 'center', justifyContent: 'center' },
  ctaBtnContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  ctaBtnText: { ...FONT.h5, color: COLORS.white },
});
