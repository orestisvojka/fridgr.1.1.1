import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail, MessageCircle, BookOpen, Lightbulb, ChevronRight,
} from 'lucide-react-native';
import { FONT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { ICON_STROKE } from '../../constants/icons';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import PremiumScreenHeader from '../../components/PremiumScreenHeader';
import { PREMIUM, PREMIUM_CTA_VERTICAL, PREMIUM_CTA_VERTICAL_END, PREMIUM_CTA_VERTICAL_START } from '../../constants/premiumScreenTheme';

const FAQ = [
  { q: 'How does ingredient scanning work?', a: 'Use the Scan tab to photograph your fridge or pantry. FRIDGR reads visible items and suggests recipes that match what you have.' },
  { q: 'Can I use FRIDGR offline?', a: 'Browsing saved recipes may work offline; scanning and search need a network connection.' },
  { q: 'How do I change my diet preferences?', a: 'Open Profile to review onboarding preferences. You can revisit settings as we add more controls in future updates.' },
];

const SUPPORT_EMAIL = 'mailto:support@fridgr.app?subject=FRIDGR%20Support';

export default function HelpSupportScreen({ navigation }) {
  const openMail = async () => {
    try {
      const ok = await Linking.canOpenURL(SUPPORT_EMAIL);
      if (ok) await Linking.openURL(SUPPORT_EMAIL);
      else Alert.alert('Email', 'No mail app available.');
    } catch {
      Alert.alert('Email', 'Could not open mail app.');
    }
  };

  return (
    <PremiumScreenShell>
      <PremiumScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={openMail}
          style={({ pressed }) => [
            styles.heroCard,
            pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
            SHADOWS.green,
          ]}
        >
          <LinearGradient
            colors={PREMIUM_CTA_VERTICAL}
            start={PREMIUM_CTA_VERTICAL_START}
            end={PREMIUM_CTA_VERTICAL_END}
            style={[StyleSheet.absoluteFillObject, { borderRadius: RADIUS.xl }]}
          />
          <View style={styles.heroIcon}>
            <Mail size={22} color="#FFFFFF" strokeWidth={ICON_STROKE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Contact support</Text>
            <Text style={styles.heroSub}>We typically reply within 1–2 business days.</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.85)" strokeWidth={ICON_STROKE} />
        </Pressable>

        <Text style={styles.sectionLabel}>Quick tips</Text>
        <View style={styles.tipRow}>
          <Lightbulb size={20} color="#FACC15" strokeWidth={ICON_STROKE} />
          <Text style={styles.tipText}>
            Save recipes you love from results — they appear under the Saved tab for easy access.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>FAQ</Text>
        {FAQ.map((item) => (
          <View key={item.q} style={styles.faq}>
            <View style={styles.faqHead}>
              <BookOpen size={18} color={PREMIUM.accent} strokeWidth={ICON_STROKE} />
              <Text style={styles.faqQ}>{item.q}</Text>
            </View>
            <Text style={styles.faqA}>{item.a}</Text>
          </View>
        ))}

        <View style={styles.note}>
          <MessageCircle size={18} color={PREMIUM.textMuted} strokeWidth={ICON_STROKE} />
          <Text style={styles.noteText}>
            For billing or subscription questions, include your app store receipt email so we can help faster.
          </Text>
        </View>
      </ScrollView>
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: SPACING.xl, paddingBottom: 48, gap: SPACING.lg },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { ...FONT.h5, color: '#FFFFFF' },
  heroSub: { ...FONT.caption, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  sectionLabel: { ...FONT.label, letterSpacing: 0.5, color: PREMIUM.textMuted },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    backgroundColor: PREMIUM.cardBg,
    borderColor: PREMIUM.cardBorder,
  },
  tipText: { ...FONT.body, flex: 1, lineHeight: 22, color: PREMIUM.text },
  faq: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: PREMIUM.cardBg,
    borderColor: PREMIUM.cardBorder,
  },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  faqQ: { ...FONT.bodySemiBold, flex: 1, color: PREMIUM.text },
  faqA: { ...FONT.bodySmall, lineHeight: 22, color: PREMIUM.textMuted },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(15,23,42,0.4)',
    borderWidth: 1,
    borderColor: PREMIUM.cardBorder,
  },
  noteText: { ...FONT.bodySmall, flex: 1, lineHeight: 20, color: PREMIUM.textMuted },
});
