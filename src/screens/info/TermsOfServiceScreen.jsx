import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FONT, SPACING, RADIUS } from '../../constants/theme';
import PremiumScreenShell from '../../components/PremiumScreenShell';
import PremiumScreenHeader from '../../components/PremiumScreenHeader';
import { PREMIUM } from '../../constants/premiumScreenTheme';

const SECTIONS = [
  {
    title: 'Agreement',
    body: 'By using FRIDGR, you agree to these Terms. If you do not agree, do not use the app.',
  },
  {
    title: 'The service',
    body: 'FRIDGR provides recipe inspiration based on ingredients you provide. Nutritional figures and cooking times are estimates and not medical or professional dietary advice.',
  },
  {
    title: 'Accounts',
    body: 'You are responsible for your account credentials and for activity under your account. Notify us promptly of unauthorized use.',
  },
  {
    title: 'Acceptable use',
    body: 'You may not misuse the service, attempt to access non-public systems, scrape or overload our infrastructure, or use FRIDGR for unlawful purposes.',
  },
  {
    title: 'Subscriptions & fees',
    body: 'Premium features, if offered, are billed according to the plan you select. Renewals and cancellations follow the rules of the app store where you purchased.',
  },
  {
    title: 'Intellectual property',
    body: 'FRIDGR branding, design, and software are protected. You receive a limited, revocable license to use the app for personal, non-commercial purposes.',
  },
  {
    title: 'Disclaimer',
    body: 'The service is provided “as is” without warranties of any kind. We are not liable for any indirect or consequential damages to the fullest extent permitted by law.',
  },
  {
    title: 'Termination',
    body: 'We may suspend or terminate access for violations of these Terms or to protect the service. You may stop using FRIDGR at any time.',
  },
  {
    title: 'Contact',
    body: 'Legal questions: legal@fridgr.app (placeholder for production).',
  },
];

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <PremiumScreenShell>
      <PremiumScreenHeader title="Terms of Service" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>
          Last updated: March 2025
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
