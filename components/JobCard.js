// components/JobCard.js
import React from 'react';
import { StyleSheet, View } from 'react-native'; // Removed TouchableOpacity, using Card onPress
import { Card, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBookmarks } from '../context/BookmarksContext'; // Verify path
import { COLORS } from '../constants'; // Verify path

const JobCard = ({ job, onPress }) => {
  // Add a log to verify the structure of 'job' if data is missing
  // console.log('--- JobCard received job prop: ---', JSON.stringify(job, null, 2));

  const { isBookmarked, addBookmark, removeBookmark, isLoadingBookmarks } = useBookmarks();

  // Basic check for valid job object
  if (!job || typeof job !== 'object' || !job.id) {
      console.warn("JobCard rendering skipped due to invalid job prop:", job);
      return null;
  }

  const bookmarked = isBookmarked(job.id);

  const handleBookmarkToggle = (e) => {
    e.stopPropagation(); // Prevent card's onPress from firing when icon is tapped
    if (isLoadingBookmarks) return; // Prevent action while loading
    if (bookmarked) {
      removeBookmark(job.id);
    } else {
      addBookmark(job); // Pass the whole job object
    }
  };

  // Safely extract data using optional chaining and fallbacks
  const title = job.title || 'No Title Provided';
  const location = job.primary_details?.location_string || job.location_string || 'N/A';
  const salary = job.primary_details?.Salary || job.job_details?.Salary || job.salary_range || 'Not disclosed';
  // Phone number display is optional, only show if present
  const phone = job.phone_number_details?.phone_number;

  return (
    // Use Card's onPress directly
    <Card style={styles.card} onPress={onPress} elevation={2}>
       <Card.Content>
          <View style={styles.header}>
            {/* Use Text variant for consistent typography */}
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>{title}</Text>
            <IconButton
                icon={bookmarked ? "bookmark" : "bookmark-outline"}
                iconColor={bookmarked ? COLORS.primary : COLORS.secondaryText} // Use secondary text color for outline
                size={24}
                onPress={handleBookmarkToggle}
                style={styles.bookmarkIcon}
                disabled={isLoadingBookmarks} // Disable while loading state
            />
          </View>

          {/* Location Row */}
          <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={COLORS.secondaryText} />
              <Text variant="bodyMedium" style={styles.detailText} numberOfLines={1}>{location}</Text>
          </View>

          {/* Salary Row */}
          <View style={styles.detailRow}>
              <MaterialCommunityIcons name="cash" size={16} color={COLORS.secondaryText} />
              <Text variant="bodyMedium" style={styles.detailText} numberOfLines={1}>{salary}</Text>
          </View>

          {/* Phone Row (Conditional) */}
          {phone && (
              <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="phone-outline" size={16} color={COLORS.secondaryText} />
                  <Text variant="bodyMedium" style={styles.detailText}>{phone}</Text>
              </View>
          )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6, // Reduced vertical margin
    marginHorizontal: 12,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 22,
  },
  bookmarkIcon: {
     margin: -10, // Adjust positioning
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5, // Reduced spacing
  },
  detailText: {
    marginLeft: 8,
    color: COLORS.secondaryText, // Use lighter text for details
    flexShrink: 1,
    fontSize: 14,
  },
});

// Memoize for performance in FlatList
export default React.memo(JobCard);