import { QueryClient } from "@tanstack/react-query";

const queryClientOptions = {
    defaultOptions: {
        // 5 * 1000
        queries: {
            staleTime: 60000,
        },
    },
};

// State
const queryClient = new QueryClient(queryClientOptions)

export default queryClient;