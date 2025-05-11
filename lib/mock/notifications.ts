import { Action, Notification, NotificationType, Priority, Status } from "@/types/notifications";

// Helper function to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper function to create hours ago
const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

// Common actions
const viewClaimAction: Action = {
  type: "view",
  label: "View Claim",
  url: "/dashboard/claims/123"
};

const uploadDocumentAction: Action = {
  type: "upload",
  label: "Upload Document",
  url: "/dashboard/documents/upload"
};

const scheduleAppointmentAction: Action = {
  type: "schedule",
  label: "Schedule Appointment",
  url: "/dashboard/appointments/schedule"
};

const confirmAction: Action = {
  type: "confirm",
  label: "Confirm",
  apiEndpoint: "/api/notifications/confirm"
};

const declineAction: Action = {
  type: "decline",
  label: "Decline",
  apiEndpoint: "/api/notifications/decline"
};

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    recipientId: "user-123",
    title: "Claim Status Update",
    message:
      "Your disability claim (ID: 123-456-789) has been approved. You will receive payment details within 5-7 business days.",
    type: NotificationType.CLAIM_UPDATE,
    priority: Priority.HIGH,
    status: Status.UNREAD,
    createdAt: hoursAgo(2),
    actions: [viewClaimAction],
    relatedEntityId: "claim-123-456-789",
    relatedEntityType: "claim",
    sender: {
      id: "va-rep-001",
      name: "VA Claims Processing",
      avatar: "01.png",
      role: "Claims Processor"
    }
  },
  {
    id: "2",
    recipientId: "user-123",
    title: "Document Required",
    message:
      "Please submit your DD-214 form to complete your education benefits claim. This document is required within 30 days.",
    type: NotificationType.DOCUMENT,
    priority: Priority.URGENT,
    status: Status.UNREAD,
    createdAt: daysAgo(1),
    expiresAt: daysAgo(-30), // 30 days from now
    actions: [uploadDocumentAction],
    relatedEntityId: "claim-456-789-012",
    relatedEntityType: "document_request",
    sender: {
      id: "va-rep-002",
      name: "Document Processing",
      avatar: "02.png",
      role: "Document Specialist"
    }
  },
  {
    id: "3",
    recipientId: "user-123",
    title: "Appointment Confirmation",
    message:
      "Your C&P exam has been scheduled for June 15, 2024 at 10:00 AM at VA Medical Center - Building 2, Room 305.",
    type: NotificationType.APPOINTMENT,
    priority: Priority.MEDIUM,
    status: Status.READ,
    createdAt: daysAgo(3),
    expiresAt: new Date("2024-06-15T10:00:00"),
    actions: [confirmAction, declineAction],
    relatedEntityId: "appointment-789-012-345",
    relatedEntityType: "appointment",
    sender: {
      id: "va-rep-003",
      name: "Appointment Scheduling",
      avatar: "03.png",
      role: "Scheduling Coordinator"
    }
  },
  {
    id: "4",
    recipientId: "user-123",
    title: "Message from VA Representative",
    message:
      "I've reviewed your case and need additional information about your service history. Please call me at your earliest convenience.",
    type: NotificationType.MESSAGE,
    priority: Priority.MEDIUM,
    status: Status.UNREAD,
    createdAt: hoursAgo(5),
    sender: {
      id: "va-rep-004",
      name: "Sarah Johnson",
      avatar: "04.png",
      role: "Claims Representative"
    }
  },
  {
    id: "5",
    recipientId: "user-123",
    title: "System Maintenance",
    message:
      "The VA Claims system will be undergoing maintenance on Saturday, June 10 from 2:00 AM to 6:00 AM ET. Services will be unavailable during this time.",
    type: NotificationType.SYSTEM,
    priority: Priority.LOW,
    status: Status.READ,
    createdAt: daysAgo(5),
    expiresAt: new Date("2024-06-10T06:00:00"),
    sender: {
      id: "system",
      name: "System Administrator",
      avatar: "05.png",
      role: "System"
    }
  },
  {
    id: "6",
    recipientId: "user-123",
    title: "Deadline Reminder",
    message:
      "Your appeal submission deadline is approaching. You have 7 days left to submit your Notice of Disagreement.",
    type: NotificationType.DEADLINE,
    priority: Priority.HIGH,
    status: Status.UNREAD,
    createdAt: daysAgo(2),
    expiresAt: daysAgo(-7), // 7 days from now
    actions: [viewClaimAction],
    relatedEntityId: "appeal-012-345-678",
    relatedEntityType: "appeal",
    sender: {
      id: "va-rep-005",
      name: "Appeals Processing",
      avatar: "06.png",
      role: "Appeals Specialist"
    }
  },
  {
    id: "7",
    recipientId: "user-123",
    title: "New Educational Benefits",
    message:
      "You may be eligible for additional educational benefits under the new PACT Act. Click to learn more and apply.",
    type: NotificationType.SYSTEM,
    priority: Priority.MEDIUM,
    status: Status.READ,
    createdAt: daysAgo(7),
    actions: [
      {
        type: "learn_more",
        label: "Learn More",
        url: "/dashboard/benefits/education"
      }
    ],
    sender: {
      id: "va-rep-006",
      name: "Education Benefits",
      avatar: "07.png",
      role: "Benefits Coordinator"
    }
  },
  {
    id: "8",
    recipientId: "user-123",
    title: "Document Received",
    message: "We have received your DD-214 form. It is currently under review.",
    type: NotificationType.DOCUMENT,
    priority: Priority.LOW,
    status: Status.READ,
    createdAt: daysAgo(10),
    relatedEntityId: "document-345-678-901",
    relatedEntityType: "document",
    sender: {
      id: "va-rep-007",
      name: "Document Processing",
      avatar: "08.png",
      role: "Document Specialist"
    }
  },
  {
    id: "9",
    recipientId: "user-123",
    title: "Claim Status Update",
    message:
      "Your disability claim (ID: 234-567-890) has moved to Evidence Gathering, Review, and Decision phase.",
    type: NotificationType.CLAIM_UPDATE,
    priority: Priority.MEDIUM,
    status: Status.READ,
    createdAt: daysAgo(14),
    actions: [viewClaimAction],
    relatedEntityId: "claim-234-567-890",
    relatedEntityType: "claim",
    sender: {
      id: "va-rep-008",
      name: "VA Claims Processing",
      avatar: "09.png",
      role: "Claims Processor"
    }
  },
  {
    id: "10",
    recipientId: "user-123",
    title: "Health Care Enrollment",
    message:
      "Your application for VA health care benefits has been received. A representative will contact you within 10 business days.",
    type: NotificationType.SYSTEM,
    priority: Priority.MEDIUM,
    status: Status.READ,
    createdAt: daysAgo(21),
    relatedEntityId: "healthcare-456-789-012",
    relatedEntityType: "healthcare",
    sender: {
      id: "va-rep-009",
      name: "Health Care Enrollment",
      avatar: "10.png",
      role: "Enrollment Specialist"
    }
  }
];

// Helper function to get unread notifications count
export const getUnreadCount = (): number => {
  return mockNotifications.filter((notification) => notification.status === Status.UNREAD).length;
};

// Helper function to get notifications by status
export const getNotificationsByStatus = (status: Status): Notification[] => {
  return mockNotifications.filter((notification) => notification.status === status);
};

// Helper function to get notifications by type
export const getNotificationsByType = (type: NotificationType): Notification[] => {
  return mockNotifications.filter((notification) => notification.type === type);
};

// Helper function to mark a notification as read
export const markAsRead = (id: string): void => {
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.status = Status.READ;
  }
};

// Helper function to mark all notifications as read
export const markAllAsRead = (): void => {
  mockNotifications.forEach((notification) => {
    notification.status = Status.READ;
  });
};

// Helper function to archive a notification
export const archiveNotification = (id: string): void => {
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.status = Status.ARCHIVED;
  }
};
