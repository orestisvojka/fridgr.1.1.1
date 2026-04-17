// src/components/AppText.jsx
import React from 'react';
import { Text } from 'react-native';
import { fontFamily } from '../styles/theme';

/**
 * Custom Text component that uses Poppins by default.
 * Use the 'weight' prop to change weights (regular, medium, semibold, bold, extrabold).
 */
export default function AppText({ style, weight = 'regular', ...props }) {
  return (
    <Text 
      {...props} 
      style={[
        { fontFamily: fontFamily[weight] || fontFamily.regular }, 
        style
      ]} 
    />
  );
}
