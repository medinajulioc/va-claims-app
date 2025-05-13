import { EcfrServiceInterface, RegulationResults, RegulationDetail, Citation } from "./types";
import { apiUsageService } from "@/lib/services/api-usage";

/**
 * Live implementation of the eCFR service for production
 * This will connect to the actual eCFR API when API keys are configured
 */
export class LiveEcfrService implements EcfrServiceInterface {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = "https://www.ecfr.gov/developers/api/v1") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Helper method to make authenticated API requests
   */
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add API key and other parameters to the URL
    url.searchParams.append("api_key", this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Make the request
    const startTime = Date.now();

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json"
        }
      });

      // Log the API call
      await this.logApiCall({
        endpoint,
        responseTimeMs: Date.now() - startTime,
        success: response.ok,
        statusCode: response.status,
        queryParams: params
      });

      if (!response.ok) {
        throw new Error(`eCFR API error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      // Log the error
      await this.logApiCall({
        endpoint,
        responseTimeMs: Date.now() - startTime,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  /**
   * Log API calls for tracking usage
   */
  private async logApiCall(data: {
    endpoint: string;
    responseTimeMs: number;
    success: boolean;
    statusCode?: number;
    queryParams?: Record<string, string>;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await apiUsageService.logApiCall({
        service: "eCFR",
        ...data
      });
    } catch (error) {
      // Don't let logging errors affect the main functionality
      console.error("Error logging API call:", error);
    }
  }

  /**
   * Search for regulations matching a query
   */
  async searchRegulations(query: string, titleNumber: number = 38): Promise<RegulationResults> {
    const params: Record<string, string> = {
      query: query,
      title: titleNumber.toString()
    };

    // This is a placeholder - the actual API endpoints and response format
    // would need to be adjusted based on the actual eCFR API documentation
    const response = await this.makeRequest<any>("/search", params);

    // Transform the API response to match our interface
    return {
      totalCount: response.count || 0,
      results: (response.results || []).map((result: any) => ({
        id: result.id || `${titleNumber}-cfr-${result.part}-${result.section}`,
        title: titleNumber,
        part: parseInt(result.part, 10),
        section: result.section,
        heading: result.heading || `§${result.part}.${result.section}`,
        content: result.content || "",
        url:
          result.url ||
          `https://www.ecfr.gov/current/title-${titleNumber}/part-${result.part}/section-${result.section}`
      }))
    };
  }

  /**
   * Get detailed information about a specific regulation
   */
  async getRegulationById(id: string): Promise<RegulationDetail> {
    // Extract title, part, section from ID format like "38-cfr-3-303"
    const parts = id.split("-");
    const title = parseInt(parts[0], 10);
    const part = parseInt(parts[2], 10);
    const section = parts[3];

    const params: Record<string, string> = {
      title: title.toString(),
      part: part.toString(),
      section: section
    };

    // This is a placeholder - the actual API endpoints and response format
    // would need to be adjusted based on the actual eCFR API documentation
    const response = await this.makeRequest<any>(`/regulation/${id}`, params);

    // Transform the API response to match our interface
    return {
      id: id,
      title: title,
      part: part,
      section: section,
      heading: response.heading || `§${part}.${section}`,
      content: response.content || "",
      subparts: (response.subparts || []).map((subpart: any) => ({
        id: subpart.id,
        heading: subpart.heading,
        content: subpart.content
      })),
      citations: (response.citations || []).map((citation: any) => ({
        id: citation.id,
        title: parseInt(citation.title, 10),
        part: parseInt(citation.part, 10),
        section: citation.section,
        text: citation.text,
        context: citation.context
      })),
      url:
        response.url ||
        `https://www.ecfr.gov/current/title-${title}/part-${part}/section-${section}`,
      lastUpdated: response.lastUpdated || new Date().toISOString().split("T")[0]
    };
  }

  /**
   * Get citation information for a specific CFR reference
   */
  async getCitation(title: number, part: number, section: string): Promise<Citation> {
    const params: Record<string, string> = {
      title: title.toString(),
      part: part.toString(),
      section: section
    };

    // This is a placeholder - the actual API endpoints and response format
    // would need to be adjusted based on the actual eCFR API documentation
    const response = await this.makeRequest<any>("/citation", params);

    // Transform the API response to match our interface
    return {
      id: response.id || `citation-${title}-${part}-${section}`,
      title: title,
      part: part,
      section: section,
      text: response.text || `§${part}.${section}`,
      context: response.context || ""
    };
  }
}
