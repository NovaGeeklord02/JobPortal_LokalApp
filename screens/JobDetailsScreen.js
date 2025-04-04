// screens/JobDetailsScreen.js
import React, { useCallback } from 'react'; // Add useCallback here
import { ScrollView, StyleSheet, View, Linking, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, Paragraph, Button, IconButton, Divider, List, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure this is imported
import { useBookmarks } from '../context/BookmarksContext'; // Verify path
import { COLORS } from '../constants'; // Verify path
import ErrorMessage from '../components/ErrorMessage'; // Verify path

const JobDetailsScreen = ({ route, navigation }) => {
  // Validate route params robustly
  if (!route?.params?.job || typeof route.params.job !== 'object') {
    console.error("JobDetailsScreen: Invalid or missing job data in route params.");
    // Option 1: Navigate back
    // useEffect(() => { navigation.goBack(); }, [navigation]);
    // Option 2: Show error screen
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
             <ErrorMessage message="Job details are unavailable or invalid." />
        </SafeAreaView>
    );
  }
  const { job } = route.params;
  const { isBookmarked, addBookmark, removeBookmark, isLoadingBookmarks } = useBookmarks();

  const bookmarked = isBookmarked(job.id);

  const handleBookmarkToggle = useCallback(() => {
    if (isLoadingBookmarks) return;
    if (bookmarked) {
      removeBookmark(job.id);
    } else {
      addBookmark(job);
    }
  }, [isLoadingBookmarks, bookmarked, job, addBookmark, removeBookmark]); // Include all dependencies

  const handleShare = useCallback(async () => {
     try {
        const message = `Check out this job: ${job.title || 'Opportunity'} ${job.location_string ? `at ${job.location_string}` : ''}.`;
        await Share.share({ message, title: `Job: ${job.title || 'Opportunity'}` });
     } catch (error) {
        console.error('Error sharing job:', error.message);
        Alert.alert('Share Error', 'Could not share this job.');
     }
  }, [job.title, job.location_string]); // Depend on specific job fields used

  const handleContact = useCallback(async (url) => {
      try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
              await Linking.openURL(url);
          } else {
              console.warn(`Cannot open URL: ${url}`);
              Alert.alert('Error', `Cannot open this link: ${url}`);
          }
      } catch (error) {
          console.error('An error occurred trying to open URL', error);
          Alert.alert('Error', 'Could not perform the action.');
      }
  }, []); // No dependencies needed


  // Set header options dynamically
  React.useLayoutEffect(() => {
      navigation.setOptions({
          title: job?.title || 'Job Details',
          headerRight: () => (
             <View style={styles.headerButtons}>
               {isLoadingBookmarks ? (
                    <ActivityIndicator color={COLORS.white} style={styles.headerLoader}/>
               ) : (
                   <IconButton
                       icon={bookmarked ? "bookmark" : "bookmark-outline"}
                       iconColor={COLORS.white}
                       size={24}
                       onPress={handleBookmarkToggle}
                       disabled={isLoadingBookmarks}
                   />
               )}
               <IconButton
                   icon="share-variant-outline"
                   iconColor={COLORS.white}
                   size={24}
                   onPress={handleShare}
               />
             </View>
          ),
      });
  }, [navigation, bookmarked, job?.title, isLoadingBookmarks, handleBookmarkToggle, handleShare]); // Update dependencies

  // --- Data Extraction (using updated paths) ---
  const location = job.primary_details?.location_string || job.location_string || 'Location N/A';
  const salary = job.primary_details?.Salary || job.job_details?.Salary || job.salary_range || 'Not disclosed';
  const experience = job.primary_details?.Experience || job.job_details?.Experience || 'Not specified';
  const jobType = job.primary_details?.job_type || job.job_details?.job_type;
  const qualification = job.primary_details?.Qualification || job.job_details?.Qualification;
  const englishLevel = job.primary_details?.english_knowledge || job.job_details?.english_knowledge;
  const description = job.primary_details?.Job_Description || job.job_description || 'No description available.';
  const phoneNumber = job.phone_number_details?.phone_number;
  // WhatsApp removed

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            {/* Use job title directly in the main title component */}
            <Title style={styles.title}>{job.title || 'No Title'}</Title>
            {/* Location is now in the List below */}
            {/* <Paragraph style={styles.location}>{location}</Paragraph> */}

             <Divider style={styles.divider} />

             {/* --- Job Details List --- */}
             <List.Section>
                <List.Subheader style={styles.subheader}>Job Details</List.Subheader>
                {/* Location Item */}
                <List.Item
                    title="Location"
                    description={location}
                    descriptionNumberOfLines={3}
                    left={() => <List.Icon icon="map-marker-outline" color={COLORS.primary}/>}
                    titleStyle={styles.listItemTitle}
                />
                {/* Salary Item */}
                <List.Item
                    title="Salary"
                    description={salary}
                    descriptionNumberOfLines={2}
                    left={() => <List.Icon icon="cash" color={COLORS.primary}/>}
                    titleStyle={styles.listItemTitle}
                />
                {/* Experience Item */}
                 <List.Item
                    title="Experience Required"
                    description={experience}
                    descriptionNumberOfLines={2}
                    left={() => <List.Icon icon="briefcase-variant-outline" color={COLORS.primary}/>}
                    titleStyle={styles.listItemTitle}
                />
                {/* Conditional Items */}
                 {jobType && <List.Item
                    title="Job Type" description={jobType} descriptionNumberOfLines={2}
                    left={() => <List.Icon icon="clock-time-four-outline" color={COLORS.primary}/>} titleStyle={styles.listItemTitle}
                 />}
                {qualification && <List.Item
                    title="Qualification" description={qualification} descriptionNumberOfLines={2}
                    left={() => <List.Icon icon="school-outline" color={COLORS.primary}/>} titleStyle={styles.listItemTitle}
                />}
                 {englishLevel && <List.Item
                    title="English Level" description={englishLevel} descriptionNumberOfLines={2}
                    left={() => <List.Icon icon="translate" color={COLORS.primary}/>} titleStyle={styles.listItemTitle}
                 />}
             </List.Section>

            <Divider style={styles.divider} />

            {/* --- Description Section --- */}
            <List.Section>
               <List.Subheader style={styles.subheader}>Description</List.Subheader>
               <Paragraph style={styles.description}>{description}</Paragraph>
            </List.Section>

            {/* --- Contact Section (Phone Only) --- */}
            {phoneNumber && <Divider style={styles.divider} />}
            {phoneNumber && (
                 <List.Section>
                    <List.Subheader style={styles.subheader}>Contact</List.Subheader>
                    <View style={styles.contactSection}>
                         <Button
                           icon="phone"
                           mode="contained"
                           onPress={() => handleContact(`tel:${phoneNumber}`)}
                           style={styles.contactButton}
                           labelStyle={styles.buttonLabel}
                           compact
                           >
                             Call Employer
                         </Button>
                    </View>
                 </List.Section>
            )}

          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 }, // More padding at bottom
  card: { margin: 12, backgroundColor: COLORS.surface },
  title: { marginBottom: 15, fontWeight: 'bold', fontSize: 22, lineHeight: 28 }, // Added more margin below title
  // location style removed as location is now in the list
  divider: { marginVertical: 16 }, // Increased divider margin
  subheader: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  listItemTitle: { color: COLORS.text }, // Style for list item titles
  description: { lineHeight: 23, fontSize: 15, paddingHorizontal: 16, color: COLORS.secondaryText }, // Lighter description text
  contactSection: { paddingHorizontal: 16, marginTop: 5 },
  contactButton: { marginTop: 10, backgroundColor: COLORS.primary, alignSelf: 'flex-start' }, // Align button left
  buttonLabel: { color: COLORS.white },
  headerButtons: { flexDirection: 'row', marginRight: 5 },
  headerLoader: { marginRight: 20 } // Style for loader in header
});

export default JobDetailsScreen;