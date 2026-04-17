import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Linking, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as StoreReview from 'expo-store-review';
import { Star, ExternalLink } from 'lucide-react-native';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import PremiumScreenHeader from '../../components/PremiumScreenHeader';
import {
  PREMIUM,
  PREMIUM_CTA_VERTICAL,
  PREMIUM_CTA_VERTICAL_END,
  PREMIUM_CTA_VERTICAL_START,
} from '../../constants/premiumScreenTheme';

/** Placeholder store URLs — replace with real App Store / Play Store links at release. */
const STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/id000000000',
  android: 'https://play.google.com/store/apps/details?id=com.fridgr.app',
  default: 'https://fridgr.app',
});

export default function RateAppScreen({ navigation }) {
  const [busy, setBusy] = useState(false);

  const requestReview = async () => {
    setBusy(true);
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      } else if (STORE_URL) {
        await Linking.openURL(STORE_URL);
      }
    } catch {
      Alert.alert('Unable to open review', 'Please find FRIDGR in your app store and leave a rating there.');
    } finally {
      setBusy(false);
    }
  };

  const openStore = async () => {
    try {
      if (STORE_URL) await Linking.openURL(STORE_URL);
    } catch {
      Alert.alert('Could not open store');
    }
  };

  return (
    <PremiumScreenShell>
      <PremiumScreenHeader title="Rate FRIDGR" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Star size={32} color={PREMIUM.accent} strokeWidth={ICON_STROKE} fill="rgba(74,222,128,0.35)" />
          </View>
          <Text style={styles.title}>Enjoying the app?</Text>
          <Text style={styles.sub}>
            Ratings help others discover FRIDGR and help us keep improving recipes, scanning, and your kitchen flow.
          </Text>

          <Pressable
            onPress={requestReview}
            disabled={busy}
            style={({ pressed }) => [
              styles.primaryBtnWrap,
              pressed && { opacity: 0.9 },
              busy && { opacity: 0.7 },
            ]}
          >
            <LinearGradient
              colors={PREMIUM_CTA_VERTICAL}
              start={PREMIUM_CTA_VERTICAL_START}
              end={PREMIUM_CTA_VERTICAL_END}
              style={styles.primaryBtn}
            >
              <Star size={20} color="#FFFFFF" strokeWidth={ICON_STROKE} />
              <Text style={styles.primaryBtnText}>Rate in store</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={openStore}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <ExternalLink size={18} color={PREMIUM.accent} strokeWidth={ICON_STROKE} />
            <Text style={styles.secondaryBtnText}>View store page</Text>
          </Pressable>
        </View>
      </View>
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: SPACING.xl, justifyContent: 'center' },
  card: {
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: PREMIUM.cardBorder,
    backgroundColor: PREMIUM.cardBg,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(74,222,128,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
  },
  title: { ...FONT.h3, textAlign: 'center', color: PREMIUM.text },
  sub: { ...FONT.body, textAlign: 'center', lineHeight: 24, color: PREMIUM.textMuted },
  primaryBtnWrap: {
    alignSelf: 'stretch',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.md,
    ...SHADOWS.green,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
  },
  primaryBtnText: { ...FONT.h5, color: '#FFFFFF', fontFamily: 'Poppins_400Regular', fontWeight: '400' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    alignSelf: 'stretch',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PREMIUM.glassBorder,
    backgroundColor: PREMIUM.inputBg,
  },
  secondaryBtnText: { ...FONT.bodySemiBold, color: PREMIUM.accent },
});
