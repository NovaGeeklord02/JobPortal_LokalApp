// components/LoadingIndicator.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants'; // Verify path

const LoadingIndicator = ({ size = 'large', style }) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator animating={true} color={COLORS.primary} size={size} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background, // Match background
  },
});

export default LoadingIndicator;