/**
 * Types for API usage tracking
 */

export interface ApiUsageLog {
  id: string;
  service: string;
  endpoint: string;
  timestamp: Date;
  responseTimeMs: number;
  success: boolean;
  statusCode?: number;
  queryParams?: Record<string, string>;
  errorMessage?: string;
}

export interface ApiUsageSummary {
  service: string;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastUsed: Date;
}

export interface ApiKey {
  id: string;
  service: string;
  key: string;
  isActive: boolean;
  environment: "development" | "production";
  createdAt: Date;
  lastUsed?: Date;
  rateLimit?: number;
  usageCount: number;
}

export interface ApiUsageByDate {
  date: string;
  calls: number;
}

export interface ApiUsageByEndpoint {
  endpoint: string;
  calls: number;
  averageResponseTime: number;
}

export interface ApiServiceConfig {
  id: string;
  service: string;
  baseUrl: string;
  useMock: boolean;
  mockLatency?: number;
  rateLimit?: number;
  timeout?: number;
}
