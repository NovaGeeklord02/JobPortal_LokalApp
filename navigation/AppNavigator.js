// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens (verify paths)
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import { COLORS } from '../constants'; // Verify path

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for the Jobs Tab Flow
function JobsStack() {
  return (
    <Stack.Navigator
       screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white, // Use white for text/icons on primary header
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false, // Cleaner back button on iOS
       }}
    >
      <Stack.Screen
        name="JobList" // Screen name within this stack
        component={JobsScreen}
        options={{ title: 'Available Jobs' }}
      />
      <Stack.Screen
        name="JobDetails" // Screen name within this stack
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }} // Can be overridden in the component
      />
    </Stack.Navigator>
  );
}

// Main Bottom Tab Navigator
function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            // Use route.name which matches the Tab.Screen name prop
            if (route.name === 'JobsTab') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            } else if (route.name === 'BookmarksTab') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else {
              iconName = 'help-circle-outline'; // Fallback icon
            }
            return <MaterialCommunityIcons name={iconName} size={focused ? size + 1 : size} color={color} />;
          },
          // Tab colors
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.secondaryText, // Use lighter gray for inactive
          // Hide headers for Tabs, the StackNavigator handles its own header
          headerShown: false,
           // Style label text (using FUNCTIONAL style for 'focused')
           tabBarLabelStyle: ({ focused }) => ({
               fontSize: 11, // Slightly smaller text
               fontWeight: focused ? 'bold' : 'normal',
               paddingBottom: 4, // Adjust spacing
           }),
           // Style the entire tab bar
           tabBarStyle: {
               // Standard height, you can adjust
               // height: 60,
               paddingTop: 5,
               backgroundColor: COLORS.surface, // Use surface color for tab bar bg
               borderTopWidth: 1, // Subtle top border
               borderTopColor: COLORS.disabled,
           }
        })}
      >
        {/* Define the Tabs */}
        <Tab.Screen
          name="JobsTab" // This name is used in route.name check above
          component={JobsStack} // Assign the Stack Navigator here
          options={{ title: 'Jobs' }} // Tab label
        />
        <Tab.Screen
          name="BookmarksTab" // This name is used in route.name check above
          component={BookmarksScreen}
          options={{ title: 'Bookmarks' }} // Tab label
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;