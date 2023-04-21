import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Link, Route, Routes } from 'react-router-dom';

const MoviesModule = lazy(() => import('./movies/movies-module'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export const AppModule = () => {
  return (
    <Suspense fallback="Loading resources...">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <Routes>
          <Route path="" element={<Link to="/movies">Movies</Link>} />
          <Route path="/movies/*" element={<MoviesModule />} />
        </Routes>
      </QueryClientProvider>
    </Suspense>
  );
};
