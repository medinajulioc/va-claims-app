export interface FineTuningDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  dateAdded: string;
  category: string;
  contentPreview: string;
  selected: boolean;
}

export interface FineTuningJob {
  id: string;
  name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  baseModel: string;
  documentsCount: number;
  createdAt: string;
  completedAt: string | null;
  progress: number;
  metrics?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  error?: string;
}

export interface FineTunedModel {
  id: string;
  name: string;
  baseModel: string;
  version: string;
  createdAt: string;
  jobId: string;
  documentsCount: number;
  status: 'active' | 'inactive';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    latency: string;
  };
}

export interface ModelPerformance {
  modelId: string;
  modelName: string;
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  queryResponseTime: number;
}

// Mock data for fine-tuning documents
export const fineTuningDocuments: FineTuningDocument[] = [
  {
    id: 'doc-001',
    name: 'VA Form 21-526EZ Guidelines',
    type: 'PDF',
    size: '2.4 MB',
    dateAdded: '2023-06-15',
    category: 'Forms',
    contentPreview: 'Instructions for filing disability compensation claims...',
    selected: false
  },
  {
    id: 'doc-002',
    name: 'PTSD Rating Criteria',
    type: 'PDF',
    size: '1.8 MB',
    dateAdded: '2023-07-02',
    category: 'Conditions',
    contentPreview: 'Detailed criteria for PTSD disability ratings from 0% to 100%...',
    selected: false
  },
  {
    id: 'doc-003',
    name: 'Agent Orange Exposure Claims',
    type: 'DOCX',
    size: '950 KB',
    dateAdded: '2023-07-10',
    category: 'Procedures',
    contentPreview: 'Procedure for filing and evaluating Agent Orange exposure claims...',
    selected: false
  },
  {
    id: 'doc-004',
    name: 'VA Appeals Modernization',
    type: 'PDF',
    size: '3.2 MB',
    dateAdded: '2023-08-05',
    category: 'Appeals',
    contentPreview: 'New appeals process including supplemental claims, higher-level reviews...',
    selected: false
  },
  {
    id: 'doc-005',
    name: 'Musculoskeletal Rating Schedule',
    type: 'PDF',
    size: '4.1 MB',
    dateAdded: '2023-08-15',
    category: 'Conditions',
    contentPreview: 'Rating schedule for musculoskeletal conditions including range of motion...',
    selected: false
  },
  {
    id: 'doc-006',
    name: 'VA Disability Benefits Eligibility',
    type: 'PDF',
    size: '1.5 MB',
    dateAdded: '2023-09-01',
    category: 'Eligibility',
    contentPreview: 'Requirements for VA disability benefits eligibility including service connection...',
    selected: false
  },
  {
    id: 'doc-007',
    name: 'Blue Water Navy Vietnam Veterans',
    type: 'DOCX',
    size: '1.2 MB',
    dateAdded: '2023-09-10',
    category: 'Procedures',
    contentPreview: 'Guidelines for Blue Water Navy Vietnam Veterans Act claims processing...',
    selected: false
  },
  {
    id: 'doc-008',
    name: 'Mental Health Disability Evaluation',
    type: 'PDF',
    size: '2.8 MB',
    dateAdded: '2023-09-20',
    category: 'Conditions',
    contentPreview: 'Mental health evaluation criteria for VA disability claims...',
    selected: false
  }
];

// Mock data for fine-tuning jobs
export const fineTuningJobs: FineTuningJob[] = [
  {
    id: 'job-001',
    name: 'VA Claims Classification Model',
    status: 'completed',
    baseModel: 'xAI Grok',
    documentsCount: 24,
    createdAt: '2023-09-01T10:30:00Z',
    completedAt: '2023-09-01T14:45:00Z',
    progress: 100,
    metrics: {
      accuracy: 0.94,
      precision: 0.92,
      recall: 0.91,
      f1Score: 0.915
    }
  },
  {
    id: 'job-002',
    name: 'Disability Rating Predictor',
    status: 'in_progress',
    baseModel: 'OpenAI GPT-4',
    documentsCount: 18,
    createdAt: '2023-09-15T09:00:00Z',
    completedAt: null,
    progress: 65
  },
  {
    id: 'job-003',
    name: 'Appeals Decision Analyzer',
    status: 'queued',
    baseModel: 'xAI Grok',
    documentsCount: 12,
    createdAt: '2023-09-18T14:20:00Z',
    completedAt: null,
    progress: 0
  },
  {
    id: 'job-004',
    name: 'Service Connection Evaluator',
    status: 'failed',
    baseModel: 'Anthropic Claude',
    documentsCount: 10,
    createdAt: '2023-09-10T11:15:00Z',
    completedAt: '2023-09-10T12:30:00Z',
    progress: 45,
    error: 'Training interrupted due to insufficient document quality'
  }
];

