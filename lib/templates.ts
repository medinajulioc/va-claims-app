/**
 * Templates for the Condition Logger feature
 * This file contains pre-filled templates for quick logging of common symptoms.
 */

/**
 * Get the current date in YYYY-MM-DD format
 */
const getCurrentDate = () => new Date().toISOString().split("T")[0];

/**
 * Templates for quick logging of common symptoms
 */
export const templates = {
  Headaches: {
    mild: {
      severity: 3,
      date: getCurrentDate(),
      type: "Tension",
      duration: "1-2 hours",
      notes: "Mild headache with minimal impact on daily activities"
    },
    moderate: {
      severity: 5,
      date: getCurrentDate(),
      type: "Tension",
      duration: "2-4 hours",
      notes: "Moderate headache affecting concentration"
    },
    severe: {
      severity: 8,
      date: getCurrentDate(),
      type: "Migraine",
      duration: "4+ hours",
      notes: "Severe headache with sensitivity to light and sound"
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
