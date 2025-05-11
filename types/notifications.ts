export enum NotificationType {
  CLAIM_UPDATE = "claim_update",
  DOCUMENT = "document",
  APPOINTMENT = "appointment",
  MESSAGE = "message",
  SYSTEM = "system",
  DEADLINE = "deadline"
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export enum Status {
  READ = "read",
  UNREAD = "unread",
  ARCHIVED = "archived"
}

export interface Action {
  type: string; // Type of action (confirm, decline, view, etc.)
  label: string; // Button label
  url?: string; // Optional URL to navigate to
  apiEndpoint?: string; // Optional API endpoint to call
  metadata?: Record<string, any>; // Additional data for the action
}

export interface Notification {
  id: string; // Unique identifier
  recipientId: string; // User ID of recipient
  title: string; // Short notification title
  message: string; // Detailed notification message
  type: NotificationType; // Type of notification
  priority: Priority; // Priority level
  status: Status; // Status (read, unread, archived)
  createdAt: Date; // When the notification was created
  expiresAt?: Date; // Optional expiration date
  actions?: Action[]; // Optional actions user can take
  metadata?: Record<string, any>; // Additional data specific to notification type
  relatedEntityId?: string; // ID of related entity (claim ID, document ID, etc.)
  relatedEntityType?: string; // Type of related entity (claim, document, etc.)
  sender?: {
    // Information about the sender
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

// For backward compatibility with existing components
export interface LegacyNotification {
  id: number;
  title: string;
  role?: string;
  desc: string;
  avatar: string;
  status?: string;
  unread_message?: boolean;
  type: string;
  date: string;
}
