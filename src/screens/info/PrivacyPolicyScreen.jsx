import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import PremiumScreenHeader from '../../components/PremiumScreenHeader';
import { PREMIUM } from '../../constants/premiumScreenTheme';

const SECTIONS = [
  {
    title: 'Overview',
    body: 'FRIDGR (“we”, “our”) helps you discover recipes based on ingredients you scan or enter. This policy explains what we collect, how we use it, and your choices.',
  },
  {
    title: 'Information we collect',
    body: 'Account details you provide (such as name and email), preferences from onboarding, and usage data needed to run the app (for example crash diagnostics if enabled). Photos you choose to analyze are processed to suggest recipes and are not used to train third-party models unless we clearly disclose otherwise.',
  },
  {
    title: 'How we use information',
    body: 'We use your information to provide features, personalize recipe suggestions, improve reliability and security, and communicate important service updates. Marketing emails are only sent if you opt in.',
  },
  {
    title: 'Sharing',
    body: 'We do not sell your personal information. We may share data with infrastructure providers who help us host and operate the service, bound by confidentiality and data-processing terms.',
  },
  {
    title: 'Retention & security',
    body: 'We retain information only as long as needed for the purposes described or as required by law. We use industry-standard safeguards; no method of transmission is 100% secure.',
  },
  {
    title: 'Your rights',
    body: 'Depending on where you live, you may have rights to access, correct, delete, or export your data, or to object to certain processing. Contact us to exercise these rights.',
  },
  {
    title: 'Children',
    body: 'FRIDGR is not directed at children under 13, and we do not knowingly collect their personal information.',
  },
  {
    title: 'Changes',
    body: 'We may update this policy from time to time. Continued use after changes means you accept the updated policy.',
  },
  {
    title: 'Contact',
    body: 'Questions about privacy? Reach us at privacy@fridgr.app (placeholder for production).',
  },
];

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <PremiumScreenShell>
      <PremiumScreenHeader title="Privacy Policy" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lead}>
          Last updated: March 2025 · FRIDGR v1.0
        </Text>
        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.block}>
            <Text style={styles.h}>{s.title}</Text>
            <Text style={styles.p}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </PremiumScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: SPACING.xl, paddingBottom: 48, gap: SPACING.md },
  lead: { ...FONT.bodySmall, marginBottom: SPACING.sm, color: PREMIUM.textMuted },
  block: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: PREMIUM.cardBg,
    borderColor: PREMIUM.cardBorder,
  },
  h: { ...FONT.h5, color: PREMIUM.text },
  p: { ...FONT.body, lineHeight: 24, color: PREMIUM.textMuted },
});
