"use client";

import { useEffect, useState } from "react";

export default function WelcomeMessage() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would come from an auth context or API call
    // For now, we're using mock data to match what's in the user-menu.tsx component
    const mockUserName = "Toby";
    setName(mockUserName);
  }, []);

  if (!name) {
    return <span>VA Claims Research Assistant</span>;
  }

  return <span>Welcome, {name}. We are glad you are here.</span>;
}
