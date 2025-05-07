/**
 * Common type definitions for the VA Claims App
 */

// User profile type
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'moderator';
}

// VA Claim type
export interface Claim {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'denied' | 'in-review';
  createdAt: string;
  updatedAt: string;
  documents: ClaimDocument[];
}

// Document attached to a claim
export interface ClaimDocument {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
} 