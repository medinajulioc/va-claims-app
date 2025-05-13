"use client";

import useUserStore from "@/store/useUserStore";

export default function WelcomeMessage() {
  // Get the first name directly from our user store
  const { firstName } = useUserStore();

  if (!firstName) {
    return <span>VA Claims Research Assistant</span>;
  }

  return <span>Welcome, {firstName}. We are glad you are here.</span>;
}
