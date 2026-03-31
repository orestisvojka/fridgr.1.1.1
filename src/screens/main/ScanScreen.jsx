// src/screens/main/ScanScreen.jsx
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Camera,
  Image as ImageIcon,
  Search,
  Plus,
  X,
  ArrowRight,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecipes } from '../../context/RecipesContext';
import { findMatchingRecipes } from '../../services/recipeService';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
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

// ─── Spring Animations ────────────────────────────────────────────────────────
function SpringCard({ onPress, style, children, scaleTarget = 0.955, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    if (disabled) return;
    Animated.spring(scale, { toValue: scaleTarget, useNativeDriver: true, speed: 120, bounciness: 0 }).start();
  }, [scale, scaleTarget, disabled]);
  const pressOut = useCallback(() => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 14 }).start();
  }, [scale, disabled]);
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={disabled}>
      <Animated.View style={[style, { transform: [{ scale }], opacity: disabled ? 0.6 : 1 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function SpringBtn({ onPress, style, children, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 0.90, useNativeDriver: true, speed: 120, bounciness: 0 }).start();
  }, [scale, disabled]);
  const pressOut = useCallback(() => {
    if (disabled) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 18 }).start();
  }, [scale, disabled]);
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={disabled} style={style}>
      <Animated.View style={{ transform: [{ scale }], opacity: disabled ? 0.6 : 1 }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── GlassPanel ───────────────────────────────────────────────────────────────
function GlassPanel({ style, children, shimmerColor = 'rgba(62,107,80,0.14)' }) {
  return (
    <View style={[glassS.panel, style]}>
      <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.5)', 'rgba(249,247,242,0.2)']}
        start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.0)']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.40 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      <LinearGradient
        colors={[shimmerColor, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 0.55, y: 1 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      {children}
    </View>
  );
}

const glassS = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.92)',
    borderRadius: RADIUS.xl,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ScanScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { addRecentScan } = useRecipes();

  const [ingredients, setIngredients] = useState([]);
  const [inputText, setInputText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [searching, setSearching] = useState(false);

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
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      { iterations: 3 },
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

  useEffect(() => {
    if (route.params?.autoScan) {
      navigation.setParams({ autoScan: undefined, imageUri: undefined });
      simulateScan();
    }
  }, [route.params?.autoScan]);

  return (
    <View style={styles.container}>
      {/* Warm beige backdrop to make glass panels pop */}
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: insets.top + SPACING.xl }}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>Scan Ingredients</Text>
          <Text style={[styles.headerSub, { textAlign: 'center' }]}>Take a photo or type what you have</Text>
        </View>

        {/* ── Premium Scan Hero ── */}
        <View style={styles.scanBtns}>
          <SpringCard onPress={handleScan} disabled={scanning} scaleTarget={0.96}>
             <Animated.View style={{ transform: [{ scale: scanning ? pulseAnim : 1 }] }}>
               <LinearGradient
                  colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.cameraHeroCard}
               >
                 {/* Premium Glass reflection overlay */}
                 <LinearGradient
                    colors={['rgba(255,255,255,0.12)', 'transparent']}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
                    style={StyleSheet.absoluteFill} pointerEvents="none"
                 />
                 
                 <View style={styles.cameraViewfinder}>
                   <Camera size={38} color="#FBD96A" strokeWidth={ICON_STROKE} />
                 </View>
                 <Text style={styles.cameraHeroTitle}>Smart Scan</Text>
                 <Text style={styles.cameraHeroSub}>Point at your fridge to detect ingredients instantly</Text>
               </LinearGradient>
             </Animated.View>
          </SpringCard>

          {/* ── Gallery Pill ── */}
          <SpringBtn onPress={handleGallery} disabled={scanning}>
             <GlassPanel style={styles.galleryPill} shimmerColor="rgba(124,58,237,0.10)">
               <ImageIcon size={18} color="#7C3AED" strokeWidth={ICON_STROKE + 0.5} />
               <Text style={styles.galleryPillText}>Upload from Gallery</Text>
             </GlassPanel>
          </SpringBtn>
        </View>

        {/* ── Scanning Indicator ── */}
        {scanning && (
          <View style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}>
            <GlassPanel style={styles.scanningBanner} shimmerColor="rgba(62,107,80,0.20)">
              <ActivityIndicator size="small" color="#3E6B50" />
              <Text style={styles.scanningText}>AI is detecting your ingredients…</Text>
            </GlassPanel>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { textAlign: 'center' }]}>Or type ingredients manually</Text>
          
          {/* Glass Input Row (Symmetrical, full width) */}
          <View style={styles.inputRow}>
            <GlassPanel style={styles.inputWrap} shimmerColor="transparent">
              <Search size={18} color={C.textTertiary} strokeWidth={ICON_STROKE} style={{ marginRight: SPACING.sm }} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type and press return..."
                placeholderTextColor={C.textTertiary}
                onSubmitEditing={() => addIngredient(inputText)}
                returnKeyType="done"
                autoCapitalize="none"
              />
            </GlassPanel>
          </View>
        </View>

        {/* ── Suggestions (Quick Add) ── */}
        {ingredients.length < 5 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { textAlign: 'center' }]}>Quick add</Text>
            <View style={styles.chipsRow}>
              {SUGGESTIONS.filter(s => !ingredients.includes(s)).slice(0, 8).map(s => (
                <SpringBtn key={s} onPress={() => addIngredient(s)}>
                  <GlassPanel style={styles.suggestionChip} shimmerColor="transparent">
                    <Text style={styles.suggestionChipText}>{s}</Text>
                  </GlassPanel>
                </SpringBtn>
              ))}
            </View>
          </View>
        )}

        {/* ── Added Ingredients ── */}
        {ingredients.length > 0 && (
          <View style={[styles.section, { borderTopWidth: 1, borderTopColor: 'rgba(62,107,80,0.1)', paddingTop: SPACING.xl, marginTop: SPACING.xs }]}>
            <View style={styles.addedHeader}>
              <Text style={styles.addedTitle}>
                {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
              </Text>
              <SpringBtn onPress={() => setIngredients([])}>
                <Text style={styles.clearAll}>Clear all</Text>
              </SpringBtn>
            </View>
            <View style={styles.chipsRow}>
              {ingredients.map(item => (
                <SpringBtn key={item} onPress={() => removeIngredient(item)}>
                  <GlassPanel style={styles.activeChip} shimmerColor="rgba(62,107,80,0.25)">
                    <Text style={styles.activeChipText}>{item}</Text>
                    <X size={14} color="#3E6B50" strokeWidth={ICON_STROKE + 0.5} style={{ marginLeft: 4 }} />
                  </GlassPanel>
                </SpringBtn>
              ))}
            </View>
          </View>
        )}

        {ingredients.length === 0 && !scanning && (
          <View style={styles.emptyState}>
            <GlassPanel style={styles.emptyIcon} shimmerColor="rgba(62,107,80,0.15)">
              <Search size={32} color="#3E6B50" strokeWidth={ICON_STROKE} />
            </GlassPanel>
            <Text style={styles.emptyTitle}>Add your ingredients</Text>
            <Text style={styles.emptySub}>
              Scan a photo or type what's in your fridge to get personalized recipe recommendations.
            </Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* ── Floatin CTA ── */}
      {ingredients.length > 0 && (
        <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + SPACING.lg }]}>
          <SpringCard onPress={handleFindRecipes} disabled={searching} scaleTarget={0.97}>
             <LinearGradient
                colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaBtn}
             >
               <LinearGradient
                  colors={['rgba(255,255,255,0.12)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
                  style={StyleSheet.absoluteFill} pointerEvents="none"
               />
               {searching ? (
                 <ActivityIndicator color="#FFF" />
               ) : (
                 <View style={styles.ctaBtnContent}>
                   <Text style={styles.ctaBtnText}>Generate Recipes ({ingredients.length})</Text>
                   <ArrowRight size={20} color="#FBD96A" strokeWidth={ICON_STROKE + 0.5} />
                 </View>
               )}
             </LinearGradient>
          </SpringCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1EA' },
  header: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E1E1C', letterSpacing: -0.5, marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#8A8A84' },
  
  scanBtns: { gap: SPACING.md, paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  cameraHeroCard: {
    height: 180,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    shadowColor: '#0D3B26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  cameraViewfinder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(251,217,106,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  cameraHeroTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  cameraHeroSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  galleryPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 54, borderRadius: RADIUS.full,
  },
  galleryPillText: { fontSize: 14, fontWeight: '700', color: '#1E1E1C' },
  
  scanningBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    padding: SPACING.lg, borderRadius: RADIUS.xl,
  },
  scanningText: { fontSize: 14, fontWeight: '600', color: '#3E6B50' },

  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(62,107,80,0.6)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 4 },
  
  inputRow: { flexDirection: 'row' },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, height: 54, borderRadius: RADIUS.xl,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1E1E1C', paddingVertical: 0, paddingRight: 10 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  suggestionChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full,
  },
  suggestionChipText: { fontSize: 13, fontWeight: '600', color: '#8A8A84' },
  
  addedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  addedTitle: { fontSize: 15, fontWeight: '700', color: '#1E1E1C' },
  clearAll: { fontSize: 12, fontWeight: '700', color: '#E05252' },
  
  activeChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: 'rgba(62,107,80,0.2)'
  },
  activeChipText: { fontSize: 13, fontWeight: '700', color: '#3E6B50' },

  emptyState: { alignItems: 'center', paddingTop: 20, paddingHorizontal: 40, gap: 16 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1E1E1C' },
  emptySub: { fontSize: 14, color: '#8A8A84', textAlign: 'center', lineHeight: 22 },

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  ctaBtn: {
    height: 60, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', shadowColor: '#0D3B26', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 12,
  },
  ctaBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF' },
});
