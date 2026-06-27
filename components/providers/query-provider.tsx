"use client";

import { QueryClient , QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

/**
 * Provides a React Query client to the component tree.
 *
 * The `QueryClient` is created once via lazy `useState` initialization so it
 * survives re-renders but is unique per browser session.
 *
 * @param children - The subtree that needs access to React Query.
 */
export function QueryProvider({children}:{children:React.ReactNode}){
    const [queryClient] = useState(()=> new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}