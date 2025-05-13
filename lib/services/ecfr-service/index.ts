import { EcfrServiceInterface } from "./types";
import { MockEcfrService } from "./mock-ecfr-service";
import { LiveEcfrService } from "./live-ecfr-service";

/**
 * Factory function to create the appropriate eCFR service based on environment
 */
export function createEcfrService(): EcfrServiceInterface {
  // Check if we should use mock data
  const useMock =
    process.env.USE_MOCK_ECFR === "true" ||
    process.env.NODE_ENV === "development" ||
    !process.env.ECFR_API_KEY ||
    process.env.ECFR_API_KEY === "mock";

  if (useMock) {
    console.log("Using mock eCFR service");
    return new MockEcfrService();
  }

  // Otherwise, use the live service
  const apiKey = process.env.ECFR_API_KEY || "";
  const apiEndpoint = process.env.ECFR_API_ENDPOINT || "https://www.ecfr.gov/developers/api/v1";

  console.log("Using live eCFR service");
  return new LiveEcfrService(apiKey, apiEndpoint);
}

// Export a singleton instance
export const ecfrService = createEcfrService();

// Re-export types
export * from "./types";
