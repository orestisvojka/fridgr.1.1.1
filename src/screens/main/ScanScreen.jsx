// src/screens/main/ScanScreen.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator, Keyboard, Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image as ImageIcon, Search, X, ArrowRight, Sparkles, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
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
  'avocado', 'mushrooms', 'salmon', 'broccoli', 'carrot', 'potato',
];

const SIMULATED_SCAN_SETS = [
  ['tomatoes', 'eggs', 'onion', 'garlic'],
  ['pasta', 'butter', 'parmesan', 'garlic'],
  ['chicken', 'broccoli', 'soy sauce', 'ginger'],
  ['rice', 'eggs', 'spring onion', 'sesame oil'],
  ['avocado', 'lemon', 'sourdough bread'],
  ['salmon', 'lemon', 'garlic', 'butter', 'dill'],
];

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG_TOP   = '#1A1F1C';
const BG_MID   = '#222A26';
const BG_BOT   = '#2A3430';
const TEXT_PRI = 'rgba(255,255,255,0.92)';
const TEXT_SEC = 'rgba(255,255,255,0.50)';
const G_TICK   = '#4A7C5E';
const GOLD     = '#FBD96A';

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
    position: 'absolute', top: 0, left: 20, right: 20,
    height: 1, backgroundColor: 'rgba(255,255,255,0.18)',
  },
});

// ─── Spring press ─────────────────────────────────────────────────────────────
function useSpringPress(target = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = useCallback(() =>
    Animated.spring(scale, { toValue: target, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), [scale, target]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 14 }).start(), [scale]);
  return { scale, pressIn, pressOut };
}

