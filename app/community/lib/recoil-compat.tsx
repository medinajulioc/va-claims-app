"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RecoilRoot } from "recoil";
import type { Community, Post, Comment, User } from "./types";

// Define the application state structure with proper TypeScript types
interface AppState {
  communities: Community[];
  posts: Post[];
  comments: Comment[];
  currentUser: User | null;
  [key: string]: unknown;
}

// Type for the context
interface StateContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

// Default mock data with proper typing
const defaultState: AppState = {
  communities: [
    {
      id: "1",
      name: "General Discussion",
      description: "A place for general discussions about VA claims and benefits.",
      members: 1250,
      createdAt: new Date("2023-01-15"),
      imageUrl: "/images/community/general.png",
      tags: ["general", "discussion", "benefits"]
    },
    {
      id: "2",
      name: "Disability Claims",
      description: "Discuss VA disability claims, ratings, and appeals.",
      members: 876,
      createdAt: new Date("2023-02-20"),
      imageUrl: "/images/community/disability.png",
      tags: ["disability", "claims", "ratings"]
    },
    {
      id: "3",
      name: "Healthcare Benefits",
      description: "Information about VA healthcare services and eligibility.",
      members: 654,
      createdAt: new Date("2023-03-10"),
      imageUrl: "/images/community/healthcare.png",
      tags: ["healthcare", "benefits", "services"]
    },
    {
      id: "4",
      name: "Education & GI Bill",
      description: "Resources and discussions about educational benefits.",
      members: 432,
      createdAt: new Date("2023-04-05"),
      imageUrl: "/images/community/education.png",
      tags: ["education", "gi bill", "benefits"]
    },
    {
      id: "5",
      name: "Mental Health Support",
      description: "Support and resources for veterans dealing with mental health issues.",
      members: 789,
      createdAt: new Date("2023-05-12"),
      imageUrl: "/images/community/mental-health.png",
      tags: ["mental health", "support", "resources"]
    }
  ],
  posts: [
    {
      id: "1",
      communityId: "1",
      title: "Welcome to the VA Claims Community",
      content:
        "Welcome to our community dedicated to helping veterans navigate their VA benefits and claims process. This is a safe space to ask questions, share experiences, and support one another through the claims journey.",
      userId: "u1",
      username: "admin",
      createdAt: new Date("2023-01-16"),
      voteStatus: 42,
      commentCount: 12,
      imageUrl: "/images/community/welcome-banner.jpg",
      tags: ["welcome", "rules", "introduction"]
    },
    {
      id: "2",
      communityId: "2",
      title: "How I Got My PTSD Rating Increased from 30% to 70%",
      content:
        "After years of struggling with my initial 30% PTSD rating, I finally got it increased to 70%. I wanted to share my experience and the documentation that made the difference.",
      userId: "u3",
      username: "veteran_2020",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      voteStatus: 89,
      commentCount: 24,
      imageUrl: "/images/community/rating-document.jpg",
      tags: ["success story", "ptsd", "rating increase", "dbq"]
    },
    {
      id: "3",
      communityId: "3",
      title: "Free Mental Health Resources Every Veteran Should Know About",
      content:
        "Beyond the VA's standard mental health services, there are several free resources that have helped me tremendously.",
      userId: "u5",
      username: "wellness_advocate",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
      voteStatus: 156,
      commentCount: 31,
      imageUrl: "/images/community/mental-health-resources.jpg",
      tags: ["mental health", "resources", "therapy", "support"]
    }
  ],
  comments: [],
  currentUser: null
};

// Create the context with non-null assertion for better type safety
const StateContext = createContext<StateContextType | null>(null);

// Type-safe hook for accessing context
function useStateContext(): StateContextType {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a RecoilRootCompat provider");
  }
  return context;
}

// Map of Recoil keys to state properties with type safety
const keyToStateMap: Record<string, keyof AppState> = {
  communitiesState: "communities",
  postsState: "posts",
  commentsState: "comments",
  currentUserState: "currentUser"
};

// RecoilRoot compatibility wrapper with proper types
export function RecoilRootCompat({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [isClient, setIsClient] = useState(false);

  // Use useEffect with empty dependency array for one-time client detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <StateContext.Provider value={{ state, setState }}>
      {isClient ? <RecoilRoot>{children}</RecoilRoot> : <>{children}</>}
    </StateContext.Provider>
  );
}

// Type-safe hook for getting values from Recoil or fallback
export function useRecoilValueCompat<T>(recoilValue: { key: string }): T {
  const context = useStateContext();
  const [value, setValue] = useState<T | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the appropriate fallback value based on the key
  useEffect(() => {
    const stateKey = keyToStateMap[recoilValue.key] || (recoilValue.key as keyof AppState);
    setValue(context.state[stateKey] as unknown as T);
  }, [context, recoilValue.key]);

  // For SSR or during hydration, return the fallback
  if (!isClient) {
    const stateKey = keyToStateMap[recoilValue.key] || (recoilValue.key as keyof AppState);
    return defaultState[stateKey] as unknown as T;
  }

  // Return the value we've stored
  return value as T;
}

// Type-safe hook for setting values in Recoil or fallback
export function useSetRecoilStateCompat<T>(recoilValue: { key: string }) {
  const context = useStateContext();
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a setter function with proper typing
  return (newValue: T | ((prevValue: T) => T)) => {
    const stateKey = keyToStateMap[recoilValue.key] || (recoilValue.key as keyof AppState);

    context.setState((prev) => {
      const prevValue = prev[stateKey] as unknown as T;
      const updatedValue =
        typeof newValue === "function" ? (newValue as (prevValue: T) => T)(prevValue) : newValue;

      return {
        ...prev,
        [stateKey]: updatedValue
      };
    });
  };
}
