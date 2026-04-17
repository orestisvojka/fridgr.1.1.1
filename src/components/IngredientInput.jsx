// src/components/IngredientInput.jsx
// Text input + ingredient chip manager + camera scan

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, fontSize, fontFamily, fontWeight, radius, spacing, shadows } from '../styles/theme';
import { normalizeIngredient } from '../utils/helpers';
import { MAX_INGREDIENTS, MIN_INGREDIENT_LENGTH } from '../utils/constants';

const SUGGESTIONS = [
  'eggs', 'tomato', 'pasta', 'chicken', 'rice',
  'cheese', 'garlic', 'spinach', 'onion', 'butter',
  'olive oil', 'lemon', 'pepper', 'mushrooms', 'potato',
  'salmon', 'honey', 'soy sauce', 'curry powder', 'coconut milk',
  'chickpeas', 'quinoa', 'feta', 'basil', 'pine nuts',
  'lentils', 'zucchini', 'flour', 'tortilla', 'yogurt',
  'avocado', 'bell pepper', 'cucumber', 'broccoli', 'carrots',
];

// Simulated ingredient detection groups (random pick on camera scan)
const DETECTED_SETS = [
  ['eggs', 'cheese', 'butter'],
  ['chicken', 'garlic', 'onion'],
  ['tomato', 'pasta', 'olive oil'],
  ['rice', 'spinach', 'lemon'],
  ['potato', 'mushrooms', 'pepper'],
  ['salmon', 'soy sauce', 'honey'],
  ['chickpeas', 'coconut milk', 'curry powder'],
  ['quinoa', 'cucumber', 'feta'],
  ['basil', 'pine nuts', 'parmesan'],
  ['lentils', 'carrot', 'celery'],
  ['zucchini', 'eggs', 'flour'],
  ['tortilla', 'tahini', 'parsley'],
];

export default function IngredientInput({ ingredients, onChange }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  const addIngredient = (raw) => {
    const normalized = normalizeIngredient(raw);
    if (
      normalized.length < MIN_INGREDIENT_LENGTH ||
      ingredients.map((i) => i.toLowerCase()).includes(normalized) ||
      ingredients.length >= MAX_INGREDIENTS
    ) {
      setText('');
      return;
    }
    onChange([...ingredients, normalized]);
    setText('');
  };

  const removeIngredient = (idx) => {
    const next = [...ingredients];
    next.splice(idx, 1);
    onChange(next);
  };

  const handleSubmit = () => {
    if (text.trim()) addIngredient(text.trim());
  };

  const handleSuggestion = (s) => addIngredient(s);

  // Camera / photo scan
  const handleScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'Allow camera access to scan your fridge ingredients.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Simulate AI scanning animation
      setScanning(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();

      setTimeout(() => {
        scanAnim.stopAnimation();
        setScanning(false);
        scanAnim.setValue(0);

        // Pick a random detection set
        const detected = DETECTED_SETS[Math.floor(Math.random() * DETECTED_SETS.length)];
        const toAdd = detected.filter(
          (d) => !ingredients.map((i) => i.toLowerCase()).includes(d)
        );

        if (toAdd.length > 0) {
          const merged = [
            ...ingredients,
            ...toAdd.slice(0, MAX_INGREDIENTS - ingredients.length),
          ];
          onChange(merged);
        } else {
          Alert.alert('No new ingredients found', 'Try another photo or add manually.');
        }
      }, 2200);
    }
  };

  const visibleSuggestions = SUGGESTIONS.filter(
    (s) => !ingredients.includes(s)
  ).slice(0, 6);

  return (
    <View style={styles.container}>
      {/* Input row */}
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <Ionicons
          name="search-outline"
          size={18}
          color={focused ? colors.green : colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type an ingredient…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={handleSubmit} style={styles.addBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        )}
        {/* Camera scan button */}
        <TouchableOpacity
          onPress={handleScan}
          style={[styles.cameraBtn, scanning && styles.cameraBtnScanning]}
          activeOpacity={0.8}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera-outline" size={19} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Scanning status */}
      {scanning && (
        <Animated.View style={[styles.scanBanner, { opacity: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }]}>
          <Ionicons name="scan-outline" size={14} color={colors.green} />
          <Text style={styles.scanText}>Scanning photo for ingredients…</Text>
        </Animated.View>
      )}

      {/* Quick suggestions */}
      {!scanning && visibleSuggestions.length > 0 && (
        <View style={styles.suggestionsWrap}>
          <Text style={styles.suggestLabel}>Quick add</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsRow}
          >
            {visibleSuggestions.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleSuggestion(s)}
                style={styles.suggestionChip}
                activeOpacity={0.75}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Ingredient chips */}
      {ingredients.length > 0 && (
        <View style={styles.chipsWrap}>
          <Text style={styles.chipsLabel}>
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
          </Text>
          <View style={styles.chips}>
            {ingredients.map((ing, idx) => (
              <View key={`${ing}-${idx}`} style={styles.chip}>
                <Text style={styles.chipText}>{ing}</Text>
                <TouchableOpacity
                  onPress={() => removeIngredient(idx)}
                  hitSlop={{ top: 6, bottom: 6, left: 4, right: 6 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={16} color={colors.green + 'cc'} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.sm - 1,
    ...shadows.sm,
    gap: spacing.sm - 2,
  },
  inputRowFocused: {
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    textAlignVertical: 'center',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: '#0F3D22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtnScanning: {
    backgroundColor: colors.green,
  },
  scanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.greenLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.green + '44',
  },
  scanText: {
    fontSize: fontSize.sm,
    fontFamily: 'Poppins_400Regular',
    color: colors.greenDark,
  },
  suggestionsWrap: {
    gap: spacing.xs + 2,
  },
  suggestLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_400Regular',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: spacing.xs,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  suggestionChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: fontSize.sm,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
  },
  chipsWrap: {
    gap: spacing.sm,
  },
  chipsLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_400Regular',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.md - 2,
    paddingRight: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    borderWidth: 1.5,
    borderColor: colors.green + '44',
  },
  chipText: {
    fontSize: fontSize.sm,
    fontFamily: 'Poppins_400Regular',
    color: colors.greenDark,
  },
});
