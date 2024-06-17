// queryClient.js
"use client";
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { QueryClient } from '@tanstack/react-query';

const queryClientOptions = {
  defaultOptions: {
    // 5 * 1000
    queries: {
      staleTime: 60000,
    },
  },
};


const ReactQueryPvorider: React.FC<PropsWithChildren> = ({ children }) => {
  // State
  const [queryClientStore] = useState(
    () => new QueryClient(queryClientOptions)
  );
  // Return Provider
  return (
    <QueryClientProvider client={queryClientStore}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryPvorider;