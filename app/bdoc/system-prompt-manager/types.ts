// Define the types for our system prompt manager

export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  content: string;
  category: SystemPromptCategory;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  deployedVersion: string | null;
}

export interface SystemPromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  changes: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  isDeployed: boolean;
}

export interface SystemPromptDeployment {
  id: string;
  promptId: string;
  versionId: string;
  deployedAt: string;
  deployedBy: string;
  deployedByName: string;
  environment: "development" | "testing" | "production";
  status: "scheduled" | "in-progress" | "completed" | "failed";
  scheduledFor: string | null;
  completedAt: string | null;
}

export type SystemPromptCategory =
  | "general"
  | "claims"
  | "medical"
  | "legal"
  | "administrative"
  | "custom";

export interface PreviewSettings {
  userContext: string;
  userMessage: string;
}

export interface PreviewResponse {
  id: string;
  message: string;
  createdAt: string;
}

// Mock data interfaces for development
export interface MockDataState {
  prompts: SystemPrompt[];
  versions: SystemPromptVersion[];
  deployments: SystemPromptDeployment[];
}
