// screens/JobsScreen.js
import React, { useEffect, useCallback, useState } from 'react'; // Added useState
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard from '../components/JobCard'; // Verify path
import LoadingIndicator from '../components/LoadingIndicator'; // Verify path
import ErrorMessage from '../components/ErrorMessage'; // Verify path
import useFetchJobs from '../hooks/useFetchJobs'; // Verify path
import { COLORS } from '../constants'; // Verify path
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const JobsScreen = () => {
  const navigation = useNavigation(); // Get navigation hook
  const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh indicator
  const {
    jobs,
    isLoading, // Tracks initial load / manual refresh
    isLoadingMore,
    error,
    hasMore,
    loadMoreJobs,
    refreshJobs, // Use the public refresh function from hook
  } = useFetchJobs();

  // Initial fetch effect - runs only once on mount
  useEffect(() => {
    console.log('EFFECT: JobsScreen mount effect RUNNING (ONCE)');
    // Initial fetch doesn't need to be awaited here
    refreshJobs(); // Use refreshJobs for initial load as well
  }, []); // Empty array ensures this runs only once

  // Handle pull-to-refresh action
  const handleRefresh = useCallback(async () => {
    console.log("Pull-to-refresh initiated...");
    setIsRefreshing(true); // Show refresh indicator
    try {
      await refreshJobs(); // Call the refresh logic from the hook
    } catch (e) {
      console.error("Error during manual refresh:", e);
      // Error state is already handled within the hook
    } finally {
      setIsRefreshing(false); // Hide refresh indicator
    }
  }, [refreshJobs]); // Dependency on the refresh function from the hook

  // Handle retry button press
  const handleRetry = useCallback(() => {
    console.log('Retry button pressed.');
    handleRefresh(); // Use the same refresh logic for retry
  }, [handleRefresh]); // Depend on handleRefresh

  // Navigate to details screen
  const navigateToDetails = useCallback((job) => {
    if (!job || !job.id) {
      console.warn("Attempted to navigate with invalid job:", job);
      return;
    }
    console.log(`Navigating to details for job ID: ${job.id}`);
    // Make sure 'JobDetails' matches the screen name in JobsStack
    navigation.navigate('JobDetails', { job });
  }, [navigation]);

  // Footer component for loading more indicator
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    console.log('Rendering loading more footer.');
    return <LoadingIndicator size="small" style={styles.footerLoader} />;
  }, [isLoadingMore]);

  // Component for empty list state
  const renderEmpty = useCallback(() => {
    // Don't show if loading initially or if there's an error covering the screen
    if (isLoading || (error && jobs.length === 0)) return null;
    console.log('Rendering empty list component.');
    return (
      <View style={styles.emptyContainer}>
        {/* Optional: Add an icon */}
        {/* <MaterialCommunityIcons name="briefcase-search-outline" size={64} color={COLORS.placeholder} /> */}
        <Text style={styles.emptyText}>No jobs found</Text>
        <Text style={styles.emptySubText}>Pull down to check again</Text>
      </View>
    );
  }, [isLoading, error, jobs.length]); // Dependencies

  // --- Render Logic ---

  // 1. Initial loading state (only show if jobs array is completely empty)
  if (isLoading && jobs.length === 0 && !isRefreshing) {
    console.log('RENDERING VIEW: Initial Loader (full screen)');
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  // 2. Initial error state (only show if jobs array is empty and not currently loading)
  if (error && jobs.length === 0 && !isLoading && !isRefreshing) {
    console.log('RENDERING VIEW: Initial Error (full screen)');
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Provide user-friendly message based on error potentially */}
        <ErrorMessage message={`Failed to load jobs. ${error}`} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // 3. Main list view (handles subsequent loads, errors, empty list)
  console.log(`RENDERING VIEW: FlatList (Jobs: ${jobs.length}, Error: ${!!error}, LoadingMore: ${isLoadingMore})`);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Show non-blocking error message at the top if an error occurs after initial load */}
      {error && jobs.length > 0 && (
        <ErrorMessage message={`Error fetching more jobs. ${error}`} onRetry={handleRetry} />
      )}
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => navigateToDetails(item)} />
        )}
        keyExtractor={(item, index) => {
          // Check if item and item.id exist and are valid (string or number)
          if (item && (typeof item.id === 'string' || typeof item.id === 'number')) {
            return item.id.toString();
          }
          // --- Fallback ---
          // If ID is missing, log a warning and use the item's index as a key.
          // Using index isn't ideal for performance if list items reorder,
          // but it prevents the crash and helps identify bad data from the API.
          console.warn(`[JobsScreen] FlatList item missing valid 'id' at index ${index}:`, item);
          return `fallback-key-${index}`; // Use index for fallback key
        }} // Ensure ID is string
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.5} // Adjust threshold as needed
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        // Pull-to-refresh props
        onRefresh={handleRefresh}
        refreshing={isRefreshing} // Use dedicated refreshing state
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: 4, // Reduced padding
    paddingBottom: 60, // Ensure space for footer/tab bar
    flexGrow: 1, // Important for centering empty component
  },
  footerLoader: {
    paddingVertical: 20,
    backgroundColor: 'transparent', // Ensure loader background isn't opaque white
  },
  emptyContainer: {
    flex: 1, // Take remaining space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
});

export default JobsScreen;