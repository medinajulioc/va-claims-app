export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  imageUrl?: string;
  createdAt: Date;
  tags?: string[];
}

export interface Post {
  id: string;
  communityId: string;
  title: string;
  content: string;
  userId: string;
  username: string;
  createdAt: Date;
  updatedAt?: Date;
  voteStatus: number;
  imageUrl?: string;
  commentCount: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  voteStatus: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  imageUrl?: string;
  joinedCommunities?: string[];
}

export interface Vote {
  id: string;
  postId?: string;
  commentId?: string;
  userId: string;
  value: number; // 1 for upvote, -1 for downvote
}

export type CommunityVisibility = "public" | "restricted" | "private";
