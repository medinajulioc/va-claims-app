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
      time: "08:30",
      severity: 7,
      duration: 4,
      prostrating: "Yes",
      painLocation: "Left temple",
      symptoms: ["Nausea", "Light Sensitivity", "Vision Changes"],
      medications: "Sumatriptan 50mg, Ibuprofen 800mg",
      medEffectiveness: "3 - Moderately effective",
      triggers: ["Bright Lights", "Stress from Service"],
      impact: "Severe limitation",
      sleepQuality: "2 - Poor",
      weather: "Sunny, 75°F, High pressure",
      notes: "Had to lie down in a dark room for several hours. Missed afternoon appointments."
    },
    timestamp: "2023-10-01T10:00:00Z"
  },
  {
    id: "2",
    condition: "Headaches",
    data: {
      date: "2023-10-03",
      time: "16:45",
      severity: 5,
      duration: 2,
      prostrating: "No",
      painLocation: "Forehead",
      symptoms: ["Light Sensitivity"],
      medications: "Ibuprofen 400mg",
      medEffectiveness: "4 - Very effective",
      triggers: ["Lack of Sleep"],
      impact: "Moderate limitation",
      sleepQuality: "3 - Fair",
      weather: "Cloudy, 65°F",
      notes: "Able to continue working but with reduced productivity"
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
  },
  {
    id: "6",
    condition: "Headaches",
    data: {
      date: "2023-10-10",
      time: "14:15",
      severity: 9,
      duration: 8,
      prostrating: "Yes",
      painLocation: "Behind eyes",
      symptoms: ["Aura", "Nausea", "Vomiting", "Light Sensitivity", "Sound Sensitivity"],
      medications: "Sumatriptan 100mg, Zofran 4mg",
      medEffectiveness: "2 - Slightly effective",
      triggers: ["Weather Changes", "Loud Noises"],
      impact: "Complete inability to function",
      sleepQuality: "1 - Very poor",
      weather: "Stormy, Barometric pressure drop",
      notes:
        "One of the worst migraines in months. Completely debilitating. Had to stay in bed all day in dark room."
    },
    timestamp: "2023-10-10T15:00:00Z"
  },
  {
    id: "7",
    condition: "Headaches",
    data: {
      date: "2023-10-15",
      time: "09:30",
      severity: 3,
      duration: 1.5,
      prostrating: "No",
      painLocation: "Right temple",
      symptoms: ["Light Sensitivity"],
      medications: "Tylenol 500mg",
      medEffectiveness: "4 - Very effective",
      triggers: ["Diet"],
      impact: "Mild limitation",
      sleepQuality: "4 - Good",
      weather: "Clear, 70°F",
      notes: "Mild headache after drinking coffee. Resolved quickly with medication."
    },
    timestamp: "2023-10-15T10:00:00Z"
  },
  {
    id: "8",
    condition: "Headaches",
    data: {
      date: "2023-10-22",
      time: "23:15",
      severity: 6,
      duration: 6,
      prostrating: "Yes",
      painLocation: "Both temples",
      symptoms: ["Nausea", "Light Sensitivity", "Sound Sensitivity"],
      medications: "Excedrin Migraine, Naproxen 500mg",
      medEffectiveness: "3 - Moderately effective",
      triggers: ["Stress from Service", "Lack of Sleep"],
      impact: "Severe limitation",
      sleepQuality: "2 - Poor",
      weather: "Humid, 80°F",
      notes:
        "Woke up with headache in the middle of the night. Had to take sick leave the next day."
    },
    timestamp: "2023-10-22T23:30:00Z"
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
