/**
 * Types for eCFR API responses and service interfaces
 */

// Search results from eCFR API
export interface RegulationResults {
  totalCount: number;
  results: RegulationSummary[];
}

// Summary of a regulation returned in search results
export interface RegulationSummary {
  id: string;
  title: number;
  part: number;
  section: string;
  heading: string;
  content: string;
  url: string;
}

// Detailed regulation information
export interface RegulationDetail {
  id: string;
  title: number;
  part: number;
  section: string;
  heading: string;
  content: string;
  subparts?: RegulationSubpart[];
  citations?: Citation[];
  url: string;
  lastUpdated: string;
}

// Subpart of a regulation
export interface RegulationSubpart {
  id: string;
  heading: string;
  content: string;
}

// Citation reference
export interface Citation {
  id: string;
  title: number;
  part: number;
  section: string;
  text: string;
  context?: string;
}

/**
 * Interface for eCFR service implementations
 * This ensures consistent API between mock and live implementations
 */
export interface EcfrServiceInterface {
  /**
   * Search for regulations matching a query
   */
  searchRegulations(query: string, titleNumber?: number): Promise<RegulationResults>;

  /**
   * Get detailed information about a specific regulation
   */
  getRegulationById(id: string): Promise<RegulationDetail>;

  /**
   * Get citation information for a specific CFR reference
   */
  getCitation(title: number, part: number, section: string): Promise<Citation>;
}

// API usage log entry
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
