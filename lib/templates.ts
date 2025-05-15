/**
 * Templates for the Condition Logger feature
 * This file contains pre-filled templates for quick logging of common symptoms.
 */

/**
 * Get the current date in YYYY-MM-DD format
 */
const getCurrentDate = () => new Date().toISOString().split("T")[0];

/**
 * Get the current time in HH:MM format
 */
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

/**
 * Templates for quick logging of common symptoms
 */
export const templates = {
  Headaches: {
    mild: {
      date: getCurrentDate(),
      time: getCurrentTime(),
      severity: 3,
      duration: 2,
      prostrating: "No",
      painLocation: "Forehead",
      symptoms: ["Light Sensitivity"],
      medications: "Tylenol 500mg",
      medEffectiveness: "4 - Very effective",
      triggers: ["Diet"],
      impact: "Mild limitation",
      sleepQuality: "4 - Good",
      weather: "Normal conditions",
      notes: "Mild headache with minimal impact on daily activities"
    },
    moderate: {
      date: getCurrentDate(),
      time: getCurrentTime(),
      severity: 5,
      duration: 4,
      prostrating: "No",
      painLocation: "Both temples",
      symptoms: ["Light Sensitivity", "Sound Sensitivity"],
      medications: "Ibuprofen 600mg",
      medEffectiveness: "3 - Moderately effective",
      triggers: ["Lack of Sleep", "Stress from Service"],
      impact: "Moderate limitation",
      sleepQuality: "3 - Fair",
      weather: "Normal conditions",
      notes: "Moderate headache affecting concentration and productivity"
    },
    severe: {
      date: getCurrentDate(),
      time: getCurrentTime(),
      severity: 8,
      duration: 8,
      prostrating: "Yes",
      painLocation: "Behind eyes",
      symptoms: ["Aura", "Nausea", "Light Sensitivity", "Sound Sensitivity", "Vision Changes"],
      medications: "Sumatriptan 100mg",
      medEffectiveness: "3 - Moderately effective",
      triggers: ["Bright Lights", "Weather Changes", "Lack of Sleep"],
      impact: "Severe limitation",
      sleepQuality: "2 - Poor",
      weather: "Weather change, pressure drop",
      notes: "Severe migraine requiring rest in dark room, unable to perform normal activities"
    },
    prostrating: {
      date: getCurrentDate(),
      time: getCurrentTime(),
      severity: 9,
      duration: 12,
      prostrating: "Yes",
      painLocation: "Entire head",
      symptoms: [
        "Aura",
        "Nausea",
        "Vomiting",
        "Light Sensitivity",
        "Sound Sensitivity",
        "Sensory Changes",
        "Dizziness"
      ],
      medications: "Sumatriptan 100mg, Zofran 4mg",
      medEffectiveness: "2 - Slightly effective",
      triggers: ["Loud Noises", "Flashbacks", "Stress from Service"],
      impact: "Complete inability to function",
      sleepQuality: "1 - Very poor",
      weather: "Stormy, pressure change",
      notes:
        "Completely prostrating migraine. Unable to function at all. Required bed rest in dark room for entire day."
    }
  },

  "Back Pain": {
    mild: {
      severity: 3,
      date: getCurrentDate(),
      location: "Lower back",
      activity: "Sitting",
      notes: "Mild discomfort after prolonged sitting"
    },
    moderate: {
      severity: 6,
      date: getCurrentDate(),
      location: "Lower back",
      activity: "Bending",
      notes: "Moderate pain when bending or lifting"
    },
    severe: {
      severity: 9,
      date: getCurrentDate(),
      location: "Lower back",
      activity: "Other",
      notes: "Severe pain limiting mobility and requiring rest"
    }
  },

  Tinnitus: {
    mild: {
      severity: 2,
      date: getCurrentDate(),
      sound: "Ringing",
      duration: "Intermittent",
      notes: "Barely noticeable ringing in quiet environments"
    },
    moderate: {
      severity: 5,
      date: getCurrentDate(),
      sound: "Buzzing",
      duration: "Several hours",
      notes: "Noticeable buzzing affecting concentration"
    },
    severe: {
      severity: 8,
      date: getCurrentDate(),
      sound: "Ringing",
      duration: "All day",
      notes: "Constant loud ringing interfering with daily activities and sleep"
    }
  },

  "PTSD Symptoms": {
    mild: {
      severity: 3,
      date: getCurrentDate(),
      symptoms: "Anxiety",
      triggers: "Stress at work",
      notes: "Mild anxiety and unease"
    },
    moderate: {
      severity: 6,
      date: getCurrentDate(),
      symptoms: "Flashbacks",
      triggers: "Loud noises",
      notes: "Moderate flashbacks triggered by environmental factors"
    },
    severe: {
      severity: 9,
      date: getCurrentDate(),
      symptoms: "Nightmares",
      triggers: "Anniversary date",
      notes: "Severe nightmares and sleep disturbance"
    }
  },

  "Joint Pain": {
    mild: {
      severity: 3,
      date: getCurrentDate(),
      location: "Knee",
      symptoms: "Stiffness",
      notes: "Mild stiffness in the morning"
    },
    moderate: {
      severity: 5,
      date: getCurrentDate(),
      location: "Knee",
      symptoms: "Pain",
      notes: "Moderate pain when climbing stairs"
    },
    severe: {
      severity: 8,
      date: getCurrentDate(),
      location: "Knee",
      symptoms: "Multiple",
      notes: "Severe pain, swelling, and limited mobility"
    }
  }
};
