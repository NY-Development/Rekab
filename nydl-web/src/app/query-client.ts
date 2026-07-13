import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

/**
 * Production-ready QueryClient configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Avoid unnecessary bandwidth/server load
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Only retry once on failure to prevent resource exhaustion
      retry: 1,
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Ensure mutations don't trigger automatic retries unless specified
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling: e.g., trigger a toast notification or 
      // handle 401 Unauthorized errors globally
      if (error instanceof Error) {
        console.error(`Query failed: ${query.queryKey}`, error.message);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Global mutation error handling
      console.error(`Mutation failed: ${mutation.options.mutationKey}`, error);
    },
  }),
});