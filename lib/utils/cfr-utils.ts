/**
 * Utilities for CFR query detection and formatting
 */

/**
 * Detect if a query is likely asking about CFR regulations
 */
export function isCfrQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();

  // Keywords that suggest a CFR-related query
  const cfrKeywords = [
    "cfr",
    "code of federal regulations",
    "regulation",
    "title 38",
    "va regulation",
    "disability rating",
    "service connection",
    "presumptive",
    "rating schedule",
    "section",
    "part",
    "disability code"
  ];

  // Check if any keywords are in the query
  return cfrKeywords.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Extract CFR citations from text
 * Looks for patterns like "38 CFR 3.303" or "§3.309"
 */
export function extractCfrCitations(text: string): Array<{
  title: number;
  part: number;
  section: string;
  displayText: string;
}> {
  const citations: Array<{
    title: number;
    part: number;
    section: string;
    displayText: string;
  }> = [];

  // Pattern for "38 CFR 3.303" format
  const cfrPattern = /(\d+)\s*CFR\s*(\d+)\.(\d+)/gi;
  let match: RegExpExecArray | null;

  while ((match = cfrPattern.exec(text)) !== null) {
    citations.push({
      title: parseInt(match[1], 10),
      part: parseInt(match[2], 10),
      section: match[3],
      displayText: match[0]
    });
  }

  // Pattern for "§3.309" format
  const sectionPattern = /§\s*(\d+)\.(\d+)/gi;

  while ((match = sectionPattern.exec(text)) !== null) {
    citations.push({
      title: 38, // Default to Title 38 for VA claims
      part: parseInt(match[1], 10),
      section: match[2],
      displayText: match[0]
    });
  }

  return citations;
}

/**
 * Format a CFR citation as a clickable link
 */
export function formatCfrCitation(title: number, part: number, section: string): string {
  return `[${title} CFR ${part}.${section}](https://www.ecfr.gov/current/title-${title}/part-${part}/section-${part}.${section})`;
}

/**
 * Format regulation content for display in chat
 */
export function formatRegulationForChat(content: string): string {
  // Add proper markdown formatting
  return content
    .replace(/\(([a-z])\)/g, "**($1)**") // Bold subsection markers like (a), (b)
    .replace(/§(\d+\.\d+)/g, "**§$1**"); // Bold section references
}

/**
 * Extract search terms for regulation search from a query
 * This helps focus the search on relevant terms
 */
export function extractRegulationSearchTerms(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Remove common stop words and focus on key terms
  const stopWords = [
    "what",
    "does",
    "is",
    "are",
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "about",
    "say",
    "says",
    "explain",
    "tell",
    "me",
    "please",
    "can",
    "you",
    "how",
    "why",
    "when",
    "where",
    "which",
    "who",
    "whom",
    "whose",
    "regulation",
    "regulations",
    "cfr",
    "code",
    "federal",
    "of"
  ];

  // Extract CFR citations if present
  const citations = extractCfrCitations(query);
  if (citations.length > 0) {
    // If we have a specific citation, use it as the primary search term
    const citation = citations[0];
    return `${citation.part}.${citation.section}`;
  }

  // Extract specific regulation numbers if present
  const regNumberMatch = query.match(/(\d+\.\d+)/);
  if (regNumberMatch) {
    return regNumberMatch[1];
  }

  // Look for specific VA disability terms
  const vaTerms = [
    "service connection",
    "presumptive",
    "agent orange",
    "ptsd",
    "tinnitus",
    "hearing loss",
    "diabetes",
    "hypertension",
    "sleep apnea",
    "rating schedule",
    "disability rating",
    "secondary condition",
    "gulf war",
    "vietnam",
    "herbicide",
    "burn pit",
    "radiation",
    "exposure",
    "combat",
    "direct service connection"
  ];

  for (const term of vaTerms) {
    if (lowerQuery.includes(term)) {
      return term;
    }
  }

  // Remove stop words and return the remaining terms
  let terms = lowerQuery
    .split(" ")
    .filter((word) => !stopWords.includes(word.trim()))
    .join(" ")
    .trim();

  // If we've filtered out too much, return a portion of the original query
  if (terms.length < 3 && query.length > 10) {
    return query.substring(0, 50).trim();
  }

  return terms || query.substring(0, 50).trim();
}
