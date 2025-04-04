// screens/BookmarksScreen.js
import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure import
import { useBookmarks } from '../context/BookmarksContext'; // Verify path
import JobCard from '../components/JobCard'; // Verify path
import LoadingIndicator from '../components/LoadingIndicator'; // Verify path
import { COLORS } from '../constants'; // Verify path
import { Title } from 'react-native-paper';

const BookmarksScreen = () => {
  const { bookmarkedJobs, isLoadingBookmarks } = useBookmarks();
  const navigation = useNavigation();

  // Log state on focus/change
  useFocusEffect(
      useCallback(() => {
          console.log('BookmarksScreen focused/state change:', { isLoadingBookmarks, count: bookmarkedJobs.length });
          // Optional: Force refresh data if needed, but context should handle it
      }, [isLoadingBookmarks, bookmarkedJobs.length])
  );

  // Navigate to details
  const navigateToDetails = useCallback((job) => {
      if (!job || !job.id) return;
      console.log(`Navigating to details for bookmarked job ID: ${job.id}`);
      // Navigate to the details screen within the Jobs tab's stack
      navigation.navigate('JobsTab', { // Target the Tab navigator screen name
        screen: 'JobDetails',          // Target the screen name within the stack
        params: { job },               // Pass the job data
      });
  }, [navigation]);

  // Empty state component
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="bookmark-multiple-outline" size={64} color={COLORS.placeholder} />
      <Text style={styles.emptyText}>No Bookmarks Yet</Text>
      <Text style={styles.emptySubText}>Tap the bookmark icon on a job listing to save it here for offline viewing.</Text>
    </View>
  ), []); // No dependencies needed


  // Show loading indicator while bookmarks are loading from storage initially
  if (isLoadingBookmarks) {
    console.log('BookmarksScreen: Rendering loading indicator.');
    return (
      <SafeAreaView style={styles.safeArea}>
          {/* Can add Title here too if desired */}
          {/* <Title style={styles.title}>My Bookmarks</Title> */}
          <LoadingIndicator />
      </SafeAreaView>
    );
  }

  console.log(`BookmarksScreen: Rendering list with ${bookmarkedJobs.length} bookmarks.`);
  return (
    <SafeAreaView style={styles.safeArea}>
       <Title style={styles.title}>My Bookmarks</Title>
      <FlatList
        data={bookmarkedJobs || []} // Ensure data is an array
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => navigateToDetails(item)} />
        )}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is string
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  title: {
      fontSize: 24, fontWeight: 'bold', marginHorizontal: 16,
      marginTop: 20, marginBottom: 12, color: COLORS.primary, // Use primary color for title
  },
  listContent: { paddingVertical: 4, flexGrow: 1, paddingBottom: 60 },
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 30, marginTop: -60, // Adjust offset if needed
  },
  emptyText: {
    fontSize: 18, fontWeight: 'bold', textAlign: 'center',
    color: COLORS.secondaryText, marginTop: 16, marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14, textAlign: 'center',
    color: COLORS.placeholder, paddingHorizontal: 20,
  },
});

export default BookmarksScreen;