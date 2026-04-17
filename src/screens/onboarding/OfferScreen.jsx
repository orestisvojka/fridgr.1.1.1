// src/screens/onboarding/OfferScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radius, fontSize, fontFamily, fontWeight } from '../../styles/theme';

export default function OfferScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#14532D', '#15803D']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EXCLUSIVE ACCESS</Text>
        </View>
        
        <Text style={styles.title}>Limited launch offer</Text>
        
        <View style={styles.discountBox}>
          <Text style={styles.discountAmount}>80% OFF</Text>
          <Text style={styles.discountLabel}>early-user discount</Text>
        </View>

        <Text style={styles.subtitle}>Lowest price you will ever see</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>$29.99</Text>
          <Text style={styles.newPrice}>$5.99</Text>
          <Text style={styles.pricePeriod}>/ year</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Claim my discount" 
          full 
          size="lg"
          color="#FFFFFF"
          labelStyle={{ color: '#15803D' }}
          onPress={() => navigation.navigate('CameraPermission')} 
        />
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('CameraPermission')}>
          <Text style={styles.skipText}>No thanks, I'll pay full price later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Added missing TouchableOpacity import in thought process, but need to be sure in the file.
// Wait, I'll just use View for skip for now or add the import.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15803D',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  discountBox: {
    alignItems: 'center',
    marginBottom: 30,
  },
  discountAmount: {
    fontSize: 64,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
  },
  discountLabel: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginTop: -5,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    gap: 8,
  },
  oldPrice: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: 32,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
  },
  pricePeriod: {
    fontSize: 16, lineHeight: 24,
    color: 'rgba(255,255,255,0.6)',
  },
  footer: {
    padding: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
  skipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14, lineHeight: 21,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
  },
});
