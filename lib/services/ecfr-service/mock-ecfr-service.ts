import {
  EcfrServiceInterface,
  RegulationResults,
  RegulationDetail,
  Citation,
  RegulationSummary
} from "./types";
import { apiUsageService } from "@/lib/services/api-usage";

/**
 * Mock implementation of the eCFR service for development
 */
export class MockEcfrService implements EcfrServiceInterface {
  private mockRegulations: RegulationSummary[] = [
    {
      id: "38-cfr-3-1",
      title: 38,
      part: 3,
      section: "1",
      heading: "§3.1 Definitions.",
      content:
        "The following definitions apply to the regulations in this part: (a) Armed Forces means the United States Army, Navy, Marine Corps, Air Force, Space Force, and Coast Guard, including their Reserve components. (b) Compensation means a monthly payment made by the Department of Veterans Affairs to a veteran because of service-connected disability, or to a surviving spouse, child, or parent of a veteran because of the service-connected death of the veteran.",
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.1"
    },
    {
      id: "38-cfr-3-303",
      title: 38,
      part: 3,
      section: "303",
      heading: "§3.303 Principles relating to service connection.",
      content:
        "(a) General. Service connection connotes many factors but basically it means that the facts, shown by evidence, establish that a particular injury or disease resulting in disability was incurred coincident with service in the Armed Forces, or if preexisting such service, was aggravated therein. This may be accomplished by affirmatively showing inception or aggravation during service or through the application of statutory presumptions.",
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.303"
    },
    {
      id: "38-cfr-3-304",
      title: 38,
      part: 3,
      section: "304",
      heading: "§3.304 Direct service connection; wartime and peacetime.",
      content:
        "(a) General. The basic considerations relating to service connection are stated in §3.303. The criteria in this section apply only to disabilities which may have resulted from service in a period of war or service rendered on or after January 1, 1947. (b) Presumption of soundness. The veteran will be considered to have been in sound condition when examined, accepted, and enrolled for service, except as to defects, infirmities, or disorders noted at entrance into service, or where clear and unmistakable (obvious or manifest) evidence demonstrates that an injury or disease existed prior thereto and was not aggravated by such service.",
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.304"
    },
    {
      id: "38-cfr-3-309",
      title: 38,
      part: 3,
      section: "309",
      heading: "§3.309 Disease subject to presumptive service connection.",
      content:
        "(a) Chronic diseases. The following diseases shall be granted service connection although not otherwise established as incurred in or aggravated by service if manifested to a compensable degree within the applicable time limits under §3.307 following service in a period of war or following peacetime service on or after January 1, 1947, provided the rebuttable presumption provisions of §3.307 are also satisfied: Arthritis, Diabetes mellitus, Hypertension, Multiple sclerosis, Psychoses, etc.",
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.309"
    },
    {
      id: "38-cfr-4-130",
      title: 38,
      part: 4,
      section: "130",
      heading: "§4.130 Schedule of ratings - Mental disorders.",
      content:
        "The nomenclature employed in this portion of the rating schedule is based upon the Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, of the American Psychiatric Association (DSM-5). Rating agencies must be thoroughly familiar with this manual to properly implement the directives in §4.125 through §4.129 and to apply the general rating formula for mental disorders in §4.130.",
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-4/section-4.130"
    }
  ];

  private mockDetailedRegulations: Record<string, RegulationDetail> = {
    "38-cfr-3-303": {
      id: "38-cfr-3-303",
      title: 38,
      part: 3,
      section: "303",
      heading: "§3.303 Principles relating to service connection.",
      content:
        "(a) General. Service connection connotes many factors but basically it means that the facts, shown by evidence, establish that a particular injury or disease resulting in disability was incurred coincident with service in the Armed Forces, or if preexisting such service, was aggravated therein. This may be accomplished by affirmatively showing inception or aggravation during service or through the application of statutory presumptions.\n\n(b) Chronicity and continuity. With chronic disease shown as such in service (or within the presumptive period under §3.307) so as to permit a finding of service connection, subsequent manifestations of the same chronic disease at any later date, however remote, are service connected, unless clearly attributable to intercurrent causes.\n\n(c) Preservice disabilities noted in service. There are medical principles so universally recognized as to constitute fact (clear and unmistakable proof), and when in accordance with these principles existence of a disability prior to service is established, no additional or confirmatory evidence is necessary.",
      subparts: [
        {
          id: "38-cfr-3-303-a",
          heading: "(a) General",
          content:
            "Service connection connotes many factors but basically it means that the facts, shown by evidence, establish that a particular injury or disease resulting in disability was incurred coincident with service in the Armed Forces, or if preexisting such service, was aggravated therein."
        },
        {
          id: "38-cfr-3-303-b",
          heading: "(b) Chronicity and continuity",
          content:
            "With chronic disease shown as such in service (or within the presumptive period under §3.307) so as to permit a finding of service connection, subsequent manifestations of the same chronic disease at any later date, however remote, are service connected, unless clearly attributable to intercurrent causes."
        }
      ],
      citations: [
        {
          id: "citation-1",
          title: 38,
          part: 3,
          section: "307",
          text: "§3.307",
          context:
            "With chronic disease shown as such in service (or within the presumptive period under §3.307)"
        }
      ],
      url: "https://www.ecfr.gov/current/title-38/chapter-I/part-3/section-3.303",
      lastUpdated: "2023-07-15"
    }
  };

