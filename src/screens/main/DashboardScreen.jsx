// src/screens/main/DashboardScreen.jsx
import { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList,
  Dimensions, Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell, Heart, Clock, Sparkles, ArrowRight
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { useThemeColors } from '../../context/ThemeContext';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { MOCK_RECIPES, TRENDING_IDS } from '../../data/mockData';
import { ICON_STROKE } from '../../constants/icons';
import RecipeImage from '../../components/RecipeImage';

const { width } = Dimensions.get('window');

// ─── SpringCard ───────────────────────────────────────────────────────────────
function SpringCard({ onPress, style, children, scaleTarget = 0.955 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: scaleTarget, useNativeDriver: true, speed: 120, bounciness: 0 }).start();
  }, [scale, scaleTarget]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 14 }).start();
  }, [scale]);
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── SpringBtn ────────────────────────────────────────────────────────────────
function SpringBtn({ onPress, style, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.90, useNativeDriver: true, speed: 120, bounciness: 0 }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 18 }).start();
  }, [scale]);
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={style}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── Recipe Card (Vertical layout matching the reference) ────────────────────
function InspirationCard({ recipe, onPress, isSaved, C }) {
  const CARD_W = width * 0.58;
  const CARD_H = 260;
  
  return (
    <SpringCard onPress={onPress} style={{ width: CARD_W, marginRight: SPACING.md }} scaleTarget={0.965}>
      <View style={[ic.inner, { height: CARD_H }]}>
        <RecipeImage recipe={recipe} height={CARD_H} borderRadius={RADIUS.xl} style={StyleSheet.absoluteFill} />
        
        {/* Bottom dark gradient for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Top Badges */}
        <View style={ic.topRow}>
          <View style={ic.timeBadge}>
            <Text style={ic.timeText}>{recipe.prepTime} min</Text>
          </View>
          <View style={[ic.heartBtn, isSaved && { backgroundColor: '#FFFFFF' }]}>
            <Heart size={14} color={isSaved ? '#E05252' : '#FFFFFF'} fill={isSaved ? '#E05252' : 'transparent'} strokeWidth={isSaved ? 0 : 2} />
          </View>
        </View>

        {/* Bottom Content */}
        <View style={ic.bottomContent}>
          <Text style={ic.title} numberOfLines={2}>{recipe.title}</Text>
          <View style={ic.authorRow}>
            {/* Mock author avatar */}
            <View style={ic.authorAvatar}>
              <Text style={ic.authorInitials}>{recipe.author ? recipe.author[0] : 'C'}</Text>
            </View>
            <Text style={ic.authorName} numberOfLines={1}>{recipe.author || 'Chef'}</Text>
          </View>
        </View>
      </View>
    </SpringCard>
  );
}

const ic = StyleSheet.create({
  inner: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  timeText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  heartBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', lineHeight: 22 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorAvatar: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#3E6B50',
    alignItems: 'center', justifyContent: 'center',
  },
  authorInitials: { fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  authorName: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.85)', flex: 1 },
});


// ─── Category Circular Item ──────────────────────────────────────────────────
function CategoryItem({ item, onPress, C }) {
  return (
    <SpringBtn onPress={onPress}>
      <View style={cat.wrap}>
        <View style={[cat.circle, { backgroundColor: C.surface2 }]}>
          <RecipeImage recipe={item.recipe} height={70} borderRadius={35} style={{ width: 70 }} />
        </View>
        <Text style={[cat.label, { color: C.text }]}>{item.label}</Text>
      </View>
    </SpringBtn>
  );
}

