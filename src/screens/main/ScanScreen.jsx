// src/screens/main/ScanScreen.jsx
// Updated with charcoal glass effect — matching questionnaire aesthetic.

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator, Keyboard, Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image as ImageIcon, Search, X, ArrowRight, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';
import {
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_START,
  PREMIUM_CTA_VERTICAL_END,
} from '../../constants/premiumScreenTheme';

const { width: SCREEN_W } = Dimensions.get('window');

const SUGGESTIONS = [
  'eggs', 'tomatoes', 'garlic', 'onion', 'pasta', 'chicken',
  'spinach', 'cheese', 'butter', 'olive oil', 'lemon', 'rice',
  'avocado', 'mushrooms', 'salmon', 'broccoli',
];

const SIMULATED_SCAN_WORDS = [
  ['tomatoes', 'eggs', 'onion', 'garlic'],
  ['pasta', 'butter', 'parmesan', 'garlic'],
  ['chicken', 'broccoli', 'soy sauce', 'ginger'],
  ['rice', 'eggs', 'spring onion', 'sesame oil'],
  ['avocado', 'lemon', 'sourdough bread'],
  ['salmon', 'lemon', 'garlic', 'butter', 'dill'],
];

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG_TOP  = '#1A1F1C';
const BG_MID  = '#222A26';
const BG_BOT  = '#2A3430';
const TEXT_PRI = 'rgba(255,255,255,0.92)';
const TEXT_SEC = 'rgba(255,255,255,0.50)';
const G_TICK   = '#4A7C5E';

// ─── Glass card ───────────────────────────────────────────────────────────────
function GlassCard({ style, children }) {
  return (
    <View style={[gl.card, style]}>
      <View style={gl.shimmer} />
      {children}
    </View>
  );
}

const gl = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  shimmer: {
    position: 'absolute',
    top: 0, left: 20, right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});

