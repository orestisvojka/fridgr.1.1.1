// src/screens/main/ScanScreen.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator, Keyboard, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image as ImageIcon, Search, X, ArrowRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

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

// ─── Spring press helper ───────────────────────────────────────────────────────
function useSpringPress(target = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = useCallback(() =>
    Animated.spring(scale, { toValue: target, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), [scale, target]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 14 }).start(), [scale]);
  return { scale, pressIn, pressOut };
}

export default function ScanScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { addRecentScan } = useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [inputText, setInputText]     = useState('');
  const [scanning, setScanning]       = useState(false);
  const [searching, setSearching]     = useState(false);

  const inputRef  = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { scale: scanScale, pressIn: scanIn, pressOut: scanOut } = useSpringPress(0.97);
  const { scale: galScale,  pressIn: galIn,  pressOut: galOut  } = useSpringPress(0.96);
  const { scale: ctaScale,  pressIn: ctaIn,  pressOut: ctaOut  } = useSpringPress(0.97);

  const addIngredient = (text) => {
    const t = text.trim().toLowerCase();
    if (t.length < 2 || ingredients.includes(t) || ingredients.length >= 20) return;
    setIngredients(prev => [...prev, t]);
    setInputText('');
  };

  const removeIngredient = (item) =>
    setIngredients(prev => prev.filter(i => i !== item));

  const simulateScan = () => {
    setScanning(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ]),
      { iterations: 3 },
    ).start();
    setTimeout(() => {
      const set = SIMULATED_SCAN_WORDS[Math.floor(Math.random() * SIMULATED_SCAN_WORDS.length)];
      const newOnes = set.filter(i => !ingredients.includes(i));
      setIngredients(prev => [...prev, ...newOnes].slice(0, 20));
      setScanning(false);
    }, 2000);
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

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) return;
    setSearching(true);
    await new Promise(r => setTimeout(r, 800));
    const results = findMatchingRecipes(ingredients);
    addRecentScan(ingredients, results.length);
    setSearching(false);
    navigation.navigate(ROUTES.RESULTS, { ingredients, results });
  };

  useEffect(() => {
    if (route.params?.autoScan) {
      navigation.setParams({ autoScan: undefined, imageUri: undefined });
      simulateScan();
    }
  }, [route.params?.autoScan]);

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + SPACING.xl }]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan Ingredients</Text>
          <Text style={styles.headerSub}>Take a photo or type what you have</Text>
        </View>

        {/* ── Scan hero card ── */}
        <View style={styles.scanSection}>
          <Pressable 
            onPress={handleScan} 
            onPressIn={scanIn} 
            onPressOut={scanOut} 
            disabled={scanning}
            android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}
            style={({ pressed }) => [{ borderRadius: RADIUS.xl, overflow: 'hidden' }]}
          >
            <Animated.View style={{ transform: [{ scale: scanScale }] }}>
              <Animated.View style={{ transform: [{ scale: scanning ? pulseAnim : new Animated.Value(1) }] }}>
                <LinearGradient
                  colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.cameraCard}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.11)', 'transparent']}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
                    style={StyleSheet.absoluteFill} pointerEvents="none"
                  />
                  <View style={styles.cameraIconWrap}>
                    <Camera size={36} color="#FBD96A" strokeWidth={ICON_STROKE} />
                  </View>
                  <Text style={styles.cameraTitle}>Smart Scan</Text>
                  <Text style={styles.cameraSub}>Point at your fridge to detect ingredients</Text>
                </LinearGradient>
              </Animated.View>
            </Animated.View>
          </Pressable>

          {/* Gallery pill */}
          <Pressable 
            onPress={handleGallery} 
            onPressIn={galIn} 
            onPressOut={galOut} 
            disabled={scanning}
            android_ripple={{ color: 'rgba(124,58,237,0.08)', borderless: false }}
            style={({ pressed }) => [{ borderRadius: RADIUS.full, overflow: 'hidden' }]}
          >
            <Animated.View style={[styles.galleryPill, { transform: [{ scale: galScale }] }]}>
              <ImageIcon size={18} color="#7C3AED" strokeWidth={ICON_STROKE + 0.5} />
              <Text style={styles.galleryText}>Upload from Gallery</Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* ── Scanning indicator ── */}
        {scanning && (
          <View style={styles.scanningBanner}>
            <ActivityIndicator size="small" color="#3E6B50" />
            <Text style={styles.scanningText}>AI is detecting your ingredients…</Text>
          </View>
        )}

        {/* ── Manual input ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Or type ingredients manually</Text>
          <View style={styles.inputWrap}>
            <Search size={18} color={C.textTertiary} strokeWidth={ICON_STROKE} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="e.g. tomatoes, eggs, garlic…"
              placeholderTextColor={C.textTertiary}
              onSubmitEditing={() => addIngredient(inputText)}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {inputText.length > 0 && (
              <Pressable onPress={() => addIngredient(inputText)} hitSlop={8} style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Quick add suggestions ── */}
        {ingredients.length < 5 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Quick add</Text>
            <View style={styles.chipsRow}>
              {SUGGESTIONS.filter(s => !ingredients.includes(s)).slice(0, 8).map(s => (
                <Pressable
                  key={s}
                  onPress={() => addIngredient(s)}
                  style={({ pressed }) => [styles.suggestionChip, pressed && Platform.OS === 'ios' && { opacity: 0.7 }]}
                  android_ripple={{ color: 'rgba(62,107,80,0.1)', radius: 40 }}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── Added ingredients ── */}
        {ingredients.length > 0 && (
          <View style={[styles.section, styles.addedSection]}>
            <View style={styles.addedHeader}>
              <Text style={styles.addedTitle}>
                {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
              </Text>
              <Pressable onPress={() => setIngredients([])}>
                <Text style={styles.clearAll}>Clear all</Text>
              </Pressable>
            </View>
            <View style={styles.chipsRow}>
              {ingredients.map(item => (
                <Pressable
                  key={item}
                  onPress={() => removeIngredient(item)}
                  style={styles.activeChip}
                  android_ripple={{ color: 'rgba(62,107,80,0.1)', radius: 30 }}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                  <Text style={styles.activeChipText}>{item}</Text>
                  <X size={13} color="#3E6B50" strokeWidth={ICON_STROKE + 0.5} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── Empty state ── */}
        {ingredients.length === 0 && !scanning && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Search size={30} color="#3E6B50" strokeWidth={ICON_STROKE} />
            </View>
            <Text style={styles.emptyTitle}>Add your ingredients</Text>
            <Text style={styles.emptySub}>
              Scan a photo or type what's in your fridge to get personalised recipe recommendations.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Floating CTA ── */}
      {ingredients.length > 0 && (
        <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + SPACING.md }]}>
          <Pressable
            onPress={handleFindRecipes}
            onPressIn={ctaIn}
            onPressOut={ctaOut}
            disabled={searching}
            style={({ pressed }) => [{ opacity: searching ? 0.7 : 1, borderRadius: RADIUS.xl, overflow: 'hidden' }]}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          >
            <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
              <LinearGradient
                colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.ctaBtn}
              >
                {searching ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <View style={styles.ctaContent}>
                    <Text style={styles.ctaText}>Find Recipes ({ingredients.length})</Text>
                    <ArrowRight size={20} color="#FBD96A" strokeWidth={ICON_STROKE + 0.5} />
                  </View>
                )}
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F1EA' },
  scroll: { paddingBottom: 140 },

  header: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E1E1C', letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#8A8A84' },

  scanSection: { paddingHorizontal: SPACING.xl, gap: SPACING.md, marginBottom: SPACING.xl },
  cameraCard: {
    height: 175, borderRadius: RADIUS.xl, padding: SPACING.xl,
    alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden',
    ...SHADOWS.lg,
  },
  cameraIconWrap: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(251,217,106,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  cameraTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  cameraSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },

  galleryPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
    ...SHADOWS.xs,
  },
  galleryText: { fontSize: 14, fontWeight: '700', color: '#1E1E1C' },

  scanningBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    marginHorizontal: SPACING.xl, padding: SPACING.md,
    backgroundColor: '#EDF5F0', borderRadius: RADIUS.xl, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: 'rgba(62,107,80,0.15)',
  },
  scanningText: { fontSize: 14, fontWeight: '600', color: '#3E6B50' },

  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: 'rgba(62,107,80,0.6)',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, textAlign: 'center',
  },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg, height: 54,
    borderWidth: 1, borderColor: 'rgba(228,221,210,0.9)',
    ...SHADOWS.xs,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1E1E1C', paddingVertical: 0 },
  addBtn: { backgroundColor: '#3E6B50', borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  suggestionChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(62,107,80,0.12)',
  },
  suggestionText: { fontSize: 13, fontWeight: '600', color: '#4A4A46' },

  addedSection: {
    borderTopWidth: 1, borderTopColor: 'rgba(62,107,80,0.09)',
    paddingTop: SPACING.xl, marginTop: SPACING.xs,
  },
  addedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  addedTitle: { fontSize: 15, fontWeight: '700', color: '#1E1E1C' },
  clearAll: { fontSize: 12, fontWeight: '700', color: '#E05252' },
  activeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full,
    backgroundColor: '#EDF5F0', borderWidth: 1.5, borderColor: 'rgba(62,107,80,0.2)',
  },
  activeChipText: { fontSize: 13, fontWeight: '700', color: '#3E6B50' },

  emptyState: { alignItems: 'center', paddingTop: 16, paddingHorizontal: 40, gap: 14 },
  emptyIcon: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#EDF5F0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(62,107,80,0.15)', marginBottom: 4,
  },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: '#1E1E1C' },
  emptySub: { fontSize: 14, color: '#8A8A84', textAlign: 'center', lineHeight: 22 },

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.md,
    backgroundColor: 'rgba(244,241,234,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(62,107,80,0.1)',
  },
  ctaBtn: {
    height: 58, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', ...SHADOWS.green,
  },
  ctaContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