  /**
   * Helper method to log API calls for tracking usage
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
    // Simulate API delay
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Filter mock regulations by title number if provided
      let filteredRegulations = this.mockRegulations.filter((reg) => reg.title === titleNumber);

      // Further filter by query if provided
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredRegulations = filteredRegulations.filter(
          (reg) =>
            reg.heading.toLowerCase().includes(lowerQuery) ||
            reg.content.toLowerCase().includes(lowerQuery)
        );
      }

      const results = {
        totalCount: filteredRegulations.length,
        results: filteredRegulations
      };

      // Log the successful API call
      await this.logApiCall({
        endpoint: "/search",
        responseTimeMs: Date.now() - startTime,
        success: true,
        statusCode: 200,
        queryParams: { query, title: titleNumber.toString() }
      });

      return results;
    } catch (error) {
      // Log the failed API call
      await this.logApiCall({
        endpoint: "/search",
        responseTimeMs: Date.now() - startTime,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        queryParams: { query, title: titleNumber.toString() }
      });

      throw error;
    }
  }

  /**
   * Get detailed information about a specific regulation
   */
  async getRegulationById(id: string): Promise<RegulationDetail> {
    // Simulate API delay
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Return detailed regulation if we have it
      if (this.mockDetailedRegulations[id]) {
        // Log the successful API call
        await this.logApiCall({
          endpoint: `/regulation/${id}`,
          responseTimeMs: Date.now() - startTime,
          success: true,
          statusCode: 200
        });

        return this.mockDetailedRegulations[id];
      }

      // Otherwise, find the basic regulation and convert it
      const basicReg = this.mockRegulations.find((reg) => reg.id === id);
      if (!basicReg) {
        // Log the failed API call
        await this.logApiCall({
          endpoint: `/regulation/${id}`,
          responseTimeMs: Date.now() - startTime,
          success: false,
          statusCode: 404,
          errorMessage: `Regulation with ID ${id} not found`
        });

        throw new Error(`Regulation with ID ${id} not found`);
      }

      // Create a simple detailed regulation from the basic one
      const result = {
        ...basicReg,
        subparts: [],
        citations: [],
        lastUpdated: "2023-12-01"
      };

      // Log the successful API call
      await this.logApiCall({
        endpoint: `/regulation/${id}`,
        responseTimeMs: Date.now() - startTime,
        success: true,
        statusCode: 200
      });

      return result;
    } catch (error) {
      // Log the failed API call if not already logged
      if (!(error instanceof Error && error.message.includes("not found"))) {
        await this.logApiCall({
          endpoint: `/regulation/${id}`,
          responseTimeMs: Date.now() - startTime,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
      }

      throw error;
    }
  }

  /**
   * Get citation information for a specific CFR reference
   */
  async getCitation(title: number, part: number, section: string): Promise<Citation> {
    // Simulate API delay
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      // Find a regulation that matches the citation
      const reg = this.mockRegulations.find(
        (r) => r.title === title && r.part === part && r.section === section
      );

      if (!reg) {
        // Log the failed API call
        await this.logApiCall({
          endpoint: "/citation",
          responseTimeMs: Date.now() - startTime,
          success: false,
          statusCode: 404,
          errorMessage: `Citation for ${title} CFR ${part}.${section} not found`,
          queryParams: { title: title.toString(), part: part.toString(), section }
        });

        throw new Error(`Citation for ${title} CFR ${part}.${section} not found`);
      }

      const result = {
        id: `citation-${title}-${part}-${section}`,
        title,
        part,
        section,
        text: reg.heading,
        context: reg.content.substring(0, 100) + "..."
      };

      // Log the successful API call
      await this.logApiCall({
        endpoint: "/citation",
        responseTimeMs: Date.now() - startTime,
        success: true,
        statusCode: 200,
        queryParams: { title: title.toString(), part: part.toString(), section }
      });

      return result;
    } catch (error) {
      // Log the failed API call if not already logged
      if (!(error instanceof Error && error.message.includes("not found"))) {
        await this.logApiCall({
          endpoint: "/citation",
          responseTimeMs: Date.now() - startTime,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          queryParams: { title: title.toString(), part: part.toString(), section }
        });
      }

      throw error;
    }
  }
}
