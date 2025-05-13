import {
  ApiUsageLog,
  ApiUsageSummary,
  ApiKey,
  ApiUsageByDate,
  ApiUsageByEndpoint,
  ApiServiceConfig
} from "./types";

import {
  generateMockApiUsageLogs,
  generateMockApiUsageSummary,
  generateMockApiUsageByDate,
  generateMockApiUsageByEndpoint,
  mockApiKeys,
  mockApiServiceConfigs
} from "./mock-api-usage";

/**
 * API Usage Service
 * In development, this uses mock data
 * In production, this would connect to a database
 */
class ApiUsageService {
  private useMock: boolean;
  private mockLogs: ApiUsageLog[];
  private mockSummary: ApiUsageSummary[];
  private mockApiKeys: ApiKey[];
  private mockServiceConfigs: ApiServiceConfig[];

  constructor() {
    // In development or when no database is configured, use mock data
    this.useMock = process.env.NODE_ENV === "development" || !process.env.DATABASE_URL;

    // Initialize mock data
    this.mockLogs = generateMockApiUsageLogs(100);
    this.mockSummary = generateMockApiUsageSummary();
    this.mockApiKeys = mockApiKeys;
    this.mockServiceConfigs = mockApiServiceConfigs;
  }

  /**
   * Log an API call
   */
  async logApiCall(data: Omit<ApiUsageLog, "id" | "timestamp">): Promise<void> {
    if (this.useMock) {
      // In mock mode, just add to the in-memory logs
      const newLog: ApiUsageLog = {
        ...data,
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date()
      };

      this.mockLogs.unshift(newLog);

      // Update the mock summary
      const serviceSummary = this.mockSummary.find((s) => s.service === data.service);
      if (serviceSummary) {
        serviceSummary.totalCalls += 1;
        if (data.success) {
          serviceSummary.successCalls += 1;
        } else {
          serviceSummary.failedCalls += 1;
        }
        serviceSummary.averageResponseTime =
          (serviceSummary.averageResponseTime * (serviceSummary.totalCalls - 1) +
            data.responseTimeMs) /
          serviceSummary.totalCalls;
        serviceSummary.lastUsed = new Date();
      }

      // Update the mock API key usage count
      const apiKey = this.mockApiKeys.find((k) => k.service === data.service);
      if (apiKey) {
        apiKey.usageCount += 1;
        apiKey.lastUsed = new Date();
      }

      return;
    }

    // In production, this would log to a database
    console.log("API call logged:", data);
  }

  /**
   * Get API usage logs
   */
  async getLogs(
    options: {
      service?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<ApiUsageLog[]> {
    const { service, limit = 50, offset = 0 } = options;

    if (this.useMock) {
      let logs = this.mockLogs;

      if (service) {
        logs = logs.filter((log) => log.service === service);
      }

      return logs.slice(offset, offset + limit);
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Get API usage summary
   */
  async getSummary(service?: string): Promise<ApiUsageSummary[]> {
    if (this.useMock) {
      if (service) {
        return this.mockSummary.filter((s) => s.service === service);
      }
      return this.mockSummary;
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Get API usage by date
   */
  async getUsageByDate(service: string, days: number = 30): Promise<ApiUsageByDate[]> {
    if (this.useMock) {
      return generateMockApiUsageByDate(service, days);
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Get API usage by endpoint
   */
  async getUsageByEndpoint(service: string): Promise<ApiUsageByEndpoint[]> {
    if (this.useMock) {
      return generateMockApiUsageByEndpoint(service);
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Get API keys
   */
  async getApiKeys(service?: string): Promise<ApiKey[]> {
    if (this.useMock) {
      if (service) {
        return this.mockApiKeys.filter((k) => k.service === service);
      }
      return this.mockApiKeys;
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Get API service configurations
   */
  async getServiceConfigs(service?: string): Promise<ApiServiceConfig[]> {
    if (this.useMock) {
      if (service) {
        return this.mockServiceConfigs.filter((c) => c.service === service);
      }
      return this.mockServiceConfigs;
    }

    // In production, this would query a database
    return [];
  }

  /**
   * Update API key
   */
  async updateApiKey(id: string, data: Partial<ApiKey>): Promise<ApiKey | null> {
    if (this.useMock) {
      const index = this.mockApiKeys.findIndex((k) => k.id === id);
      if (index === -1) return null;

      this.mockApiKeys[index] = {
        ...this.mockApiKeys[index],
        ...data
      };

      return this.mockApiKeys[index];
    }

    // In production, this would update a database
    return null;
  }

  /**
   * Update service configuration
   */
  async updateServiceConfig(
    id: string,
    data: Partial<ApiServiceConfig>
  ): Promise<ApiServiceConfig | null> {
    if (this.useMock) {
      const index = this.mockServiceConfigs.findIndex((c) => c.id === id);
      if (index === -1) return null;

      this.mockServiceConfigs[index] = {
        ...this.mockServiceConfigs[index],
        ...data
      };

      return this.mockServiceConfigs[index];
    }

    // In production, this would update a database
    return null;
  }
}

// Export a singleton instance
export const apiUsageService = new ApiUsageService();

// Re-export types
export * from "./types";
