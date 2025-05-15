export interface Community {
  id: string;
  name: string;
  description: string;
  members: User[];
  imageUrl?: string;
  bannerUrl?: string;
  createdAt: Date;
  tags?: string[];
  rules?: string[];
}

export interface Post {
  id: string;
  communityId: string;
  title: string;
  content: string | object;
  author: User;
  userId: string;
  username: string;
  createdAt: Date;
  updatedAt?: Date;
  voteStatus: number;
  imageUrl?: string;
  commentCount: number;
  tags?: string[];
  likes?: number;
  comments?: Comment[];
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
  author?: User;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  imageUrl?: string;
  avatarUrl?: string;
  joinedCommunities?: string[];
  bio?: string;
  role?: string;
  joinedAt?: Date;
}

export interface Vote {
  id: string;
  postId?: string;
  commentId?: string;
  userId: string;
  value: number;
}

export type CommunityVisibility = "public" | "restricted" | "private";
