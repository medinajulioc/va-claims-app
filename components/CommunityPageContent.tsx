"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommunityPageContent() {
  const router = useRouter();

  // Redirect to the new implementation
  useEffect(() => {
    router.replace("/community");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex h-60 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
}
