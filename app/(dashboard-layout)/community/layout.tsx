"use client";

import { ReactNode, useEffect, useState } from "react";
import { RecoilRootCompat } from "@/app/community/lib/recoil-compat";

interface CommunityLayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  // Track client-side hydration with proper typing
  const [mounted, setMounted] = useState<boolean>(false);

  // Set mounted state after hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a loading state until hydration completes
  if (!mounted) {
    return (
      <div role="status" aria-label="Loading community">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <div className="text-lg font-medium">Loading community...</div>
        </div>
      </div>
    );
  }

  // Once mounted (client-side), render with RecoilRootCompat
  return <RecoilRootCompat>{children}</RecoilRootCompat>;
}
