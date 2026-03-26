// src/screens/main/NotificationsSetupScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, radius, spacing, fontSize, fontWeight } from '../../styles/theme';

export default function NotificationsSetupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    expiry: true,
    mealMatch: true,
    weeklyScan: false,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.title}>Fridgr works better with reminders</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.optionCard}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Remind when food expires</Text>
            <Text style={styles.optionDesc}>Don't let your ingredients go to waste.</Text>
          </View>
          <Switch 
            value={settings.expiry} 
            onValueChange={() => toggle('expiry')} 
            trackColor={{ true: '#15803D' }}
          />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Remind when I have enough ingredients</Text>
            <Text style={styles.optionDesc}>Get notified for potential high-protein meals.</Text>
          </View>
          <Switch 
            value={settings.mealMatch} 
            onValueChange={() => toggle('mealMatch')} 
            trackColor={{ true: '#15803D' }}
          />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Remind me to scan weekly</Text>
            <Text style={styles.optionDesc}>Keep your digital pantry up to date.</Text>
          </View>
          <Switch 
            value={settings.weeklyScan} 
            onValueChange={() => toggle('weeklyScan')} 
            trackColor={{ true: '#15803D' }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    ...shadows.sm,
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 18,
  },
});
