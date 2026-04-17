// src/screens/main/ProfileScreen.jsx
import { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Crown, Settings, HelpCircle, FileText, Star, LogOut, ChevronRight, Calendar, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { PREMIUM_HERO_COMPACT, PREMIUM_HERO_COMPACT_END, PREMIUM_HERO_COMPACT_START, PREMIUM_AVATAR_GRADIENT } from '../../constants/premiumScreenTheme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip({ stats }) {
  return (
    <View style={strip.wrap}>
      {stats.map((s, i) => (
        <View key={s.label} style={strip.row}>
          <View style={strip.item}>
            <Text style={strip.value}>{s.value}</Text>
            <Text style={strip.label}>{s.label}</Text>
          </View>
          {i < stats.length - 1 && <View style={strip.divider} />}
        </View>
      ))}
    </View>
  );
}

const strip = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl, paddingVertical: 14, ...SHADOWS.sm, borderWidth: 1, borderColor: 'rgba(228,221,210,0.7)' },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  value: { fontSize: 20, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#1E1E1C', letterSpacing: -0.5 },
  label: { fontSize: 10, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#8A8A84', letterSpacing: 0.2 },
  divider: { width: StyleSheet.hairlineWidth, height: 28, backgroundColor: 'rgba(62,107,80,0.15)' },
});

// ─── Menu item ────────────────────────────────────────────────────────────────
function MenuItem({ icon: Icon, label, value, onPress, iconBg, iconColor, isDestructive, isLast }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = useCallback(() =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 120, bounciness: 0 }).start(), [scale]);
  const pressOut = useCallback(() =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 14 }).start(), [scale]);

  return (
    <>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Animated.View style={[menu.row, { transform: [{ scale }] }]}>
          <View style={[menu.iconWrap, { backgroundColor: iconBg || 'rgba(62,107,80,0.08)' }]}>
            <Icon size={17} color={isDestructive ? '#E05252' : (iconColor || '#4A4A46')} strokeWidth={ICON_STROKE} />
          </View>
          <Text style={[menu.label, isDestructive && { color: '#E05252' }]}>{label}</Text>
          {value ? <Text style={menu.value}>{value}</Text> : null}
          {!isDestructive && <ChevronRight size={15} color="rgba(62,107,80,0.30)" strokeWidth={ICON_STROKE} />}
        </Animated.View>
      </Pressable>
      {!isLast && <View style={menu.divider} />}
    </>
  );
}

const menu = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: 14 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, lineHeight: 23, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#1E1E1C', flex: 1 },
  value: { fontSize: 13, lineHeight: 20, color: '#8A8A84', marginRight: 4 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(62,107,80,0.08)', marginLeft: SPACING.lg + 34 + SPACING.md },
});

// ─── Section label ────────────────────────────────────────────────────────────
function SectionTitle({ label }) {
  return <Text style={secTitle.text}>{label}</Text>;
}
const secTitle = StyleSheet.create({
  text: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', letterSpacing: 0.8, color: 'rgba(62,107,80,0.50)', textTransform: 'uppercase', marginLeft: 4, marginBottom: SPACING.sm },
});

// ─── Menu card ────────────────────────────────────────────────────────────────
function MenuCard({ children, destructive }) {
  return (
    <View style={[mc.card, destructive && mc.destructiveCard]}>
      {children}
    </View>
  );
}
const mc = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl, borderWidth: 1, borderColor: 'rgba(228,221,210,0.7)', ...SHADOWS.sm, overflow: 'hidden' },
  destructiveCard: { borderColor: 'rgba(224,82,82,0.15)', backgroundColor: '#FFF8F8' },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { user, logout } = useAuth();
  const { savedRecipes, clearStorage } = useRecipes();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    { label: 'Saved',     value: savedRecipes.length },
    { label: 'Generated', value: user?.stats?.recipesGenerated ?? 0 },
    { label: 'Streak',    value: `${user?.stats?.cookingStreak ?? 0}d` },
    { label: 'Scanned',   value: user?.stats?.ingredientsScanned ?? 0 },
  ];

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ── Hero ── */}
        <LinearGradient
          colors={PREMIUM_HERO_COMPACT}
          start={PREMIUM_HERO_COMPACT_START}
          end={PREMIUM_HERO_COMPACT_END}
          style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}
        >
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={PREMIUM_AVATAR_GRADIENT}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.heroName}>{user?.name?.trim() || 'Chef'}</Text>
          <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>
          <View style={styles.joinBadge}>
            <Calendar size={12} color="rgba(62,107,80,0.7)" strokeWidth={ICON_STROKE} />
            <Text style={styles.joinText}>Member since {user?.joinDate ?? '—'}</Text>
          </View>
        </LinearGradient>

        {/* ── Stats (overlaps hero) ── */}
        <View style={styles.statsRow}>
          <StatsStrip stats={stats} />
        </View>

        {/* ── Account ── */}
        <View style={styles.section}>
          <SectionTitle label="Account" />
          <MenuCard>
            <MenuItem icon={Bell}     label="Notifications" iconBg="rgba(62,107,80,0.08)" iconColor={C.primary} onPress={() => navigation.navigate(ROUTES.SETTINGS)} />
            <MenuItem icon={Crown}    label="Go Premium" value="Free plan" iconBg="rgba(202,138,4,0.12)" iconColor="#B45309" onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)} />
            <MenuItem icon={Settings} label="Settings" iconBg="rgba(62,107,80,0.08)" iconColor="#4A4A46" onPress={() => navigation.navigate(ROUTES.SETTINGS)} isLast />
          </MenuCard>
        </View>

        {/* ── More ── */}
        <View style={styles.section}>
          <SectionTitle label="More" />
          <MenuCard>
            <MenuItem icon={FileText}   label="Privacy Policy" iconBg="rgba(62,107,80,0.08)" iconColor="#4A4A46" onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)} />
            <MenuItem icon={RefreshCw} label="Clear Cache" iconBg="rgba(224,82,82,0.08)" iconColor="#E05252" onPress={() => {
              Alert.alert('Clear Cache', 'This will remove all saved recipes and reset app preferences. Proceed?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: async () => {
                  await clearStorage();
                  Alert.alert('Storage Cleared', 'Your local storage has been reset.');
                }},
              ]);
            }} isLast />
          </MenuCard>
        </View>

        {/* ── Sign out ── */}
        <View style={[styles.section, { paddingTop: 0 }]}>
          <MenuCard destructive>
            <MenuItem icon={LogOut} label="Sign Out" isDestructive onPress={handleLogout} isLast />
          </MenuCard>
        </View>

        <Text style={styles.version}>FRIDGR v1.1.1 · Made with care</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { alignItems: 'center', paddingBottom: SPACING.xl + 12, gap: 4 },
  avatarRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.35)', marginBottom: 4, ...SHADOWS.md },
  avatar: { width: 59, height: 59, borderRadius: 29.5, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF' },
  heroName: { fontSize: 18, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: '#FFFFFF', letterSpacing: -0.3 },
  heroEmail: { fontSize: 13, lineHeight: 20, color: 'rgba(255,255,255,0.55)' },
  joinBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 5, marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  joinText: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: 'rgba(30,30,28,0.65)' },
  statsRow: { paddingHorizontal: SPACING.lg, marginTop: -SPACING.lg, marginBottom: SPACING.sm },
  section: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, gap: SPACING.sm },
  version: { fontSize: 11, fontFamily: 'Poppins_400Regular', fontWeight: '400', color: 'rgba(62,107,80,0.35)', textAlign: 'center', marginTop: SPACING.xl },
});
