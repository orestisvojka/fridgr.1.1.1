// src/screens/main/CameraScanScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ROUTES } from '../../constants/routes';

export default function CameraScanScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Mock Camera View */}
      <View style={styles.cameraMock}>
        <View style={styles.overlay}>
           <Text style={styles.instruction}>Take a photo of your fridge or ingredients</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.captureBtn} 
          onPress={() => navigation.navigate(ROUTES.SCANNING_ANIMATION)}
        >
          <View style={styles.captureBtnInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryBtn}>
          <Ionicons name="images" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraMock: {
    flex: 1,
    backgroundColor: '#1C1917',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 100,
    paddingHorizontal: 40,
  },
  instruction: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  footer: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
