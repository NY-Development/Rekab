import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { router } from './routes';
import { Toaster } from 'sonner';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" theme="dark" closeButton richColors />
    </QueryClientProvider>
  );
}

export default App;
