import { atom, selector } from "recoil";
import { Community, Post, Comment, User, Vote } from "./types";
import { v4 as uuidv4 } from "uuid";

// Mock data for communities
export const communitiesState = atom<Community[]>({
  key: "communitiesState",
  default: [
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
  ]
});

// Mock data for posts
export const postsState = atom<Post[]>({
  key: "postsState",
  default: [
    {
      id: "1",
      communityId: "1",
      title: "Welcome to the General Discussion Community",
      content:
        "This is a place to discuss anything related to VA benefits and services. Please be respectful of others and follow community guidelines.",
      userId: "u1",
      username: "admin",
      createdAt: new Date("2023-01-16"),
      voteStatus: 24,
      commentCount: 5,
      tags: ["welcome", "rules"]
    },
    {
      id: "2",
      communityId: "1",
      title: "Tips for New Members",
      content:
        "Here are some helpful tips for navigating VA benefits and using this forum effectively...",
      userId: "u1",
      username: "admin",
      createdAt: new Date("2023-01-18"),
      voteStatus: 18,
      commentCount: 3,
      tags: ["tips", "guide"]
    },
    {
      id: "3",
      communityId: "2",
      title: "Understanding VA Disability Ratings",
      content:
        "A comprehensive guide to how the VA determines disability ratings and what each percentage means...",
      userId: "u2",
      username: "claims_expert",
      createdAt: new Date("2023-02-22"),
      voteStatus: 45,
      commentCount: 12,
      tags: ["ratings", "guide"]
    },
    {
      id: "4",
      communityId: "2",
      title: "My Experience with the Appeals Process",
      content:
        "I wanted to share my recent experience going through the VA appeals process after an initial denial...",
      userId: "u3",
      username: "veteran_2020",
      createdAt: new Date("2023-03-15"),
      voteStatus: 32,
      commentCount: 8,
      tags: ["appeals", "experience"]
    },
    {
      id: "5",
      communityId: "3",
      title: "How to Access VA Healthcare Services",
      content:
        "A step-by-step guide on enrolling in VA healthcare and accessing services at your local VA medical center...",
      userId: "u4",
      username: "healthcare_advisor",
      createdAt: new Date("2023-03-18"),
      voteStatus: 28,
      commentCount: 6,
      tags: ["healthcare", "guide"]
    }
  ]
});

// Mock data for comments
export const commentsState = atom<Comment[]>({
  key: "commentsState",
  default: [
    {
      id: "c1",
      postId: "1",
      userId: "u2",
      username: "claims_expert",
      content: "Thanks for creating this community! Looking forward to the discussions.",
      createdAt: new Date("2023-01-16T10:30:00"),
      voteStatus: 5
    },
    {
      id: "c2",
      postId: "1",
      userId: "u3",
      username: "veteran_2020",
      content: "Glad to be here. This will be a valuable resource.",
      createdAt: new Date("2023-01-16T11:45:00"),
      voteStatus: 3
    },
    {
      id: "c3",
      postId: "3",
      userId: "u4",
      username: "healthcare_advisor",
      content:
        "This is really helpful information. I'd add that veterans should also keep detailed records of all medical conditions.",
      createdAt: new Date("2023-02-23T09:15:00"),
      voteStatus: 8
    },
    {
      id: "c4",
      postId: "3",
      userId: "u5",
      username: "new_veteran",
      content:
        "As someone new to the VA system, this explanation really helped me understand the process better.",
      createdAt: new Date("2023-02-24T14:20:00"),
      voteStatus: 6
    }
  ]
});

// Mock data for current user
export const currentUserState = atom<User | null>({
  key: "currentUserState",
  default: {
    id: "u1",
    username: "admin",
    email: "admin@example.com",
    imageUrl: "/images/avatars/admin.png",
    joinedCommunities: ["1", "2", "3", "4", "5"]
  }
});

// Mock data for votes
export const votesState = atom<Vote[]>({
  key: "votesState",
  default: []
});

// Selectors for data operations
export const getPostsByCommunityId = selector({
  key: "getPostsByCommunityId",
  get:
    ({ get }) =>
    (communityId: string) => {
      const posts = get(postsState);
      return posts.filter((post) => post.communityId === communityId);
    }
});

export const getCommentsByPostId = selector({
  key: "getCommentsByPostId",
  get:
    ({ get }) =>
    (postId: string) => {
      const comments = get(commentsState);
      return comments.filter((comment) => comment.postId === postId);
    }
});

export const getCommunityById = selector({
  key: "getCommunityById",
  get:
    ({ get }) =>
    (communityId: string) => {
      const communities = get(communitiesState);
      return communities.find((community) => community.id === communityId);
    }
});

