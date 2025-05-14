"use client";

import { useState } from "react";
import { Community } from "../lib/types";
import { currentUserState } from "../lib/recoilAtoms";
import { formatDate } from "../lib/utils";
import { useRecoilValueCompat } from "../lib/recoil-compat";

interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const [error, setError] = useState<string | null>(null);

  // Use our compatibility hook with proper error handling
  let currentUser = null;

  try {
    currentUser = useRecoilValueCompat(currentUserState);

    // Reset error state if successful
    if (error) setError(null);
  } catch (err) {
    console.error("Failed to load user data:", err);
    // We'll handle the empty state gracefully
  }

  const isJoined = currentUser?.joinedCommunities?.includes(community.id);

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
        {community.imageUrl && (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${community.imageUrl})` }}
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{community.name}</h1>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{community.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {community.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="mr-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>{community.members} members</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Created {formatDate(community.createdAt)}</span>
              </div>
            </div>
          </div>

          {currentUser && (
            <button
              className={`rounded-md px-6 py-2 font-medium ${
                isJoined
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}>
              {isJoined ? "Joined" : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
