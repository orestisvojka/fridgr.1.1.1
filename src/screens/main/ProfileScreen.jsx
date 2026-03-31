// src/screens/main/ProfileScreen.jsx
import React, { useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Bell, Crown, Settings, HelpCircle, FileText,
  Star, LogOut, ChevronRight, Calendar,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipesContext';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
  PREMIUM_HERO_COMPACT,
  PREMIUM_HERO_COMPACT_END,
  PREMIUM_HERO_COMPACT_START,
  PREMIUM_AVATAR_GRADIENT,
} from '../../constants/premiumScreenTheme';
import { useThemeColors } from '../../context/ThemeContext';
import { ICON_STROKE } from '../../constants/icons';

// ─── GlassPanel ───────────────────────────────────────────────────────────────
function GlassPanel({ style, children, shimmerColor = 'rgba(62,107,80,0.13)' }) {
  return (
    <View style={[glassS.panel, style]}>
      <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.5)', 'rgba(249,247,242,0.2)']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.38 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[shimmerColor, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
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
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// ─── SpringBtn (small pressables) ─────────────────────────────────────────────
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
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </Pressable>
  );
}

// ─── Stats strip (single glass bar, 4 items) ────────────────────────────────
function StatsStrip({ stats }) {
  return (
    <GlassPanel style={stripS.wrap} shimmerColor="rgba(62,107,80,0.10)">
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <View style={stripS.item}>
            <Text style={stripS.value}>{s.value}</Text>
            <Text style={stripS.label}>{s.label}</Text>
          </View>
          {i < stats.length - 1 && <View style={stripS.divider} />}
        </React.Fragment>
      ))}
    </GlassPanel>
  );
}

const stripS = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#2C4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 5,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  value: { fontSize: 20, fontWeight: '800', color: '#1E1E1C', letterSpacing: -0.5 },
  label: { fontSize: 10, fontWeight: '500', color: '#8A8A84', letterSpacing: 0.2 },
  divider: { width: 1, height: 28, backgroundColor: 'rgba(62,107,80,0.12)' },
});

// ─── MenuItem (glass row inside a glass card) ─────────────────────────────────
function MenuItem({ icon: Icon, label, value, onPress, iconBg, iconColor, isDestructive, C, isLast }) {
  return (
    <>
      <SpringBtn onPress={onPress}>
        <View style={menuS.row}>
          <View style={[menuS.iconWrap, { backgroundColor: iconBg || 'rgba(62,107,80,0.10)' }]}>
            <Icon
              size={17}
              color={isDestructive ? '#E05252' : (iconColor || C.textSecondary)}
              strokeWidth={ICON_STROKE}
            />
          </View>
          <Text style={[menuS.label, isDestructive && { color: '#E05252' }]}>{label}</Text>
          {value ? <Text style={menuS.value}>{value}</Text> : null}
          {!isDestructive && (
            <ChevronRight size={15} color="rgba(62,107,80,0.30)" strokeWidth={ICON_STROKE} />
          )}
        </View>
      </SpringBtn>
      {!isLast && <View style={menuS.divider} />}
    </>
  );
}

