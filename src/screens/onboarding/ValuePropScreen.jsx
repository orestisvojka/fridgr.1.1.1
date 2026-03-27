// src/screens/onboarding/ValuePropScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius, fontSize, fontWeight } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function ValuePropScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>We turn your fridge into meal ideas.</Text>
        
        {/* Mockup Animation Placeholder */}
        <View style={styles.mockupContainer}>
          <View style={styles.mockupFrame}>
            <View style={styles.mockupImage}>
               <Text style={styles.emoji}>📸</Text>
            </View>
          </View>
        </View>

        <View style={styles.bullets}>
          <Text style={styles.bullet}>✔ No food waste</Text>
          <Text style={styles.bullet}>✔ High-protein meal suggestions</Text>
          <Text style={styles.bullet}>✔ Works in seconds</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Try Fridgr Free" 
          full 
          size="lg"
          onPress={() => navigation.navigate('HabitBuilding')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 42,
  },
  mockupContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mockupFrame: {
    width: width * 0.7,
    height: width * 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 8,
    borderColor: '#1C1917',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  mockupImage: {
    flex: 1,
    backgroundColor: '#F5F4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
  },
  bullets: {
    gap: 12,
    alignItems: 'center',
  },
  bullet: {
    fontSize: 16,
    fontWeight: '600',
    color: '#44403C',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
});
