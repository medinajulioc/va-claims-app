"use client";

import { useState, useEffect } from "react";
import { usePosts, useCommunities, useCurrentUser } from "../lib/mock-data-adapter";
import PostList from "./shared/PostList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklesIcon } from "lucide-react";

interface ForYouFeedProps {
  className?: string;
}

export function ForYouFeed({ className = "" }: ForYouFeedProps) {
  const [activeTab, setActiveTab] = useState<"recommended" | "communities" | "topics">(
    "recommended"
  );
  const { data: posts } = usePosts();
  const { data: communities } = useCommunities();
  const { user } = useCurrentUser();

  // Get user's joined communities
  const userCommunityIds = user?.joinedCommunities || [];

  // Get user's interests (could be from profile or based on behavior)
  // For this mock, we'll just use some hardcoded interests
  const userInterests = ["PTSD", "Disability Claims", "VA Benefits", "Mental Health"];

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (activeTab === "communities") {
      // Posts from joined communities
      return posts.filter((post) => userCommunityIds.includes(post.communityId));
    } else if (activeTab === "topics") {
      // Posts related to user interests
      return posts.filter(
        (post) =>
          post.tags &&
          post.tags.some((tag) =>
            userInterests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))
          )
      );
    } else {
      // Recommended posts - a mix of popular posts, posts from joined communities, and interest-based posts
      // For this mock, we'll use a scoring system

      // First, score each post
      const scoredPosts = posts.map((post) => {
        let score = 0;

        // Popular posts get higher score
        score += post.voteStatus * 0.5;

        // Posts from joined communities get higher score
        if (userCommunityIds.includes(post.communityId)) {
          score += 10;
        }

        // Posts matching user interests get higher score
        if (post.tags) {
          post.tags.forEach((tag) => {
            if (
              userInterests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))
            ) {
              score += 5;
            }
          });
        }

        // Recent posts get higher score
        const postDate = new Date(post.createdAt).getTime();
        const now = Date.now();
        const daysDiff = (now - postDate) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 10 - daysDiff); // Newer posts get up to 10 extra points

        return { ...post, score };
      });

      // Sort by score and return top posts
      return scoredPosts.sort((a, b) => b.score - a.score).map(({ score, ...post }) => post);
    }
  };

  return (
    <div className={className}>
      <Card className="mb-4 overflow-hidden border shadow-sm">
        <div className="bg-card border-b p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <SparklesIcon className="text-primary h-5 w-5" />
            For You
          </h2>
          <p className="text-muted-foreground text-sm">
            Personalized content based on your communities and interests
          </p>
        </div>

        <div className="p-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended" className="text-sm">
                Recommended
              </TabsTrigger>
              <TabsTrigger value="communities" className="text-sm">
                My Communities
              </TabsTrigger>
              <TabsTrigger value="topics" className="text-sm">
                My Topics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <PostList limit={5} customPosts={getFilteredPosts()} />
    </div>
  );
}

export default ForYouFeed;
