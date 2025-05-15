/**
 * Conditions data for the Condition Logger feature
 * This file contains definitions for various medical conditions that can be logged.
 */

export interface ConditionField {
  name: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  label: string;
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  min?: number; // For number fields
  max?: number; // For number fields
}

export interface Condition {
  name: string;
  icon: string;
  description: string;
  fields: ConditionField[];
  flareUpThreshold?: Record<string, number>;
  moodTracking?: boolean;
  lifestyleTracking?: boolean;
}

/**
 * List of conditions that can be logged
 */
export const conditions: Condition[] = [
  {
    name: "Headaches",
    icon: "Headphones",
    description: "Track frequency, severity, and triggers of headaches",
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
        placeholder: "e.g., 2 hours"
      },
      {
        name: "type",
        type: "select",
        label: "Headache Type",
        required: false,
        options: ["Tension", "Migraine", "Cluster", "Sinus", "Other"]
      },
      {
        name: "mood",
        type: "select",
        label: "Mood",
        required: false,
        options: ["Happy", "Neutral", "Anxious", "Sad", "Irritable", "Depressed"]
      },
      {
        name: "sleepHours",
        type: "number",
        label: "Hours of Sleep",
        required: false,
        min: 0,
        max: 24
      },
      {
        name: "stressLevel",
        type: "select",
        label: "Stress Level",
        required: false,
        options: ["None", "Low", "Moderate", "High", "Extreme"]
      },
      {
        name: "notes",
        type: "textarea",
        label: "Notes",
        required: false,
        placeholder: "Describe your symptoms and triggers"
      }
    ],
    flareUpThreshold: { severity: 7 },
    moodTracking: true,
    lifestyleTracking: true
  },
  {
    name: "Back Pain",
    icon: "Spine",
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
    name: "Tinnitus",
    icon: "Ear",
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
    name: "PTSD Symptoms",
    icon: "Brain",
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
    name: "Joint Pain",
    icon: "Bone",
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