// ─── Spring press helper ──────────────────────────────────────────────────────
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
  const orbY      = useRef(new Animated.Value(0)).current;
  const fadeOp    = useRef(new Animated.Value(0)).current;
  const slideY    = useRef(new Animated.Value(20)).current;

  const { scale: scanScale, pressIn: scanIn, pressOut: scanOut } = useSpringPress(0.97);
  const { scale: galScale,  pressIn: galIn,  pressOut: galOut  } = useSpringPress(0.96);
  const { scale: ctaScale,  pressIn: ctaIn,  pressOut: ctaOut  } = useSpringPress(0.97);

  // Entrance + orb animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOp, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orbY, { toValue: -10, duration: 3200, useNativeDriver: true }),
      Animated.timing(orbY, { toValue:   0, duration: 3200, useNativeDriver: true }),
    ])).start();
  }, []);

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
    <View style={s.root}>
      <LinearGradient colors={[BG_TOP, BG_MID, BG_BOT]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[s.orb, { transform: [{ translateY: orbY }] }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + SPACING.xl }]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <Animated.View style={{ opacity: fadeOp, transform: [{ translateY: slideY }] }}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>Scan Ingredients</Text>
            <Text style={s.headerSub}>Take a photo or type what you have</Text>
          </View>

          {/* Scan hero card — glass */}
          <View style={s.scanSection}>
            <Pressable
              onPress={handleScan}
              onPressIn={scanIn}
              onPressOut={scanOut}
              disabled={scanning}
            >
              <Animated.View style={{ transform: [{ scale: scanScale }] }}>
                <Animated.View style={{ transform: [{ scale: scanning ? pulseAnim : new Animated.Value(1) }] }}>
                  <GlassCard style={s.cameraCard}>
                    <View style={s.cameraIconWrap}>
                      <Camera size={36} color="#FBD96A" strokeWidth={ICON_STROKE} />
                    </View>
                    <Text style={s.cameraTitle}>Smart Scan</Text>
                    <Text style={s.cameraSub}>Point at your fridge to detect ingredients</Text>
                  </GlassCard>
                </Animated.View>
              </Animated.View>
            </Pressable>

            {/* Gallery button — glass */}
            <Pressable
              onPress={handleGallery}
              onPressIn={galIn}
              onPressOut={galOut}
              disabled={scanning}
            >
              <Animated.View style={{ transform: [{ scale: galScale }] }}>
                <GlassCard style={s.galleryPill}>
                  <ImageIcon size={18} color={TEXT_PRI} strokeWidth={ICON_STROKE + 0.5} />
                  <Text style={s.galleryText}>Upload from Gallery</Text>
                </GlassCard>
              </Animated.View>
            </Pressable>
          </View>

          {/* Scanning indicator */}
          {scanning && (
            <GlassCard style={s.scanningBanner}>
              <ActivityIndicator size="small" color={G_TICK} />
              <Text style={s.scanningText}>AI is detecting your ingredients…</Text>
            </GlassCard>
          )}




          {/* Added ingredients */}
          {ingredients.length > 0 && (
            <View style={[s.section, s.addedSection]}>
              <View style={s.addedHeader}>
                <Text style={s.addedTitle}>
                  {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
                </Text>
                <Pressable onPress={() => setIngredients([])}>
                  <Text style={s.clearAll}>Clear all</Text>
                </Pressable>
              </View>
              <View style={s.chipsRow}>
                {ingredients.map(item => (
                  <Pressable
                    key={item}
                    onPress={() => removeIngredient(item)}
                    style={s.activeChip}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Text style={s.activeChipText}>{item}</Text>
                    <X size={13} color={TEXT_PRI} strokeWidth={ICON_STROKE + 0.5} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Empty state */}
          {ingredients.length === 0 && !scanning && (
            <View style={s.emptyState}>
              <GlassCard style={s.emptyGlass}>
                <View style={s.emptyIcon}>
                  <Sparkles size={28} color="#FBD96A" strokeWidth={ICON_STROKE} />
                </View>
                <Text style={s.emptyTitle}>Add your ingredients</Text>
                <Text style={s.emptySub}>
                  Scan a photo or type what's in your fridge to get personalised recipe recommendations.
                </Text>
              </GlassCard>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Floating CTA */}
      {ingredients.length > 0 && (
        <View style={[s.ctaWrap, {
          bottom: Platform.OS === 'android' ? 70 + insets.bottom : 0,
          paddingBottom: Platform.OS === 'android' ? SPACING.md : insets.bottom + 70 + SPACING.md,
        }]}>
          <LinearGradient
            colors={['rgba(42,52,48,0)', BG_BOT]}
            locations={[0, 0.3]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Pressable
            onPress={handleFindRecipes}
            onPressIn={ctaIn}
            onPressOut={ctaOut}
            disabled={searching}
            style={({ pressed }) => [{ opacity: searching ? 0.7 : 1 }]}
          >
            <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
              <LinearGradient
                colors={PREMIUM_CTA_VERTICAL}
                start={PREMIUM_CTA_VERTICAL_START}
                end={PREMIUM_CTA_VERTICAL_END}
                style={s.ctaBtn}
              >
                {searching ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <View style={s.ctaContent}>
                    <Text style={s.ctaText}>Find Recipes ({ingredients.length})</Text>
                    <ArrowRight size={20} color="#FFF" strokeWidth={ICON_STROKE + 0.5} />
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_TOP },
  scroll: { paddingBottom: 140 },

  orb: {
    position: 'absolute', top: -60, right: -60,
    width: SCREEN_W * 0.5, height: SCREEN_W * 0.5,
    borderRadius: SCREEN_W * 0.25,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  header: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, color: TEXT_SEC },

  scanSection: { paddingHorizontal: SPACING.xl, gap: SPACING.md, marginBottom: SPACING.xl },
  cameraCard: {
    height: 175, padding: SPACING.xl,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  cameraIconWrap: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(251,217,106,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  cameraTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  cameraSub: { fontSize: 13, color: TEXT_SEC, textAlign: 'center' },

  galleryPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, borderRadius: RADIUS.full,
  },
  galleryText: { fontSize: 14, fontWeight: '700', color: TEXT_PRI },

  scanningBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    marginHorizontal: SPACING.xl, padding: SPACING.md, marginBottom: SPACING.lg,
  },
  scanningText: { fontSize: 14, fontWeight: '600', color: TEXT_PRI },

  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: TEXT_SEC,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, textAlign: 'center',
  },

  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, height: 54,
    borderRadius: RADIUS.xl,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: '#FFFFFF', paddingVertical: 0 },
  addBtn: { backgroundColor: G_TICK, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  suggestionChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  suggestionText: { fontSize: 13, fontWeight: '600', color: TEXT_PRI },

  addedSection: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: SPACING.xl, marginTop: SPACING.xs,
  },
  addedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  addedTitle: { fontSize: 15, fontWeight: '700', color: TEXT_PRI },
  clearAll: { fontSize: 12, fontWeight: '700', color: '#FF6B6B' },
  activeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(74,124,94,0.25)', borderWidth: 1.5, borderColor: 'rgba(74,124,94,0.35)',
  },
  activeChipText: { fontSize: 13, fontWeight: '700', color: TEXT_PRI },

  emptyState: { paddingHorizontal: SPACING.xl },
  emptyGlass: { alignItems: 'center', padding: SPACING.xxl, gap: 14 },
  emptyIcon: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(251,217,106,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  emptySub: { fontSize: 14, color: TEXT_SEC, textAlign: 'center', lineHeight: 22 },

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl,
    overflow: 'hidden',
  },
  ctaBtn: {
    height: 58, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
