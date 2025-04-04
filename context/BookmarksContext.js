// context/BookmarksContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  loadBookmarks as loadFromStorage,
  addBookmarkToStorage,
  removeBookmarkFromStorage,
} from '../database/bookmarkStorage'; // Verify path

const BookmarksContext = createContext({
    bookmarkedJobs: [],
    isLoadingBookmarks: true,
    addBookmark: async () => {},
    removeBookmark: async () => {},
    isBookmarked: () => false,
});

export const useBookmarks = () => useContext(BookmarksContext);

export const BookmarksProvider = ({ children }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial bookmarks
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const load = async () => {
      console.log("BookmarksContext: Loading initial bookmarks...");
      setIsLoading(true);
      try {
        const storedBookmarks = await loadFromStorage();
        if (isMounted) {
          setBookmarkedJobs(storedBookmarks);
          console.log(`BookmarksContext: Loaded ${storedBookmarks.length} bookmarks.`);
        }
      } catch (error) {
          console.error("BookmarksContext: Error loading bookmarks in useEffect", error);
          if (isMounted) setBookmarkedJobs([]); // Set empty on error
      } finally {
          if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; }; // Cleanup function
  }, []); // Empty dependency array: run only once on mount

  const addBookmark = useCallback(async (job) => {
    // Optimistic update UI immediately
    setBookmarkedJobs(prev => {
        if (!prev.find(b => b.id === job.id)) {
            return [...prev, job];
        }
        return prev; // No change if already exists
    });
    // Persist change in background
    await addBookmarkToStorage(job);
    // Optional: could refetch here, but optimistic should suffice
  }, []); // No dependencies needed if only using setBookmarkedJobs functional update

  const removeBookmark = useCallback(async (jobId) => {
     // Optimistic update UI immediately
     setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
     // Persist change in background
     await removeBookmarkFromStorage(jobId);
     // Optional: refetch
  }, []); // No dependencies needed

  const isBookmarked = useCallback((jobId) => {
    return !!bookmarkedJobs.find(job => job.id === jobId);
  }, [bookmarkedJobs]); // Depends on the current list of bookmarkedJobs

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = React.useMemo(() => ({
    bookmarkedJobs,
    isLoadingBookmarks: isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  }), [bookmarkedJobs, isLoading, addBookmark, removeBookmark, isBookmarked]);

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};