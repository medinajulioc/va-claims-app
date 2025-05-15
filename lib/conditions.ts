/**
 * Conditions data for the Condition Logger feature
 * This file contains definitions for various medical conditions that can be logged.
 */

export interface ConditionField {
  name: string;
  type: "text" | "number" | "date" | "time" | "select" | "textarea" | "checkbox";
  label: string;
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  min?: number; // For number fields
  max?: number; // For number fields
  tooltip?: string; // Tooltip for field explanation
}

export interface Condition {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  fields: ConditionField[];
  flareUpThreshold?: Record<string, number>;
  moodTracking?: boolean;
  lifestyleTracking?: boolean;
  cfrLink?: string; // Link to Code of Federal Regulations
  dbqLink?: string; // Link to Disability Benefits Questionnaire
  ratings?: Array<{ percentage: string; criteria: string }>; // VA disability ratings
}

/**
 * List of conditions that can be logged
 */
export const conditions: Condition[] = [
  {
    id: "headaches",
    name: "Headaches",
    icon: "Brain",
    color: "#E53935",
    description:
      "Track frequency, severity, and triggers of migraines and headaches for VA disability claims",
    cfrLink:
      "https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-B/subject-group-ECFRab3ca55f4548afe/section-4.124a",
    dbqLink: "https://www.benefits.va.gov/compensation/docs/Headaches.pdf",
    ratings: [
      { percentage: "0%", criteria: "With less frequent attacks" },
      { percentage: "10%", criteria: "Prostrating attacks averaging one in 2 months" },
      { percentage: "30%", criteria: "Prostrating attacks averaging once a month" },
      {
        percentage: "50%",
        criteria: "Very frequent completely prostrating attacks with severe economic inadaptability"
      }
    ],
    fields: [
      {
        name: "date",
        type: "date",
        label: "Date",
        required: true,
        tooltip:
          "Record the exact date of your headache or migraine. Consistent date logging helps establish the frequency pattern required for VA ratings (e.g., once per month for 30% rating)."
      },
      {
        name: "time",
        type: "time",
        label: "Time of Onset",
        required: false,
        tooltip:
          "Log when your headache or migraine began. This helps identify potential triggers related to your daily schedule and documents the full duration of your condition."
      },
      {
        name: "duration",
        type: "number",
        label: "Duration (hours)",
        required: true,
        min: 0,
        max: 72,
        tooltip:
          "Record how long your headache lasted in hours. Longer durations, especially for prostrating attacks, support higher VA disability ratings. The VA considers both frequency and duration when evaluating economic inadaptability."
      },
      {
        name: "severity",
        type: "number",
        label: "Severity (1-10)",
        required: true,
        min: 1,
        max: 10,
        tooltip:
          "Rate your pain from 1 (mild) to 10 (severe/unbearable). Higher ratings (7+) help document severe headaches that may qualify as 'prostrating' for VA purposes. Consistent severe ratings support claims for higher disability percentages."
      },
      {
        name: "prostrating",
        type: "select",
        label: "Prostrating?",
        required: true,
        options: ["Yes", "No"],
        tooltip:
          "A 'prostrating' headache means it's severe enough to require you to lie down, stop all activity, and/or seek a dark, quiet environment. This is CRITICAL for VA ratings: 10% requires prostrating attacks every 2 months, 30% requires monthly prostrating attacks, and 50% requires very frequent completely prostrating attacks with severe economic inadaptability."
      },
      {
        name: "painLocation",
        type: "select",
        label: "Pain Location",
        required: false,
        options: [
          "Left temple",
          "Right temple",
          "Both temples",
          "Behind eyes",
          "Forehead",
          "Back of head",
          "Entire head",
          "Other"
        ],
        tooltip:
          "Specify where your headache pain is located. While not directly tied to VA ratings, consistent pain locations help establish a pattern for your specific type of headache condition and strengthen the medical evidence for your claim."
      },
      {
        name: "symptoms",
        type: "checkbox",
        label: "Symptoms",
        required: false,
        options: [
          "Aura",
          "Nausea",
          "Vomiting",
          "Light Sensitivity",
          "Sound Sensitivity",
          "Vision Changes",
          "Sensory Changes",
          "Dizziness"
        ],
        tooltip:
          "Select all symptoms you experienced with this headache. Associated symptoms like nausea, vomiting, and sensory sensitivities help document the severity of your condition and support claims that your headaches are 'prostrating' in nature, which is required for VA compensation."
      },
      {
        name: "medications",
        type: "text",
        label: "Medications Taken",
        required: false,
        placeholder: "e.g., Sumatriptan 50mg, Ibuprofen 800mg",
        tooltip:
          "List all medications taken for this headache, including dosages. Prescription medications, especially those specifically for migraines, help establish the medical necessity and severity of your condition. The VA considers treatment methods when evaluating your claim."
      },
      {
        name: "medEffectiveness",
        type: "select",
        label: "Medication Effectiveness",
        required: false,
        options: [
          "1 - Not effective",
          "2 - Slightly effective",
          "3 - Moderately effective",
          "4 - Very effective",
          "5 - Completely effective"
        ],
        tooltip:
          "Rate how well your medication worked. Poor medication response (ratings 1-2) supports claims of severe, difficult-to-treat headaches that may qualify for higher VA ratings due to their impact on daily functioning and economic adaptability."
      },
      {
        name: "triggers",
        type: "checkbox",
        label: "Triggers",
        required: false,
        options: [
          "Loud Noises",
          "Flashbacks",
          "Stress from Service",
          "Bright Lights",
          "Lack of Sleep",
          "Diet",
          "Weather Changes",
          "Physical Activity",
          "Other"
        ],
        tooltip:
          "Identify what may have triggered your headache. Service-related triggers (loud noises, flashbacks, stress from service) are especially important as they help establish a connection between your military service and your headache condition, which is essential for service connection."
      },
      {
        name: "impact",
        type: "select",
        label: "Impact on Activities",
        required: false,
        options: [
          "None",
          "Mild limitation",
          "Moderate limitation",
          "Severe limitation",
          "Complete inability to function"
        ],
        tooltip:
          "Document how the headache affected your ability to function. 'Severe limitation' or 'Complete inability to function' supports the VA's criteria for prostrating attacks, while consistent severe impacts help establish 'economic inadaptability' required for the 50% rating."
      },
      {
        name: "sleepQuality",
        type: "select",
        label: "Sleep Quality Before Onset",
        required: false,
        options: ["1 - Very poor", "2 - Poor", "3 - Fair", "4 - Good", "5 - Very good"],
        tooltip:
          "Rate your sleep quality before the headache. Poor sleep is a common trigger and may connect your headaches to other service-connected conditions like PTSD or sleep disorders, which can help establish secondary service connection."
      },
      {
        name: "weather",
        type: "text",
        label: "Weather Conditions",
        required: false,
        placeholder: "e.g., Sunny, 75°F, Pressure change",
        tooltip:
          "Note weather conditions that may have contributed to your headache. While not directly tied to VA ratings, this helps establish patterns and triggers, providing more comprehensive evidence for your claim."
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms, triggers, and impact in detail",
        tooltip:
          "Document any additional details about this headache episode, especially how it affected your work, daily activities, or required assistance from others. Include specific examples of activities you couldn't perform, which helps establish both the 'prostrating' nature and 'economic inadaptability' criteria the VA uses for higher ratings."
      }
    ],
    flareUpThreshold: { severity: 7 },
    moodTracking: true,
    lifestyleTracking: true
  },
  {
    id: "back-pain",
    name: "Back Pain",
    icon: "Activity",
    color: "#43A047",
    description: "Track location, severity, and triggers of back pain",
    fields: [
      { name: "date", type: "date", label: "Date", required: true },
      {
        name: "severity",
        type: "number",
        label: "Severity (1-10)",
        required: true,
        min: 1,
        max: 10
      },
      {
        name: "location",
        type: "select",
        label: "Pain Location",
        required: false,
        options: ["Upper back", "Middle back", "Lower back", "Entire back"]
      },
      {
        name: "activity",
        type: "select",
        label: "Activity When Pain Started",
        required: false,
        options: ["Sitting", "Standing", "Walking", "Lifting", "Bending", "Sleeping", "Other"]
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms and triggers"
      }
    ],
    flareUpThreshold: { severity: 8 }
  },
  {
    id: "tinnitus",
    name: "Tinnitus",
    icon: "Ear",
    color: "#1E88E5",
    description: "Track ringing or buzzing in the ears",
    fields: [
      { name: "date", type: "date", label: "Date", required: true },
      {
        name: "severity",
        type: "number",
        label: "Severity (1-10)",
        required: true,
        min: 1,
        max: 10
      },
      {
        name: "duration",
        type: "text",
        label: "Duration",
        required: false,
        placeholder: "e.g., All day, 3 hours"
      },
      {
        name: "sound",
        type: "select",
        label: "Sound Type",
        required: false,
        options: ["Ringing", "Buzzing", "Hissing", "Clicking", "Roaring", "Other"]
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms and triggers"
      }
    ],
    flareUpThreshold: { severity: 6 }
  },
  {
    id: "ptsd-symptoms",
    name: "PTSD Symptoms",
    icon: "AlertCircle",
    color: "#8E24AA",
    description: "Track post-traumatic stress disorder symptoms",
    fields: [
      { name: "date", type: "date", label: "Date", required: true },
      {
        name: "severity",
        type: "number",
        label: "Severity (1-10)",
        required: true,
        min: 1,
        max: 10
      },
      {
        name: "symptoms",
        type: "select",
        label: "Primary Symptom",
        required: false,
        options: ["Flashbacks", "Nightmares", "Anxiety", "Avoidance", "Hypervigilance", "Other"]
      },
      {
        name: "triggers",
        type: "text",
        label: "Triggers",
        required: false,
        placeholder: "What triggered these symptoms?"
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms in detail"
      }
    ],
    flareUpThreshold: { severity: 7 }
  },
  {
    id: "joint-pain",
    name: "Joint Pain",
    icon: "Bone",
    color: "#FB8C00",
    description: "Track joint pain and mobility issues",
    fields: [
      { name: "date", type: "date", label: "Date", required: true },
      {
        name: "severity",
        type: "number",
        label: "Severity (1-10)",
        required: true,
        min: 1,
        max: 10
      },
      {
        name: "location",
        type: "select",
        label: "Joint Location",
        required: false,
        options: ["Knee", "Ankle", "Hip", "Shoulder", "Elbow", "Wrist", "Fingers", "Multiple"]
      },
      {
        name: "symptoms",
        type: "select",
        label: "Symptoms",
        required: false,
        options: [
          "Pain",
          "Stiffness",
          "Swelling",
          "Limited mobility",
          "Warmth",
          "Redness",
          "Multiple"
        ]
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms and limitations"
      }
    ],
    flareUpThreshold: { severity: 7 }
  }
];
