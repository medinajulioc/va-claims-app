import React from "react";
import { Category, Tag } from "@/types/file-manager";
import {
  FileText,
  Stethoscope,
  Medal,
  BookOpen,
  Mail,
  FileSignature,
  FileCheck,
  Award,
  FileWarning,
  Clock,
  FileCog,
  FileQuestion,
  Folder,
  LucideIcon
} from "lucide-react";

/**
 * Predefined VA claim-related document categories
 */
export const predefinedCategories: Category[] = [
  {
    id: "medical-records",
    name: "Medical Records",
    description: "Healthcare documentation, treatment records, and medical evaluations",
    icon: "Stethoscope",
    color: "#ef4444" // red
  },
  {
    id: "service-records",
    name: "Service Records",
    description: "Military service documentation, DD214, and service history",
    icon: "Medal",
    color: "#3b82f6" // blue
  },
  {
    id: "va-forms",
    name: "VA Forms",
    description: "Official VA forms and applications for benefits",
    icon: "FileText",
    color: "#10b981" // green
  },
  {
    id: "correspondence",
    name: "Correspondence",
    description: "Letters and communications with VA and other agencies",
    icon: "Mail",
    color: "#8b5cf6" // purple
  },
  {
    id: "evidence-documents",
    name: "Evidence Documents",
    description: "Supporting evidence for claims, including buddy statements",
    icon: "FileCheck",
    color: "#f59e0b" // amber
  },
  {
    id: "appeals-documents",
    name: "Appeals Documents",
    description: "Appeals, hearings, and Board of Veterans' Appeals materials",
    icon: "FileWarning",
    color: "#ec4899" // pink
  },
  {
    id: "claim-status",
    name: "Claim Status",
    description: "Documents related to claim status and updates",
    icon: "Clock",
    color: "#6366f1" // indigo
  },
  {
    id: "other-documents",
    name: "Other Documents",
    description: "Miscellaneous documents that don't fit other categories",
    icon: "FileQuestion",
    color: "#64748b" // slate
  }
];

/**
 * Predefined tags for VA claim documents
 */
export const predefinedTags: Tag[] = [
  {
    id: "urgent",
    name: "Urgent",
    color: "#ef4444", // red
    count: 0
  },
  {
    id: "important",
    name: "Important",
    color: "#f59e0b", // amber
    count: 0
  },
  {
    id: "submitted",
    name: "Submitted",
    color: "#10b981", // green
    count: 0
  },
  {
    id: "pending",
    name: "Pending",
    color: "#3b82f6", // blue
    count: 0
  },
  {
    id: "approved",
    name: "Approved",
    color: "#10b981", // green
    count: 0
  },
  {
    id: "denied",
    name: "Denied",
    color: "#ef4444", // red
    count: 0
  },
  {
    id: "needs-review",
    name: "Needs Review",
    color: "#8b5cf6", // purple
    count: 0
  }
];

/**
 * Get a category by ID
 * @param id The category ID
 * @returns The category object or undefined if not found
 */
export const getCategoryById = (id: string): Category | undefined => {
  return predefinedCategories.find((category) => category.id === id);
};

/**
 * Get a tag by ID
 * @param id The tag ID
 * @returns The tag object or undefined if not found
 */
export const getTagById = (id: string): Tag | undefined => {
  return predefinedTags.find((tag) => tag.id === id);
};

/**
 * Get a Lucide icon component by name
 * @param iconName The name of the icon
 * @returns The icon component type or Folder as fallback
 */
export const getCategoryIcon = (iconName: string): React.ComponentType => {
  const iconMap: Record<string, React.ComponentType> = {
    FileText,
    Stethoscope,
    Medal,
    BookOpen,
    Mail,
    FileSignature,
    FileCheck,
    Award,
    FileWarning,
    Clock,
    FileCog,
    FileQuestion,
    Folder
  };

  return iconMap[iconName] || Folder;
};
