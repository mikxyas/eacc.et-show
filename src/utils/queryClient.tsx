// queryClient.js
"use client";
import { useState } from 'react';
import { HydrationBoundary, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from './globalClientQuery';




const ReactQueryPvorider: React.FC<PropsWithChildren> = ({ children }) => {
  // State

  // Return Provider
  return (
    <QueryClientProvider client={queryClient}>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      {children}
      {/* </HydrationBoundary> */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default ReactQueryPvorider;