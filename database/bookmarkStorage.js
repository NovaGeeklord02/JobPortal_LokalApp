// database/bookmarkStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants'; // Verify path

export const loadBookmarks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load bookmarks from AsyncStorage.', e);
    return []; // Return empty array on error
  }
};

export const saveBookmarks = async (bookmarks) => {
  try {
    // Ensure we're saving an array
    const bookmarksToSave = Array.isArray(bookmarks) ? bookmarks : [];
    const jsonValue = JSON.stringify(bookmarksToSave);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, jsonValue);
  } catch (e) {
    console.error('Failed to save bookmarks to AsyncStorage.', e);
  }
};

export const addBookmarkToStorage = async (job) => {
  if (!job || !job.id) {
      console.error('Attempted to add invalid job to bookmarks:', job);
      return await loadBookmarks(); // Return current state if job is invalid
  }
  try {
    const currentBookmarks = await loadBookmarks();
    // Prevent duplicates
    if (!currentBookmarks.find(b => b.id === job.id)) {
      const updatedBookmarks = [...currentBookmarks, job];
      await saveBookmarks(updatedBookmarks);
      console.log(`Bookmark added: ${job.id}`);
      return updatedBookmarks;
    }
    console.log(`Bookmark already exists: ${job.id}`);
    return currentBookmarks; // Return current if already exists
  } catch (e) {
    console.error('Failed to add bookmark to AsyncStorage.', e);
    return await loadBookmarks(); // Return current state on error
  }
};

export const removeBookmarkFromStorage = async (jobId) => {
   if (!jobId) {
       console.error('Attempted to remove bookmark with invalid jobId:', jobId);
       return await loadBookmarks();
   }
  try {
    const currentBookmarks = await loadBookmarks();
    const updatedBookmarks = currentBookmarks.filter(job => job.id !== jobId);
    // Only save if the array actually changed
    if (updatedBookmarks.length !== currentBookmarks.length) {
        await saveBookmarks(updatedBookmarks);
        console.log(`Bookmark removed: ${jobId}`);
        return updatedBookmarks;
    }
    console.log(`Bookmark not found for removal: ${jobId}`);
    return currentBookmarks; // Return current if not found
  } catch (e) {
    console.error('Failed to remove bookmark from AsyncStorage.', e);
    return await loadBookmarks(); // Return current state on error
  }
};