// Mock data for fine-tuned models
export const fineTunedModels: FineTunedModel[] = [
  {
    id: 'model-001',
    name: 'VA Claims Classification Model v1.2',
    baseModel: 'xAI Grok',
    version: '1.2',
    createdAt: '2023-09-01T14:45:00Z',
    jobId: 'job-001',
    documentsCount: 24,
    status: 'active',
    metrics: {
      accuracy: 0.94,
      precision: 0.92,
      recall: 0.91,
      f1Score: 0.915,
      latency: '120ms'
    }
  },
  {
    id: 'model-002',
    name: 'VA Benefits Eligibility Checker v1.0',
    baseModel: 'OpenAI GPT-4',
    version: '1.0',
    createdAt: '2023-08-15T16:30:00Z',
    jobId: 'job-previous',
    documentsCount: 16,
    status: 'active',
    metrics: {
      accuracy: 0.89,
      precision: 0.87,
      recall: 0.88,
      f1Score: 0.875,
      latency: '150ms'
    }
  },
  {
    id: 'model-003',
    name: 'Medical Evidence Analyzer v0.9',
    baseModel: 'Anthropic Claude',
    version: '0.9',
    createdAt: '2023-08-01T10:15:00Z',
    jobId: 'job-older',
    documentsCount: 20,
    status: 'inactive',
    metrics: {
      accuracy: 0.83,
      precision: 0.81,
      recall: 0.79,
      f1Score: 0.80,
      latency: '135ms'
    }
  }
];

// Mock data for model performance over time
export const modelPerformanceData: ModelPerformance[] = [
  {
    modelId: 'model-001',
    modelName: 'VA Claims Classification Model v1.2',
    date: '2023-09-05',
    accuracy: 0.92,
    precision: 0.90,
    recall: 0.89,
    f1Score: 0.895,
    queryResponseTime: 132
  },
  {
    modelId: 'model-001',
    modelName: 'VA Claims Classification Model v1.2',
    date: '2023-09-10',
    accuracy: 0.93,
    precision: 0.91,
    recall: 0.90,
    f1Score: 0.905,
    queryResponseTime: 125
  },
  {
    modelId: 'model-001',
    modelName: 'VA Claims Classification Model v1.2',
    date: '2023-09-15',
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.91,
    f1Score: 0.915,
    queryResponseTime: 120
  },
  {
    modelId: 'model-002',
    modelName: 'VA Benefits Eligibility Checker v1.0',
    date: '2023-08-20',
    accuracy: 0.87,
    precision: 0.85,
    recall: 0.86,
    f1Score: 0.855,
    queryResponseTime: 155
  },
  {
    modelId: 'model-002',
    modelName: 'VA Benefits Eligibility Checker v1.0',
    date: '2023-08-25',
    accuracy: 0.88,
    precision: 0.86,
    recall: 0.87,
    f1Score: 0.865,
    queryResponseTime: 152
  },
  {
    modelId: 'model-002',
    modelName: 'VA Benefits Eligibility Checker v1.0',
    date: '2023-09-01',
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.88,
    f1Score: 0.875,
    queryResponseTime: 150
  }
];

export const documentCategories = [
  'All',
  'Forms',
  'Conditions',
  'Procedures',
  'Appeals',
  'Eligibility',
  'Medical'
];

export const modelTypes = [
  'xAI Grok',
  'OpenAI GPT-4',
  'Anthropic Claude',
  'Custom'
]; 