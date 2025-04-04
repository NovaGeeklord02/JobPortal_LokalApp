// App.js (Root of your project)
import 'react-native-gesture-handler'; // Recommended to import first
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator'; // Verify path
import { BookmarksProvider } from './context/BookmarksContext'; // Verify path
import { COLORS } from './constants'; // Verify path

// Define App Theme based on constants
const theme = {
  ...DefaultTheme, // Base theme
  roundness: 6, // Slightly less round than default
  colors: {
    ...DefaultTheme.colors, // Inherit defaults
    primary: COLORS.primary, // Apply primary color
    accent: COLORS.accent, // Apply accent color (used by some components)
    background: COLORS.background, // Apply background color globally via Paper
    surface: COLORS.surface, // Apply card/surface color
    text: COLORS.text, // Default text color
    // You can customize more colors if needed
  },
};

export default function App() {
  console.log("App.js rendering - Setting up Providers and Navigator.");
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <BookmarksProvider>
           {/* Use light content on dark primary background */}
           <StatusBar style="light" backgroundColor={COLORS.primary} translucent={false}/>
           <AppNavigator />
        </BookmarksProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}