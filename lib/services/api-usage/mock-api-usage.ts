import {
  ApiUsageLog,
  ApiUsageSummary,
  ApiKey,
  ApiUsageByDate,
  ApiUsageByEndpoint,
  ApiServiceConfig
} from "./types";

/**
 * Generate a random ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a date in the past n days
 */
function generatePastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

/**
 * Mock API keys
 */
export const mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    service: "eCFR",
    key: "mock-ecfr-api-key-xxxxx",
    isActive: true,
    environment: "development",
    createdAt: generatePastDate(30),
    lastUsed: generatePastDate(1),
    rateLimit: 100,
    usageCount: 78
  },
  {
    id: "key-2",
    service: "VA.gov",
    key: "mock-vagov-api-key-xxxxx",
    isActive: true,
    environment: "development",
    createdAt: generatePastDate(45),
    lastUsed: generatePastDate(2),
    rateLimit: 1000,
    usageCount: 523
  },
  {
    id: "key-3",
    service: "OpenAI",
    key: "mock-openai-api-key-xxxxx",
    isActive: true,
    environment: "development",
    createdAt: generatePastDate(60),
    lastUsed: generatePastDate(0),
    rateLimit: 3000,
    usageCount: 1245
  }
];

/**
 * Mock API service configurations
 */
export const mockApiServiceConfigs: ApiServiceConfig[] = [
  {
    id: "config-1",
    service: "eCFR",
    baseUrl: "https://www.ecfr.gov/developers/api/v1",
    useMock: true,
    mockLatency: 300,
    rateLimit: 100,
    timeout: 5000
  },
  {
    id: "config-2",
    service: "VA.gov",
    baseUrl: "https://api.va.gov/services/va_facilities/v0/facilities",
    useMock: true,
    mockLatency: 200,
    rateLimit: 1000,
    timeout: 10000
  },
  {
    id: "config-3",
    service: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    useMock: true,
    mockLatency: 500,
    rateLimit: 3000,
    timeout: 30000
  }
];

/**
 * Generate mock API usage logs
 */
export function generateMockApiUsageLogs(count: number = 100): ApiUsageLog[] {
  const logs: ApiUsageLog[] = [];
  const services = ["eCFR", "VA.gov", "OpenAI"];
  const endpoints = {
    eCFR: ["/search", "/regulation", "/citation"],
    "VA.gov": ["/facilities", "/claims", "/benefits"],
    OpenAI: ["/chat/completions", "/embeddings", "/fine-tuning"]
  };

  for (let i = 0; i < count; i++) {
    const service = services[Math.floor(Math.random() * services.length)];
    const serviceEndpoints = endpoints[service as keyof typeof endpoints];
    const endpoint = serviceEndpoints[Math.floor(Math.random() * serviceEndpoints.length)];
    const success = Math.random() > 0.1; // 90% success rate

    logs.push({
      id: generateId(),
      service,
      endpoint,
      timestamp: generatePastDate(Math.floor(Math.random() * 30)),
      responseTimeMs: Math.floor(Math.random() * 1000) + 100,
      success,
      statusCode: success ? 200 : 400 + Math.floor(Math.random() * 100),
      queryParams: service === "eCFR" ? { title: "38", query: "service connection" } : undefined,
      errorMessage: success ? undefined : "API rate limit exceeded"
    });
  }

  // Sort by timestamp, most recent first
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Generate mock API usage summary
 */
export function generateMockApiUsageSummary(): ApiUsageSummary[] {
  return [
    {
      service: "eCFR",
      totalCalls: 78,
      successCalls: 72,
      failedCalls: 6,
      averageResponseTime: 320,
      lastUsed: generatePastDate(1)
    },
    {
      service: "VA.gov",
      totalCalls: 523,
      successCalls: 498,
      failedCalls: 25,
      averageResponseTime: 215,
      lastUsed: generatePastDate(2)
    },
    {
      service: "OpenAI",
      totalCalls: 1245,
      successCalls: 1198,
      failedCalls: 47,
      averageResponseTime: 520,
      lastUsed: new Date()
    }
  ];
}

/**
 * Generate mock API usage by date
 */
export function generateMockApiUsageByDate(service: string, days: number = 30): ApiUsageByDate[] {
  const result: ApiUsageByDate[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Generate some realistic looking data with weekday patterns
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Base calls with some randomness
    let baseCalls = isWeekend ? 5 : 15;

    // Add service-specific patterns
    if (service === "eCFR") {
      baseCalls = isWeekend ? 2 : 8;
    } else if (service === "VA.gov") {
      baseCalls = isWeekend ? 10 : 25;
    } else if (service === "OpenAI") {
      baseCalls = isWeekend ? 20 : 50;
    }

    // Add randomness (±30%)
    const randomFactor = 0.7 + Math.random() * 0.6;
    const calls = Math.floor(baseCalls * randomFactor);

    result.push({
      date: dateStr,
      calls
    });
  }

  // Sort by date ascending
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generate mock API usage by endpoint
 */
export function generateMockApiUsageByEndpoint(service: string): ApiUsageByEndpoint[] {
  const endpoints: Record<string, { endpoint: string; weight: number }[]> = {
    eCFR: [
      { endpoint: "/search", weight: 0.6 },
      { endpoint: "/regulation", weight: 0.3 },
      { endpoint: "/citation", weight: 0.1 }
    ],
    "VA.gov": [
      { endpoint: "/facilities", weight: 0.4 },
      { endpoint: "/claims", weight: 0.5 },
      { endpoint: "/benefits", weight: 0.1 }
    ],
    OpenAI: [
      { endpoint: "/chat/completions", weight: 0.7 },
      { endpoint: "/embeddings", weight: 0.2 },
      { endpoint: "/fine-tuning", weight: 0.1 }
    ]
  };

  const serviceEndpoints = endpoints[service] || [];
  const totalCalls = service === "eCFR" ? 78 : service === "VA.gov" ? 523 : 1245;

  return serviceEndpoints.map(({ endpoint, weight }) => ({
    endpoint,
    calls: Math.floor(totalCalls * weight),
    averageResponseTime: 200 + Math.floor(Math.random() * 400)
  }));
}
