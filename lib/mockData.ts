/**
 * Mock data for the Condition Logger feature
 * This file contains mock data for development purposes only.
 */

/**
 * Mock logs for various conditions
 */
export const mockLogs = [
  {
    id: "1",
    condition: "Headaches",
    data: {
      date: "2023-10-01",
      severity: 7,
      duration: "4 hours",
      notes: "Triggered by bright light and stress"
    },
    timestamp: "2023-10-01T10:00:00Z"
  },
  {
    id: "2",
    condition: "Headaches",
    data: {
      date: "2023-10-03",
      severity: 5,
      duration: "2 hours",
      notes: "Mild headache after work"
    },
    timestamp: "2023-10-03T18:30:00Z"
  },
  {
    id: "3",
    condition: "Back Pain",
    data: {
      date: "2023-10-02",
      severity: 6,
      location: "Lower back",
      notes: "Pain increased after standing for long periods"
    },
    timestamp: "2023-10-02T14:15:00Z"
  },
  {
    id: "4",
    condition: "Back Pain",
    data: {
      date: "2023-10-05",
      severity: 8,
      location: "Lower back",
      notes: "Severe pain, difficulty walking"
    },
    timestamp: "2023-10-05T08:45:00Z"
  },
  {
    id: "5",
    condition: "Tinnitus",
    data: {
      date: "2023-10-04",
      severity: 4,
      duration: "All day",
      notes: "Constant ringing, more noticeable in quiet environments"
    },
    timestamp: "2023-10-04T21:00:00Z"
  }
];

/**
 * Mock user session data
 */
export const mockUserSession = {
  userId: "user-123",
  name: "John Veteran",
  email: "john.veteran@example.com",
  preferences: {
    defaultCondition: "Headaches",
    notificationsEnabled: true
  }
};
