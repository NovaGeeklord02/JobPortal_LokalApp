// hooks/useFetchJobs.js
import { useState, useCallback } from 'react';
import { API_URL } from '../constants'; // Verify path

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = useCallback(async (pageNum = 1, initialLoad = false) => {
    // Prevent concurrent fetches
    if ((initialLoad && isLoading) || (!initialLoad && isLoadingMore)) {
      console.log(`Fetch blocked: page=${pageNum}, initial=${initialLoad}, isLoading=${isLoading}, isLoadingMore=${isLoadingMore}`);
      return; // Return a resolved promise if needed elsewhere, or just return void
    }

    console.log(`FETCH START: page=${pageNum}, initial=${initialLoad}`);

    // Set loading states
    if (initialLoad) {
      setIsLoading(true);
      // Reset states for initial load or refresh
      setPage(1); // Always reset page number for initial load
      setJobs([]); // Clear existing jobs immediately for refresh
      setHasMore(true);
      setError(null);
    } else {
      // Only try loading more if we expect more data
      if (!hasMore) {
        console.log("Load more blocked: hasMore is false.");
        return;
      }
      setIsLoadingMore(true);
      setError(null); // Clear error when loading more
    }

    try {
      const response = await fetch(`${API_URL}?page=${pageNum}`); // Use pageNum passed to function
      console.log(`API call: ${API_URL}?page=${pageNum}, Status: ${response.status}`);

      if (!response.ok) {
        let errorBody = `Status: ${response.status}`;
        try {
          // Try to get more info from the response
          const text = await response.text();
          errorBody += `, Body: ${text.substring(0, 100)}`; // Log first 100 chars
        } catch (parseError) { /* Ignore */ }
        throw new Error(`HTTP error! ${errorBody}`);
      }

      // Inside the try block of fetchJobs:

      const data = await response.json();
      const rawItems = data?.results || []; // Get the raw array

      if (!Array.isArray(rawItems)) {
        console.error("API did not return an array in 'results':", data);
        throw new Error("Invalid data format received from API.");
      }

      // --- ADD FILTERING LOGIC ---
      const validJobs = rawItems.filter(item =>
        item && typeof item === 'object' && item.id && item.title
      );
      console.log(`Filtered ${rawItems.length} raw items down to ${validJobs.length} valid jobs for page ${pageNum}.`);
      if (validJobs.length === 0 && rawItems.length > 0) {
        console.warn("API returned items, but none were valid jobs:", rawItems);
      }
      // --- END FILTERING LOGIC ---


      console.log(`Fetched ${validJobs.length} valid new jobs for page ${pageNum}.`); // Use validJobs count

      // Check rawItems length to determine if the API itself has more pages
      if (rawItems.length === 0) {
        console.log(`No more raw items found (page ${pageNum}). Setting hasMore to false.`);
        setHasMore(false);
      }

      // Use the FILTERED array (validJobs) for the state update
      setJobs(prevJobs => (pageNum === 1 ? validJobs : [...prevJobs, ...validJobs]));
      setPage(pageNum); // Update the current page number state

      return true; // Indicate success

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(err.message || 'Failed to fetch jobs');
      // Don't necessarily set hasMore to false on error, allow retry
      return false; // Return failure indicator

    } finally {
      console.log(`FETCH FINISH: page=${pageNum}, initial=${initialLoad}. Updating loading states.`);
      // Always ensure loading states are reset
      if (initialLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
    // Note: Dependencies must include external variables used inside useCallback
  }, [isLoading, isLoadingMore, hasMore]); // Keep dependencies minimal but correct

  const loadMoreJobs = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      console.log(`Initiating load more jobs... Current page: ${page}, Fetching page: ${page + 1}`);
      fetchJobs(page + 1, false);
    } else {
      console.log('Load more blocked:', { isLoading, isLoadingMore, hasMore });
    }
  }, [isLoading, isLoadingMore, hasMore, page, fetchJobs]);

  // Public refresh function exposed by the hook
  const refreshJobs = useCallback(async () => {
    console.log('Initiating refresh jobs...');
    // We pass initialLoad=true to fetchJobs, which handles resetting state
    return await fetchJobs(1, true); // Return the promise from fetchJobs
  }, [fetchJobs]);


  return {
    jobs,
    isLoading, // True only during initial load/refresh
    isLoadingMore, // True only when loading next page
    error,
    hasMore,
    loadMoreJobs,
    refreshJobs,
    // fetchJobs, // Expose if needed directly (usually not)
  };
};

export default useFetchJobs;