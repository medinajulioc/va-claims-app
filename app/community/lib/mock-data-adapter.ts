"use client";

import { useRecoilValueCompat, useSetRecoilStateCompat } from "./recoil-compat";
import { postsState, communitiesState, currentUserState, commentsState } from "./recoilAtoms";
import type { Post, Community, User, Comment } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

// MOCK DATA ADAPTERS
// These hooks provide a consistent interface that can be replaced with real API calls later
// without changing the components that use them

/**
 * Hook to access all posts with mock data
 */
export function usePosts(communityId?: string) {
  // MOCK: Using Recoil for mock data
  const posts = useRecoilValueCompat<Post[]>(postsState);

  // Filter posts by communityId if provided
  const filteredPosts = communityId
    ? posts.filter((post) => post.communityId === communityId)
    : posts;

  // Ensure every post has an author field
  const postsWithAuthors = filteredPosts.map((post) => {
    if (!post.author) {
      // Create a mock author from userId/username
      const mockAuthor: User = {
        id: post.userId,
        username: post.username,
        name: post.username, // Use username as name if not available
        email: `${post.username}@example.com`
      };

      return { ...post, author: mockAuthor };
    }
    return post;
  });

  return {
    data: postsWithAuthors || [],
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const { data, isLoading, error } = useQuery(['posts', communityId], () => fetchPosts(communityId));
  // return { data: data || [], isLoading, error };
}

/**
 * Hook to access a single community with mock data
 */
export function useCommunity(communityId: string) {
  // MOCK: Using Recoil for mock data
  const communities = useRecoilValueCompat<Community[]>(communitiesState);
  const users = useRecoilValueCompat<User | null>(currentUserState);

  // Find the community by id
  const community = communities.find((c) => c.id === communityId);

  // If community is found, ensure it has appropriate members
  let enhancedCommunity = community;
  if (community) {
    // If members is a number, convert it to an array of mock users
    if (typeof community.members === "number") {
      const mockMembers: User[] = Array.from(
        { length: community.members as unknown as number },
        (_, i) => ({
          id: `user-${i + 1}`,
          username: `user${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          avatarUrl: i % 3 === 0 ? `/avatars/0${(i % 5) + 1}.png` : undefined,
          role: i === 0 ? "moderator" : undefined,
          joinedAt: new Date(Date.now() - Math.random() * 10000000000)
        })
      );

      enhancedCommunity = {
        ...community,
        members: mockMembers
      };
    }
  }

  return {
    data: enhancedCommunity || null,
    isLoading: false,
    error: community ? null : "Community not found"
  };

  // FUTURE IMPLEMENTATION:
  // const { data, isLoading, error } = useQuery(['community', communityId], () => fetchCommunity(communityId));
  // return { data: data || null, isLoading, error };
}

/**
 * Hook to access all communities with mock data
 */
export function useCommunities() {
  // MOCK: Using Recoil for mock data
  const communities = useRecoilValueCompat<Community[]>(communitiesState);

  return {
    data: communities || [],
    isLoading: false,
    error: null
  };
}

/**
 * Hook to access the current user with mock session
 */
export function useCurrentUser() {
  // MOCK: Using Recoil for mock user session
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);
  const setCurrentUser = useSetRecoilStateCompat(currentUserState);

  // In development mode, ensure we always have a mock user
  useEffect(() => {
    const isDevelopment =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (isDevelopment && (!currentUser || !currentUser.imageUrl)) {
      // Set a mock user for development with proper avatar path
      setCurrentUser({
        id: "mock-user-1",
        username: "DeveloperUser",
        name: "Developer User",
        email: "dev@example.com",
        imageUrl: `/avatars/01.png`,
        avatarUrl: `/avatars/01.png`,
        joinedCommunities: ["1", "2", "3", "4", "5"]
      });
    }
  }, [currentUser, setCurrentUser]);

  return {
    user: currentUser,
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const { data: session, status } = useSession();
  // return {
  //   user: session?.user || null,
  //   isLoading: status === 'loading',
  //   error: null
  // };
}

/**
 * Hook to access comments for a specific post
 */
export function useComments(postId?: string) {
  const allComments = useRecoilValueCompat<Comment[]>(commentsState);

  const filteredComments = postId
    ? allComments.filter((comment) => comment.postId === postId)
    : allComments;

  return {
    data: filteredComments,
    isLoading: false,
    error: null
  };
}

/**
 * Hook to create a new post with mock data
 */
export function useCreatePost() {
  const setPosts = useSetRecoilStateCompat(postsState);
  const posts = useRecoilValueCompat<Post[]>(postsState);
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);

  // MOCK: Function to create a post with mock data
  return {
    createPost: (
      newPost: Omit<
        Post,
        "id" | "createdAt" | "voteStatus" | "commentCount" | "userId" | "username" | "author"
      >
    ) => {
      if (!currentUser) throw new Error("User must be logged in to create a post");

      const post: Post = {
        ...newPost,
        id: `post-${uuidv4()}`,
        userId: currentUser.id,
        username: currentUser.username,
        author: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name || currentUser.username,
          email: currentUser.email,
          avatarUrl: currentUser.avatarUrl || currentUser.imageUrl
        },
        createdAt: new Date(),
        voteStatus: 0,
        commentCount: 0
      };

      setPosts([...posts, post]);
      return post;
    },
    isLoading: false,
    error: null
  };

  // FUTURE IMPLEMENTATION:
  // const mutation = useMutation(createPostAPI);
  // return {
  //   createPost: mutation.mutate,
  //   isLoading: mutation.isLoading,
  //   error: mutation.error
  // };
}

/**
 * Hook to create a new comment with mock data
 */
export function useCreateComment() {
  const setComments = useSetRecoilStateCompat(commentsState);
  const comments = useRecoilValueCompat<Comment[]>(commentsState);
  const currentUser = useRecoilValueCompat<User | null>(currentUserState);

  return {
    createComment: (postId: string, content: string) => {
      if (!currentUser) throw new Error("User must be logged in to comment");

      const newComment: Comment = {
        id: `comment-${uuidv4()}`,
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        content,
        createdAt: new Date(),
        voteStatus: 0,
        author: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name || currentUser.username,
          email: currentUser.email,
          avatarUrl: currentUser.avatarUrl || currentUser.imageUrl
        }
      };

      setComments([...comments, newComment]);
      return newComment;
    },
    isLoading: false,
    error: null
  };
}

/**
 * Hook to vote on a post with mock data
 */
export function useVotePost() {
  const setPosts = useSetRecoilStateCompat(postsState);
  const posts = useRecoilValueCompat<Post[]>(postsState);

  return {
    votePost: (postId: string, value: number) => {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            voteStatus: post.voteStatus + value
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    },
    isLoading: false,
    error: null
  };
}