const menuS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { ...FONT.bodyMedium, color: '#1E1E1C', flex: 1 },
  value: { ...FONT.bodySmall, color: '#8A8A84', marginRight: 2 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(62,107,80,0.09)',
    marginLeft: SPACING.lg + 34 + SPACING.md,
  },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { user, logout } = useAuth();
  const { savedRecipes } = useRecipes();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const stats = [
    { label: 'Saved',     value: savedRecipes.length,              iconKey: 'heart',    color: '#22C55E' },
    { label: 'Generated', value: user?.stats?.recipesGenerated ?? 0, iconKey: 'sparkles', color: '#3E6B50' },
    { label: 'Streak',    value: `${user?.stats?.cookingStreak ?? 0}d`, iconKey: 'flame', color: '#F97316' },
    { label: 'Scanned',   value: user?.stats?.ingredientsScanned ?? 0, iconKey: 'scan',  color: '#3B82F6' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1EA' }}>
      {/* Warm cream backdrop */}
      <LinearGradient
        colors={['#F9F7F2', '#F4F1EA', '#EDE8DF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* ── Hero ── */}
        <LinearGradient
          colors={PREMIUM_HERO_COMPACT}
          start={PREMIUM_HERO_COMPACT_START}
          end={PREMIUM_HERO_COMPACT_END}
          style={[styles.hero, { paddingTop: insets.top + SPACING.md }]}
        >
          {/* Avatar */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={PREMIUM_AVATAR_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.heroName}>{user?.name?.trim() || 'Chef'}</Text>
          <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>

          {/* Glass join badge */}
          <GlassPanel style={styles.joinBadge} shimmerColor="rgba(255,255,255,0.22)">
            <Calendar size={12} color="rgba(62,107,80,0.60)" strokeWidth={ICON_STROKE} />
            <Text style={styles.joinText}>Member since {user?.joinDate ?? '—'}</Text>
          </GlassPanel>
        </LinearGradient>

        {/* ── Stats strip (glass, overlapping hero bottom) ── */}
        <View style={styles.statsRow}>
          <StatsStrip stats={stats} />
        </View>

        {/* ── Account section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <GlassPanel style={styles.menuCard} shimmerColor="rgba(62,107,80,0.10)">
            <MenuItem
              icon={Bell} label="Notifications"
              iconBg="rgba(62,107,80,0.10)" iconColor={C.primary}
              onPress={() => navigation.navigate(ROUTES.SETTINGS)}
              C={C}
            />
            <MenuItem
              icon={Crown} label="Go Premium" value="Free plan"
              iconBg="rgba(202,138,4,0.12)" iconColor="#B45309"
              onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION)}
              C={C}
            />
            <MenuItem
              icon={Settings} label="Settings"
              iconBg="rgba(62,107,80,0.08)" iconColor={C.textSecondary}
              onPress={() => navigation.navigate(ROUTES.SETTINGS)}
              C={C} isLast
            />
          </GlassPanel>
        </View>

        {/* ── More section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>More</Text>
          <GlassPanel style={styles.menuCard} shimmerColor="rgba(62,107,80,0.08)">
            <MenuItem
              icon={HelpCircle} label="Help & Support"
              iconBg="rgba(62,107,80,0.08)" iconColor={C.textSecondary}
              onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)}
              C={C}
            />
            <MenuItem
              icon={Star} label="Rate FRIDGR"
              iconBg="rgba(202,138,4,0.12)" iconColor="#B45309"
              onPress={() => navigation.navigate(ROUTES.RATE_APP)}
              C={C}
            />
            <MenuItem
              icon={FileText} label="Privacy Policy"
              iconBg="rgba(62,107,80,0.08)" iconColor={C.textSecondary}
              onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
              C={C} isLast
            />
          </GlassPanel>
        </View>

        {/* ── Sign out ── */}
        <View style={[styles.section, { paddingTop: 0 }]}>
          <GlassPanel style={styles.menuCard} shimmerColor="rgba(224,82,82,0.08)">
            <MenuItem
              icon={LogOut} label="Sign Out"
              isDestructive onPress={handleLogout}
              C={C} isLast
            />
          </GlassPanel>
        </View>

        <Text style={styles.version}>FRIDGR v1.1.1 · Made with care</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingBottom: SPACING.xl + 10,
    gap: 3,
  },
  avatarRing: {
    width: 62, height: 62, borderRadius: 31,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 57, height: 57, borderRadius: 28.5,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  heroName:  { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },
  joinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginTop: 6,
    borderRadius: RADIUS.full,
    borderColor: 'rgba(255,255,255,0.80)',
  },
  joinText: { fontSize: 11, fontWeight: '500', color: 'rgba(30,30,28,0.65)' },

  // ── Stats strip ──────────────────────────────────────────────────────────
  statsRow: {
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: 'rgba(62,107,80,0.50)',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  menuCard: {
    shadowColor: '#2C4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 5,
  },

  // ── Version ───────────────────────────────────────────────────────────────
  version: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(62,107,80,0.38)',
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