const cat = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6, marginRight: 20 },
  circle: { width: 70, height: 70, borderRadius: 35, overflow: 'hidden' },
  label: { fontSize: 12, fontWeight: '600' },
});


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { user } = useAuth();
  const { savedRecipes, isSaved } = useRecipes();

  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const trending = TRENDING_IDS
    .map(id => MOCK_RECIPES.find(r => r.id === id))
    .filter(Boolean);

  const dailyInspiration = useMemo(
    () => [...MOCK_RECIPES].sort(() => 0.5 - Math.random()).slice(0, 5),
    [],
  );

  // Use random mock recipes to fill in the category circle images
  const CATEGORIES = [
    { label: 'Pasta', recipe: MOCK_RECIPES[0] },
    { label: 'Pizza', recipe: MOCK_RECIPES[1] },
    { label: 'Biryani', recipe: MOCK_RECIPES[2] },
    { label: 'Coffee', recipe: MOCK_RECIPES[3] },
    { label: 'Dessert', recipe: MOCK_RECIPES[4] },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        style={{ opacity: fadeAnim }}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.navigate('ProfileTab')}>
               <View style={styles.avatarWrap}>
                 <Text style={styles.avatarText}>{(user?.name ?? 'C')[0].toUpperCase()}</Text>
               </View>
            </Pressable>
            <Text style={[styles.userName, { color: C.text }]}>{user?.name ?? 'Christina Elise'}</Text>
          </View>
          
          <SpringBtn onPress={() => Alert.alert('Notifications', 'You have no new notifications right now.')}>
            <View style={[styles.bellBtn, { borderColor: C.borderLight }]}>
              <Bell size={18} color={C.text} strokeWidth={ICON_STROKE} />
            </View>
          </SpringBtn>
        </View>

        {/* ── Daily Inspiration ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Daily Inspiration</Text>
            <SpringBtn onPress={() => navigation.navigate('RecipesTab')} style={styles.seeAllBtn}>
              <Text style={[styles.seeAllText, { color: '#3E6B50' }]}>See all</Text>
            </SpringBtn>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {dailyInspiration.map(recipe => (
              <InspirationCard
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved(recipe.id)}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Categories ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Categories</Text>
            <SpringBtn onPress={() => navigation.navigate('RecipesTab')} style={styles.seeAllBtn}>
              <Text style={[styles.seeAllText, { color: '#3E6B50' }]}>See all</Text>
            </SpringBtn>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {CATEGORIES.map(cat => (
              <CategoryItem
                key={cat.label}
                item={cat}
                C={C}
                onPress={() => navigation.navigate('RecipesTab', { category: cat.label })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Trending recipes ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Trending recipes</Text>
            <SpringBtn onPress={() => navigation.navigate('RecipesTab')} style={styles.seeAllBtn}>
              <Text style={[styles.seeAllText, { color: '#3E6B50' }]}>See all</Text>
            </SpringBtn>
          </View>

          <FlatList
            data={trending}
            keyExtractor={r => r.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <InspirationCard
                recipe={item}
                isSaved={isSaved(item.id)}
                C={C}
                onPress={() => navigation.navigate(ROUTES.DETAIL, { recipe: item })}
              />
            )}
          />
        </View>

        {/* ── Premium Banner ── */}
        {savedRecipes && savedRecipes.length < 3 && (
          <View style={{ paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl }}>
            <SpringCard
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              scaleTarget={0.968}
            >
              <View style={styles.premiumCard}>
                <LinearGradient
                  colors={['#0D3B26', '#1A5C3A', '#0D3B26']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumBanner}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.10)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  <View style={styles.premiumContent}>
                    <View style={styles.premiumChip}>
                      <Sparkles size={11} color="#FBD96A" strokeWidth={2} />
                      <Text style={styles.premiumChipText}>FRIDGR PREMIUM</Text>
                    </View>
                    <Text style={styles.premiumTitle}>
                      Unlimited scans {'&'} meal plans
                    </Text>
                    <View style={styles.premiumCta}>
                      <Text style={styles.premiumCtaText}>Try free for 7 days</Text>
                      <ArrowRight size={14} color="#D1FAE5" strokeWidth={ICON_STROKE} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </SpringCard>
          </View>
        )}

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#3E6B50',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  userName: { fontSize: 15, fontWeight: '600' },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  section: { paddingTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  seeAllBtn: { paddingVertical: 4 },
  seeAllText: { fontSize: 13, fontWeight: '600' },
  
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: 4 },

  premiumCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#0D3B26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  premiumBanner: { overflow: 'hidden' },
  premiumContent: { padding: SPACING.xl, gap: SPACING.md },
  premiumChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  premiumChipText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1, color: '#D1FAE5' },
  premiumTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 26 },
  premiumCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  premiumCtaText: { fontSize: 14, fontWeight: '700', color: '#D1FAE5' },
});