export const getPostById = selector({
  key: "getPostById",
  get:
    ({ get }) =>
    (postId: string) => {
      const posts = get(postsState);
      return posts.find((post) => post.id === postId);
    }
});

// Helper functions for manipulating state
export const addCommunityAtom = selector({
  key: "addCommunityAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (community: Omit<Community, "id" | "createdAt" | "members">) => {};
  },
  set: ({ set, get }, newCommunity: any) => {
    const currentCommunities = get(communitiesState);
    const newCommunityWithId = {
      ...newCommunity,
      id: uuidv4(),
      createdAt: new Date(),
      members: 1 // Creator is the first member
    };
    set(communitiesState, [...currentCommunities, newCommunityWithId]);
  }
});

export const addPostAtom = selector({
  key: "addPostAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (post: Omit<Post, "id" | "createdAt" | "voteStatus" | "commentCount">) => {};
  },
  set: ({ set, get }, newPost: any) => {
    const currentPosts = get(postsState);
    const user = get(currentUserState);
    const newPostWithId = {
      ...newPost,
      id: uuidv4(),
      createdAt: new Date(),
      voteStatus: 0,
      commentCount: 0,
      username: user?.username || "anonymous"
    };
    set(postsState, [...currentPosts, newPostWithId]);
  }
});

export const addCommentAtom = selector({
  key: "addCommentAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (comment: Omit<Comment, "id" | "createdAt" | "voteStatus">) => {};
  },
  set: ({ set, get }, newComment: any) => {
    const currentComments = get(commentsState);
    const currentPosts = get(postsState);
    const user = get(currentUserState);

    const newCommentWithId = {
      ...newComment,
      id: uuidv4(),
      createdAt: new Date(),
      voteStatus: 0,
      username: user?.username || "anonymous"
    };

    // Update comment count on the post
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === newComment.postId) {
        return {
          ...post,
          commentCount: post.commentCount + 1
        };
      }
      return post;
    });

    set(commentsState, [...currentComments, newCommentWithId]);
    set(postsState, updatedPosts);
  }
});

export const voteOnPostAtom = selector({
  key: "voteOnPostAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (postId: string, value: number) => {};
  },
  set: ({ set, get }, voteData: any) => {
    const { postId, value } = voteData;
    const currentPosts = get(postsState);
    const currentVotes = get(votesState);
    const user = get(currentUserState);

    if (!user) return; // Must be logged in to vote

    // Check if user already voted on this post
    const existingVote = currentVotes.find(
      (vote) => vote.postId === postId && vote.userId === user.id
    );

    let voteChange = value;

    // If already voted, remove old vote value
    if (existingVote) {
      voteChange = value - existingVote.value;

      // Update existing vote
      const updatedVotes = currentVotes.map((vote) => {
        if (vote.postId === postId && vote.userId === user.id) {
          return { ...vote, value };
        }
        return vote;
      });

      set(votesState, updatedVotes);
    } else {
      // Add new vote
      const newVote = {
        id: uuidv4(),
        postId,
        userId: user.id,
        value
      };

      set(votesState, [...currentVotes, newVote]);
    }

    // Update post vote status
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          voteStatus: post.voteStatus + voteChange
        };
      }
      return post;
    });

    set(postsState, updatedPosts);
  }
});

export const voteOnCommentAtom = selector({
  key: "voteOnCommentAtom",
  get: ({ get }) => {
    // This is just a getter, implementation is in the set
    return (commentId: string, value: number) => {};
  },
  set: ({ set, get }, voteData: any) => {
    const { commentId, value } = voteData;
    const currentComments = get(commentsState);
    const currentVotes = get(votesState);
    const user = get(currentUserState);

    if (!user) return; // Must be logged in to vote

    // Check if user already voted on this comment
    const existingVote = currentVotes.find(
      (vote) => vote.commentId === commentId && vote.userId === user.id
    );

    let voteChange = value;

    // If already voted, remove old vote value
    if (existingVote) {
      voteChange = value - existingVote.value;

      // Update existing vote
      const updatedVotes = currentVotes.map((vote) => {
        if (vote.commentId === commentId && vote.userId === user.id) {
          return { ...vote, value };
        }
        return vote;
      });

      set(votesState, updatedVotes);
    } else {
      // Add new vote
      const newVote = {
        id: uuidv4(),
        commentId,
        userId: user.id,
        value
      };

      set(votesState, [...currentVotes, newVote]);
    }

    // Update comment vote status
    const updatedComments = currentComments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          voteStatus: comment.voteStatus + voteChange
        };
      }
      return comment;
    });

    set(commentsState, updatedComments);
  }
});
