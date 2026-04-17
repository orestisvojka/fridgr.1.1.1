// src/screens/main/FavoritesScreen.jsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  Animated, ActivityIndicator, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Search, Trash2, Clock, Flame, ChevronRight, RefreshCw, Layers, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

const { width } = Dimensions.get('window');

// ─── Filter Tab ──────────────────────────────────────────────────────────────
function FilterTab({ label, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start(), []);
  const pressOut = useCallback(() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(), []);

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.tabWrap, active && styles.tabActive, { transform: [{ scale }] }]}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Premium Saved Card ───────────────────────────────────────────────────────
function PremiumSavedCard({ recipe, onPress, onRemove, C }) {
  const scale = useRef(new Animated.Value(1)).current;
  const removeScale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start(), []);
  const pressOut = useCallback(() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(), []);

  const handleRemove = useCallback(() => {
    Animated.sequence([
      Animated.spring(removeScale, { toValue: 0.8, useNativeDriver: true, speed: 20 }),
      Animated.spring(removeScale, { toValue: 1.1, useNativeDriver: true, speed: 20 }),
    ]).start(() => onRemove());
  }, [onRemove]);

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={styles.cardContainer}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <RecipeImage recipe={recipe} height={200} borderRadius={RADIUS.xl} style={StyleSheet.absoluteFill} />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Remove Button */}
        <Pressable 
          onPress={handleRemove} 
          style={({pressed}) => [styles.removeBtn, pressed && { opacity: 0.7 }]}
          hitSlop={15}
        >
          <Animated.View style={{ transform: [{ scale: removeScale }] }}>
            <View style={[styles.removeIconWrap, { backgroundColor: C.primary, borderColor: C.primary }]}>
              <Bookmark size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={ICON_STROKE} />
            </View>
          </Animated.View>
        </Pressable>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{recipe.title}</Text>
          
          <View style={styles.cardMetaRow}>
            <View style={styles.metaPill}>
              <Clock size={12} color="#D1FAE5" />
              <Text style={styles.metaText}>{recipe.prepTime} min</Text>
            </View>
            <View style={styles.metaPill}>
              <Flame size={12} color="#FFE4E6" />
              <Text style={[styles.metaText, { color: '#FFE4E6' }]}>{recipe.calories} cal</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.metaText, { color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontWeight: '400' }]}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { savedRecipes, toggleSave, hydration, retryHydration } = useRecipes();
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [focusEpoch, setFocusEpoch] = useState(0);
  useFocusEffect(useCallback(() => { setFocusEpoch(e => e + 1); }, []));

  // Smart Collections Logic
  const collections = useMemo(() => {
    return [
      'All',
      'Quick (<20m)',
      'Easy',
      'High Protein',
      'Vegetarian'
    ];
  }, []);

  const filteredRecipes = useMemo(() => {
    let result = savedRecipes;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }

    if (activeTab === 'Quick (<20m)') result = result.filter(r => r.prepTime < 20);
    else if (activeTab === 'Easy') result = result.filter(r => r.difficulty === 'Easy');
    else if (activeTab === 'High Protein') result = result.filter(r => r.macros?.protein >= 20);
    else if (activeTab === 'Vegetarian') result = result.filter(r => r.tags?.includes('vegetarian'));

    return result;
  }, [savedRecipes, search, activeTab]);

  if (hydration === 'loading' && savedRecipes.length === 0) {
    return (
      <View style={[styles.loaderWrap, { backgroundColor: C.background }]}>
        <ActivityIndicator size="large" color="#3E6B50" />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: '#F8F9FA' }]}>
      {/* Header Area */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.lg }]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>My Collection</Text>
          <View style={styles.countBadge}>
            <Layers size={14} color="#3E6B50" />
            <Text style={styles.countText}>{savedRecipes.length}</Text>
          </View>
        </View>

        {/* Custom Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search my collection..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <XCircle size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* Horizontal Filter Tabs */}
        {savedRecipes.length > 0 && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={collections}
            keyExtractor={item => item}
            contentContainerStyle={styles.tabsContainer}
            renderItem={({ item }) => (
              <FilterTab 
                label={item} 
                active={activeTab === item} 
                onPress={() => setActiveTab(item)} 
              />
            )}
          />
        )}
      </View>

      {/* Main List */}
      {savedRecipes.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Bookmark size={40} color="#3E6B50" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySub}>Start exploring and tap the bookmark icon to build your personal cookbook.</Text>
          <Pressable 
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('RecipesTab')}
          >
            <Text style={styles.exploreBtnText}>Explore Recipes</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={r => r.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsTitle}>No matches found</Text>
              <Text style={styles.noResultsSub}>Try adjusting your search or filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PremiumSavedCard
              recipe={item}
              C={C}
              onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              onRemove={() => toggleSave(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  header: { 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: SPACING.md,
    ...SHADOWS.sm
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg
  },
  title: { fontSize: 26, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#111827', letterSpacing: -0.5 },
  countBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    backgroundColor: '#EDF5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full
  },
  countText: { fontSize: 14, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#3E6B50' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#111827' },

  tabsContainer: { paddingHorizontal: SPACING.xl, gap: 10 },
  tabWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: { backgroundColor: '#3E6B50', borderColor: '#3E6B50' },
  tabText: { fontSize: 13, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },

  listContainer: { padding: SPACING.xl, gap: SPACING.lg },
  
  cardContainer: { width: '100%' },
  card: {
    height: 200,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    ...SHADOWS.md
  },
  removeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  removeIconWrap: {
    width: 36, height: 36,
    borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: SPACING.lg,
    paddingRight: SPACING.xxl
  },
  cardTitle: { fontSize: 20, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 8 },
  cardMetaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: RADIUS.md
  },
  metaText: { fontSize: 12, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#D1FAE5' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDF5F0', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl },
  emptyTitle: { fontSize: 20, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#111827', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  exploreBtn: { backgroundColor: '#3E6B50', paddingHorizontal: 24, paddingVertical: 14, borderRadius: RADIUS.lg, ...SHADOWS.green },
  exploreBtnText: { fontSize: 15, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },

  noResults: { paddingVertical: 40, alignItems: 'center' },
  noResultsTitle: { fontSize: 16, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#111827' },
  noResultsSub: { fontSize: 14, color: '#6B7280' }
});
