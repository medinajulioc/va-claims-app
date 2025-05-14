"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { RecoilRootCompat } from "./recoil-compat";

// Define the context type
interface CommunityContextType {
  isDashboard: boolean;
  isLoading: boolean;
}

// Create a context with default values
const CommunityContext = createContext<CommunityContextType>({
  isDashboard: false,
  isLoading: true
});

// Export a hook to use the community context
export const useCommunityContext = () => useContext(CommunityContext);

interface CommunityProviderProps {
  children: ReactNode;
}

export function CommunityProvider({ children }: CommunityProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);

    // Check if we're in the dashboard route
    const path = window.location.pathname;
    setIsDashboard(path.includes("/dashboard/community"));
  }, []);

  // Return a loading state until hydration completes
  if (!mounted) {
    return (
      <div className="flex h-20 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Once mounted (client-side), render with RecoilRootCompat
  return (
    <RecoilRootCompat>
      <CommunityContext.Provider value={{ isDashboard, isLoading: !mounted }}>
        {children}
      </CommunityContext.Provider>
    </RecoilRootCompat>
  );
}
