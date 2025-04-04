// components/ErrorMessage.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper'; // Added Icon
import { COLORS } from '../constants'; // Verify path

const ErrorMessage = ({ message, onRetry }) => (
  <View style={styles.container}>
     <Icon source="alert-circle-outline" size={24} color={COLORS.error} />
    <Text style={styles.message}>{message || 'An unexpected error occurred.'}</Text>
    {onRetry && (
      <Button
        mode="contained"
        onPress={onRetry}
        style={styles.button}
        icon="refresh" // Add refresh icon
        >
        Retry
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    // Takes only needed space, unless it's the only thing on screen
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee', // Light red background
    borderBottomWidth: 1,
    borderBottomColor: COLORS.error,
    width: '100%',
    marginBottom: 10, // Add some margin below
  },
  message: {
    color: COLORS.error,
    marginTop: 8, // Space below icon
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
  },
   button: {
     backgroundColor: COLORS.error, // Use error color for button too
   }
});

export default ErrorMessage;