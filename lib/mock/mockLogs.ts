/**
 * Mock logs for the Condition Logger feature
 * This file provides sample log entries for demonstration purposes
 */

import { v4 as uuidv4 } from "uuid";

// Helper function to create a date string for a specific number of days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Sample log data
export const mockLogs = [
  // Headache logs
  {
    id: uuidv4(),
    condition: "Headaches",
    timestamp: daysAgo(1),
    data: {
      date: daysAgo(1).split("T")[0],
      time: "08:30",
      severity: 7,
      duration: 6,
      prostrating: "Yes",
      painLocation: "Both temples",
      symptoms: ["Light Sensitivity", "Sound Sensitivity", "Nausea"],
      medications: "Sumatriptan 50mg",
      medEffectiveness: "3 - Moderately effective",
      triggers: ["Stress from Service", "Lack of Sleep"],
      impact: "Severe limitation",
      sleepQuality: "2 - Poor",
      weather: "Cloudy, pressure change",
      notes: "Had to lie down in dark room for several hours. Missed work meeting."
    }
  },
  {
    id: uuidv4(),
    condition: "Headaches",
    timestamp: daysAgo(5),
    data: {
      date: daysAgo(5).split("T")[0],
      time: "14:15",
      severity: 9,
      duration: 10,
      prostrating: "Yes",
      painLocation: "Behind eyes",
      symptoms: ["Aura", "Nausea", "Vomiting", "Light Sensitivity", "Sound Sensitivity"],
      medications: "Sumatriptan 100mg, Zofran 4mg",
      medEffectiveness: "2 - Slightly effective",
      triggers: ["Bright Lights", "Weather Changes"],
      impact: "Complete inability to function",
      sleepQuality: "3 - Fair",
      weather: "Stormy, low pressure",
      notes: "One of the worst migraines in months. Complete bed rest required all day."
    }
  },
  {
    id: uuidv4(),
    condition: "Headaches",
    timestamp: daysAgo(12),
    data: {
      date: daysAgo(12).split("T")[0],
      time: "10:00",
      severity: 4,
      duration: 3,
      prostrating: "No",
      painLocation: "Forehead",
      symptoms: ["Light Sensitivity"],
      medications: "Ibuprofen 400mg",
      medEffectiveness: "4 - Very effective",
      triggers: ["Lack of Sleep"],
      impact: "Mild limitation",
      sleepQuality: "3 - Fair",
      weather: "Clear, normal pressure",
      notes: "Mild headache that responded well to medication."
    }
  },

  // Back Pain logs
  {
    id: uuidv4(),
    condition: "Back Pain",
    timestamp: daysAgo(2),
    data: {
      date: daysAgo(2).split("T")[0],
      severity: 8,
      location: "Lower back",
      activity: "Lifting",
      notes: "Severe pain after lifting groceries. Could barely stand straight for hours."
    }
  },
  {
    id: uuidv4(),
    condition: "Back Pain",
    timestamp: daysAgo(7),
    data: {
      date: daysAgo(7).split("T")[0],
      severity: 5,
      location: "Middle back",
      activity: "Sitting",
      notes: "Moderate pain after sitting at desk all day for work."
    }
  },

  // Tinnitus logs
  {
    id: uuidv4(),
    condition: "Tinnitus",
    timestamp: daysAgo(1),
    data: {
      date: daysAgo(1).split("T")[0],
      severity: 7,
      sound: "Ringing",
      duration: "All day",
      notes: "Constant loud ringing making it difficult to concentrate at work."
    }
  },
  {
    id: uuidv4(),
    condition: "Tinnitus",
    timestamp: daysAgo(4),
    data: {
      date: daysAgo(4).split("T")[0],
      severity: 6,
      sound: "Buzzing",
      duration: "Several hours",
      notes: "Persistent buzzing sound in both ears after exposure to loud environment."
    }
  },

  // PTSD Symptoms logs
  {
    id: uuidv4(),
    condition: "PTSD Symptoms",
    timestamp: daysAgo(3),
    data: {
      date: daysAgo(3).split("T")[0],
      severity: 8,
      symptoms: "Flashbacks",
      triggers: "Loud noises",
      notes:
        "Severe flashbacks triggered by fireworks in the neighborhood. Lasted about 30 minutes."
    }
  },
  {
    id: uuidv4(),
    condition: "PTSD Symptoms",
    timestamp: daysAgo(10),
    data: {
      date: daysAgo(10).split("T")[0],
      severity: 6,
      symptoms: "Nightmares",
      triggers: "Anniversary date",
      notes: "Woke up in cold sweat after combat-related nightmare. Difficulty returning to sleep."
    }
  },

  // Joint Pain logs
  {
    id: uuidv4(),
    condition: "Joint Pain",
    timestamp: daysAgo(2),
    data: {
      date: daysAgo(2).split("T")[0],
      severity: 7,
      location: "Knee",
      symptoms: "Pain",
      notes: "Sharp pain in right knee when climbing stairs. Had to use handrail for support."
    }
  },
  {
    id: uuidv4(),
    condition: "Joint Pain",
    timestamp: daysAgo(8),
    data: {
      date: daysAgo(8).split("T")[0],
      severity: 5,
      location: "Shoulder",
      symptoms: "Stiffness",
      notes: "Limited range of motion in left shoulder. Difficulty reaching overhead."
    }
  }
];
