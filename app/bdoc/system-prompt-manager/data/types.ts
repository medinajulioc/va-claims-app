export interface SystemPromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  timestamp: string;
  author: string;
  changeComment: string;
  isActive: boolean;
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  categoryId?: string;
  lastUpdated: string;
  versions: SystemPromptVersion[];
}

export interface SystemPromptCategory {
  id: string;
  name: string;
  color: string;
} 