// ─── Animated chip ────────────────────────────────────────────────────────────
function IngredientChip({ item, onRemove }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start();
  }, []);
  const handleRemove = () => {
    Animated.timing(scale, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => onRemove(item));
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handleRemove}
        style={s.activeChip}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Text style={s.activeChipText}>{item}</Text>
        <X size={12} color={TEXT_PRI} strokeWidth={ICON_STROKE + 0.5} />
      </Pressable>
    </Animated.View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ScanScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { addRecentScan } = useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [inputText, setInputText]     = useState('');
  const [scanning, setScanning]       = useState(false);
  const [searching, setSearching]     = useState(false);

  const inputRef  = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const orbY      = useRef(new Animated.Value(0)).current;
  const fadeOp    = useRef(new Animated.Value(0)).current;
  const slideY    = useRef(new Animated.Value(24)).current;

  const { scale: scanScale, pressIn: scanIn, pressOut: scanOut } = useSpringPress(0.97);
  const { scale: galScale,  pressIn: galIn,  pressOut: galOut  } = useSpringPress(0.96);
  const { scale: ctaScale,  pressIn: ctaIn,  pressOut: ctaOut  } = useSpringPress(0.97);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOp, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(orbY, { toValue: -12, duration: 3200, useNativeDriver: true }),
      Animated.timing(orbY, { toValue: 0,   duration: 3200, useNativeDriver: true }),
    ])).start();
  }, []);

  const addIngredient = (text) => {
    const t = text.trim().toLowerCase();
    if (t.length < 2 || ingredients.includes(t) || ingredients.length >= 20) return;
    setIngredients(prev => [...prev, t]);
    setInputText('');
  };

  const removeIngredient = useCallback((item) => {
    setIngredients(prev => prev.filter(i => i !== item));
  }, []);

  const runScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ]),
      { iterations: 3 },
    ).start();
  };

  const applySimulatedScan = () => {
    setScanning(true);
    runScanAnimation();
    setTimeout(() => {
      const set = SIMULATED_SCAN_SETS[Math.floor(Math.random() * SIMULATED_SCAN_SETS.length)];
      setIngredients(prev => [...new Set([...prev, ...set])].slice(0, 20));
      setScanning(false);
    }, 1800);
  };

  const handleScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera Access', 'Please allow camera access to scan ingredients.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) applySimulatedScan();
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Gallery Access', 'Please allow gallery access to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled) applySimulatedScan();
  };

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) return;
    setSearching(true);
    await new Promise(r => setTimeout(r, 700));
    const results = findMatchingRecipes(ingredients);
    addRecentScan(ingredients, results.length);
    setSearching(false);
    navigation.navigate(ROUTES.RESULTS, { ingredients, results });
  };

  useEffect(() => {
    if (route.params?.autoScan) {
      navigation.setParams({ autoScan: undefined });
      applySimulatedScan();
    }
  }, [route.params?.autoScan]);

  const suggestions = SUGGESTIONS.filter(sg => !ingredients.includes(sg));

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

          {/* ── Header ── */}
          <View style={s.header}>
            <Text style={s.headerTitle}>What's in your fridge?</Text>
            <Text style={s.headerSub}>Scan a photo or type your ingredients</Text>
          </View>

          {/* ── Camera / Gallery row ── */}
          <View style={s.scanRow}>
            <Pressable onPress={handleScan} onPressIn={scanIn} onPressOut={scanOut} disabled={scanning} style={{ flex: 1 }}>
              <Animated.View style={{ transform: [{ scale: scanScale }] }}>
                <Animated.View style={{ transform: [{ scale: scanning ? pulseAnim : new Animated.Value(1) }] }}>
                  <GlassCard style={s.cameraCard}>
                    <View style={s.cameraIconWrap}>
                      <Camera size={28} color={GOLD} strokeWidth={ICON_STROKE} />
                    </View>
                    <Text style={s.cameraTitle}>Scan</Text>
                    <Text style={s.cameraSub}>Use camera</Text>
                  </GlassCard>
                </Animated.View>
              </Animated.View>
            </Pressable>

            <Pressable onPress={handleGallery} onPressIn={galIn} onPressOut={galOut} disabled={scanning} style={{ flex: 1 }}>
              <Animated.View style={{ transform: [{ scale: galScale }] }}>
                <GlassCard style={s.cameraCard}>
                  <View style={s.cameraIconWrap}>
                    <ImageIcon size={28} color="rgba(255,255,255,0.8)" strokeWidth={ICON_STROKE} />
                  </View>
                  <Text style={s.cameraTitle}>Upload</Text>
                  <Text style={s.cameraSub}>From gallery</Text>
                </GlassCard>
              </Animated.View>
            </Pressable>
          </View>

          {/* ── Scanning indicator ── */}
          {scanning && (
            <GlassCard style={s.scanningBanner}>
              <ActivityIndicator size="small" color={G_TICK} />
              <Text style={s.scanningText}>Detecting ingredients…</Text>
            </GlassCard>
          )}

          {/* ── Divider ── */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or type manually</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ── Text input ── */}
          <GlassCard style={s.inputRow}>
            <Search size={17} color={TEXT_SEC} strokeWidth={ICON_STROKE} />
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder="e.g. eggs, tomato, garlic…"
              placeholderTextColor={TEXT_SEC}
              style={s.input}
              onSubmitEditing={() => addIngredient(inputText)}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {inputText.trim().length >= 2 && (
              <Pressable onPress={() => addIngredient(inputText)} style={s.addBtn} hitSlop={8}>
                <Plus size={16} color="#FFF" strokeWidth={2.5} />
              </Pressable>
            )}
          </GlassCard>

          {/* ── Suggestion chips ── */}
          {suggestions.length > 0 && (
            <View style={s.suggestSection}>
              <Text style={s.sectionLabel}>Quick add</Text>
              <View style={s.chipsRow}>
                {suggestions.slice(0, 14).map(item => (
                  <Pressable
                    key={item}
                    onPress={() => addIngredient(item)}
                    style={({ pressed }) => [s.suggestionChip, pressed && { opacity: 0.7 }]}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  >
                    <Text style={s.suggestionText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* ── Added ingredients ── */}
          {ingredients.length > 0 && (
            <View style={s.addedSection}>
              <View style={s.addedHeader}>
                <Text style={s.addedTitle}>
                  {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
                </Text>
                <Pressable onPress={() => setIngredients([])} hitSlop={8}>
                  <Text style={s.clearAll}>Clear all</Text>
                </Pressable>
              </View>
              <View style={s.chipsRow}>
                {ingredients.map(item => (
                  <IngredientChip key={item} item={item} onRemove={removeIngredient} />
                ))}
              </View>
            </View>
          )}

          {/* ── Empty state (no ingredients yet) ── */}
          {ingredients.length === 0 && !scanning && (
            <View style={s.emptyWrap}>
              <GlassCard style={s.emptyCard}>
                <View style={s.emptyIconWrap}>
                  <Sparkles size={26} color={GOLD} strokeWidth={ICON_STROKE} />
                </View>
                <Text style={s.emptyTitle}>Add your ingredients</Text>
                <Text style={s.emptySub}>
                  Type what's in your fridge above, or tap a suggestion chip to get started.
                </Text>
              </GlassCard>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* ── Floating Find Recipes CTA ── */}
      {ingredients.length > 0 && (
        <View style={[s.ctaWrap, {
          bottom: Platform.OS === 'android' ? 70 + insets.bottom : 0,
          paddingBottom: Platform.OS === 'android'
            ? SPACING.md
            : insets.bottom + 70 + SPACING.md,
        }]}>
          <LinearGradient
            colors={['rgba(26,31,28,0)', BG_BOT]}
            locations={[0, 0.35]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Pressable
            onPress={handleFindRecipes}
            onPressIn={ctaIn}
            onPressOut={ctaOut}
            disabled={searching}
            style={{ opacity: searching ? 0.7 : 1 }}
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
                    <Text style={s.ctaText}>Find Recipes</Text>
                    <View style={s.ctaBadge}>
                      <Text style={s.ctaBadgeText}>{ingredients.length}</Text>
                    </View>
                    <ArrowRight size={18} color="#FFF" strokeWidth={ICON_STROKE + 0.5} />
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
  root:   { flex: 1, backgroundColor: BG_TOP },
  scroll: { paddingBottom: 150, paddingHorizontal: SPACING.xl },

  orb: {
    position: 'absolute', top: -60, right: -60,
    width: SCREEN_W * 0.55, height: SCREEN_W * 0.55,
    borderRadius: SCREEN_W * 0.275,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  // Header
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 4 },
  headerSub:   { fontSize: 13, color: TEXT_SEC },

  // Camera row
  scanRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  cameraCard: {
    height: 130, alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: SPACING.lg,
  },
  cameraIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  cameraTitle: { fontSize: 15, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },
  cameraSub:   { fontSize: 12, color: TEXT_SEC },

  // Scanning indicator
  scanningBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: SPACING.md, marginBottom: SPACING.xl,
  },
  scanningText: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.10)' },
  dividerText: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_SEC, letterSpacing: 0.3 },

  // Text input
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, height: 52, marginBottom: SPACING.xl,
  },
  input: {
    flex: 1, fontSize: 15, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF',
    paddingVertical: 0,
  },
  addBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: G_TICK,
    alignItems: 'center', justifyContent: 'center',
  },

  // Suggestions
  suggestSection: { marginBottom: SPACING.xl },
  sectionLabel: {
    fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_SEC,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  suggestionText: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

  // Added ingredients
  addedSection: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: SPACING.xl, marginBottom: SPACING.xl,
  },
  addedHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addedTitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },
  clearAll:   { fontSize: 12, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FF6B6B' },
  activeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: 'rgba(74,124,94,0.28)',
    borderWidth: 1.5, borderColor: 'rgba(74,124,94,0.40)',
  },
  activeChipText: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: TEXT_PRI },

  // Empty state
  emptyWrap: { marginTop: SPACING.md },
  emptyCard: { alignItems: 'center', padding: SPACING.xxl, gap: 12 },
  emptyIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(251,217,106,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },
  emptySub:   { fontSize: 13, color: TEXT_SEC, textAlign: 'center', lineHeight: 20 },

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl,
    overflow: 'hidden',
  },
  ctaBtn: {
    height: 56, borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 14, elevation: 8,
    overflow: 'hidden',
  },
  ctaContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText:    { fontSize: 16, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFF' },
  ctaBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaBadgeText: { fontSize: 12, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFF' },
});
