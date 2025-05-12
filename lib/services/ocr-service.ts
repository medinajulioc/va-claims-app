import { FileType, OCRResult, OCRProcessingStatus } from "@/types/file-manager";
import { predefinedCategories } from "@/lib/mock/file-categories";
import { getFileTypeFromName } from "@/lib/utils/file-utils";

/**
 * Mock OCR Service
 * This is a mock implementation that simulates OCR processing.
 * In a real implementation, this would use Tesseract.js or another OCR library.
 */

// Queue for processing files
type QueueItem = {
  file: File;
  id: string;
  attempt: number;
  maxRetries: number;
  onProgress?: (progress: number) => void;
  onComplete?: (result: OCRResult) => void;
  onError?: (error: Error) => void;
};

class OCRProcessingQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private maxConcurrent = 2;
  private currentProcessing = 0;

  /**
   * Add a file to the OCR processing queue
   */
  addToQueue(
    file: File,
    id: string,
    options?: {
      maxRetries?: number;
      onProgress?: (progress: number) => void;
      onComplete?: (result: OCRResult) => void;
      onError?: (error: Error) => void;
    }
  ): void {
    this.queue.push({
      file,
      id,
      attempt: 0,
      maxRetries: options?.maxRetries || 2,
      onProgress: options?.onProgress,
      onComplete: options?.onComplete,
      onError: options?.onError
    });

    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process the queue of files
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0 || this.currentProcessing >= this.maxConcurrent) {
      if (this.queue.length === 0 && this.currentProcessing === 0) {
        this.processing = false;
      }
      return;
    }

    this.processing = true;
    this.currentProcessing++;

    const item = this.queue.shift();
    if (!item) {
      this.currentProcessing--;
      this.processQueue();
      return;
    }

    try {
      // Update progress to 10% to indicate we've started
      item.onProgress?.(10);

      // Begin OCR processing
      const result = await processFileWithOCRInternal(item.file, (progress) =>
        item.onProgress?.(progress)
      );

      // Call the completion callback
      item.onComplete?.(result);
    } catch (error) {
      // Handle retries
      if (item.attempt < item.maxRetries) {
        console.log(
          `OCR processing failed for ${item.file.name}, retrying (${item.attempt + 1}/${item.maxRetries})...`
        );
        this.queue.push({
          ...item,
          attempt: item.attempt + 1
        });
      } else {
        // Call the error callback if we've exceeded retries
        item.onError?.(error as Error);
      }
    } finally {
      this.currentProcessing--;
      // Process the next item in the queue
      this.processQueue();
    }
  }

  /**
   * Clear the queue of files
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Get the current queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }
}

// Create a singleton instance of the queue
const ocrQueue = new OCRProcessingQueue();

// Enhanced mock text content with more varied responses
const mockTextContent: Record<string, string[]> = {
  pdf: [
    "This is a mock PDF document content extracted through OCR. It contains information about VA disability claims and benefits. The document appears to be an official VA form with sections for personal information, military service details, and medical conditions. Form number: 21-526EZ. Application for Disability Compensation and Related Compensation Benefits.",
    "VA Form 21-4138, Statement in Support of Claim. This document contains a personal statement regarding service-connected PTSD. The veteran describes combat experiences in Afghanistan from 2010-2011 that led to recurring nightmares, hypervigilance, and difficulty maintaining personal relationships. The statement is signed and dated March 15, 2023.",
    "Department of Veterans Affairs Rating Decision. This document contains information about a veteran's disability claim decision. Service connection for lumbar strain is granted with an evaluation of 20 percent effective June 10, 2022. Service connection for tinnitus is granted with an evaluation of 10 percent effective June 10, 2022. Service connection for migraine headaches is denied.",
    "Medical Nexus Letter from Dr. James Wilson, Board Certified Orthopedic Surgeon. This letter establishes a connection between the veteran's current knee condition and military service involving parachute jumps. The doctor states: 'It is at least as likely as not (50% or greater probability) that the current osteoarthritis of the left knee is related to the repetitive trauma sustained during 24 documented parachute jumps during military service.'",
    "DD Form 214, Certificate of Release or Discharge from Active Duty. This document verifies military service from September 2008 to October 2014. The veteran served in the U.S. Army with honorable discharge. Awards and decorations include: Combat Action Badge, Army Commendation Medal, Afghanistan Campaign Medal with two campaign stars."
  ],
  jpg: [
    "This is a mock image content extracted through OCR. The image appears to be a medical document with diagnosis information, treatment recommendations, and doctor's signature. The document contains medical records related to service-connected conditions. Medical diagnosis: PTSD with associated anxiety symptoms.",
    "Primary Care Visit Notes, VA Medical Center. Patient presents with chronic low back pain rated 7/10, worse with prolonged standing. Pain radiates to right leg. Medication includes Naproxen 500mg twice daily with minimal relief. Assessment: Degenerative Disc Disease L4-L5 with radiculopathy. Plan: Referral to physical therapy, consider MRI if symptoms worsen.",
    "Military Entrance Processing Station (MEPS) Medical Examination, dated January 15, 2005. The document shows a physical examination with normal findings for all major body systems. No disqualifying conditions noted. Vision 20/20 in both eyes. Blood pressure 120/80. Height: 70 inches. Weight: 175 lbs.",
    "Buddy Statement from Sergeant Michael Johnson, who served with the veteran in Iraq. The statement confirms they were both present during an IED explosion on Route Tampa near Baghdad on March 20, 2007. The document describes how the blast knocked them both off their feet, and they experienced ringing in their ears for several days afterward.",
    "X-ray Report: Bilateral Knees. Findings: Moderate degenerative changes in the right knee with joint space narrowing and osteophyte formation. Left knee shows mild to moderate degenerative changes. Impression: Bilateral knee osteoarthritis, more pronounced in the right knee."
  ],
  png: [
    "This is a mock image content extracted through OCR. The image shows a DD-214 Certificate of Release or Discharge from Active Duty. It contains military service information, dates of service, decorations, and discharge status. Service period: 2010-2014.",
    "VA Benefits Summary Letter. This document verifies the veteran is currently receiving disability compensation at a combined 70% rating. Service-connected conditions include: PTSD (50%), Lumbar Strain (20%), Tinnitus (10%), and Right Knee Condition (10%). The veteran is not considered permanently and totally disabled at this time.",
    "Service Treatment Record: Medical visit on April 10, 2012. Chief complaint: Pain in right shoulder following training exercise. Assessment: Right rotator cuff strain. Treatment: NSAIDs, limited duty profile for 14 days, follow-up in two weeks if not improved.",
    "VA Disability Benefits Questionnaire (DBQ) for Mental Disorders. The form documents symptoms including: depressed mood, anxiety, suspiciousness, chronic sleep impairment, mild memory loss, disturbances of motivation and mood. The clinician indicates occupational and social impairment with reduced reliability and productivity.",
    "Medical Prescription from Walter Reed National Military Medical Center. Medication: Tramadol 50mg. Sig: Take 1 tablet by mouth every 6 hours as needed for pain. Quantity: 30 tablets. Refills: 2. Prescribed for: Chronic lower back pain."
  ]
};

// Keywords related to different VA document categories
const categoryKeywords: Record<string, string[]> = {
  "medical-records": [
    "diagnosis",
    "treatment",
    "medical",
    "examination",
    "doctor",
    "hospital",
    "clinic",
    "prescription",
    "medication",
    "symptoms",
    "pain",
    "chronic",
    "specialist",
    "health",
    "physical",
    "mental",
    "psychiatric",
    "therapy",
    "rehabilitation",
    "PTSD",
    "TBI",
    "MRI",
    "X-ray",
    "assessment",
    "primary care",
    "radiology",
    "orthopedic"
  ],
  "service-records": [
    "DD-214",
    "discharge",
    "service",
    "military",
    "active duty",
    "deployment",
    "combat",
    "MOS",
    "rank",
    "unit",
    "branch",
    "honorable",
    "separation",
    "enlistment",
    "tour",
    "duty station",
    "MEPS",
    "service treatment record",
    "military entrance"
  ],
  "va-forms": [
    "VA Form",
    "21-526EZ",
    "21-0958",
    "21-4138",
    "21-686c",
    "application",
    "claim",
    "appeal",
    "compensation",
    "benefits",
    "declaration",
    "statement",
    "DBQ",
    "disability benefits questionnaire"
  ],
  correspondence: [
    "letter",
    "notification",
    "decision",
    "response",
    "request",
    "communication",
    "reply",
    "inquiry",
    "correspondence",
    "notice",
    "summary letter"
  ],
  "evidence-documents": [
    "evidence",
    "exhibit",
    "support",
    "documentation",
    "proof",
    "witness",
    "statement",
    "buddy",
    "affidavit",
    "testimony",
    "nexus",
    "service connection"
  ],
  "appeals-documents": [
    "appeal",
    "board",
    "judge",
    "hearing",
    "disagreement",
    "NOD",
    "review",
    "decision",
    "remand",
    "BVA",
    "denial",
    "reconsideration",
    "rating decision"
  ],
  "claim-status": [
    "status",
    "update",
    "progress",
    "tracking",
    "pending",
    "development",
    "processing",
    "approved",
    "denied",
    "deferred",
    "granted",
    "evaluation",
    "effective"
  ]
};

/**
 * Process a file with OCR (adds to processing queue)
 * @param file The file to process
 * @param id The file ID
 * @param callbacks Optional callbacks for progress, completion, and error
 * @returns A promise that resolves when the file is added to the queue
 */
export const processFileWithOCR = async (
  file: File,
  id: string = "unknown",
  callbacks?: {
    onProgress?: (progress: number) => void;
    onComplete?: (result: OCRResult) => void;
    onError?: (error: Error) => void;
  }
): Promise<OCRResult> => {
  return new Promise((resolve, reject) => {
    // Add to the processing queue
    ocrQueue.addToQueue(file, id, {
      maxRetries: 2,
      onProgress: callbacks?.onProgress,
      onComplete: (result) => {
        callbacks?.onComplete?.(result);
        resolve(result);
      },
      onError: (error) => {
        callbacks?.onError?.(error);
        reject(error);
      }
    });
  });
};

/**
 * Internal function to process a file with OCR
 * @param file The file to process
 * @param onProgress Progress callback
 * @returns The OCR result
 */
const processFileWithOCRInternal = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<OCRResult> => {
  // Simulate initial processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  onProgress?.(20);

  // Determine the file type
  const fileType = getFileTypeFromName(file.name);
  let contentArray: string[] = mockTextContent.pdf;

  if (fileType === FileType.JPG) {
    contentArray = mockTextContent.jpg;
  } else if (fileType === FileType.PNG) {
    contentArray = mockTextContent.png;
  }

  // Simulate second stage processing
  await new Promise((resolve) => setTimeout(resolve, 800));
  onProgress?.(50);

  // Randomly select content from the appropriate array
  const randomIndex = Math.floor(Math.random() * contentArray.length);
  const content = contentArray[randomIndex];

  // Add random processing success rate (95% success)
  const isSuccess = Math.random() < 0.95;

  if (!isSuccess) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    throw new Error("OCR processing failed. The document could not be processed correctly.");
  }

  // Simulate final processing stage
  await new Promise((resolve) => setTimeout(resolve, 500));
  onProgress?.(90);

  // Generate a random confidence score between 0.85 and 0.98
  const confidence = 0.85 + Math.random() * 0.13;

  // Simulate completion
  await new Promise((resolve) => setTimeout(resolve, 200));
  onProgress?.(100);

  return {
    fileId: file.name,
    text: content,
    confidence: confidence,
    processedAt: new Date(),
    processingTime: Math.floor(1000 + Math.random() * 2000) // Random processing time between 1-3 seconds
  };
};

/**
 * Auto-categorize a document based on its extracted text content
 * @param text The extracted text from the document
 * @returns An array of suggested category IDs
 */
export const autoCategorizeDocument = (text: string): string[] => {
  if (!text) return [];

  const textLower = text.toLowerCase();
  const suggestedCategories: string[] = [];
  const matchScores: Record<string, number> = {};

  // Match text against category keywords
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    // Count the number of keyword matches
    const matchCount = keywords.reduce((count, keyword) => {
      return count + (textLower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);

    // Store the match score for this category
    matchScores[categoryId] = matchCount;

    // If more than 2 keywords match, suggest this category
    if (matchCount >= 2) {
      suggestedCategories.push(categoryId);
    }
  }

  // If no categories matched, find the category with the highest match score
  if (suggestedCategories.length === 0) {
    const entries = Object.entries(matchScores);
    if (entries.length > 0) {
      const bestMatch = entries.reduce((best, current) => (current[1] > best[1] ? current : best));

      if (bestMatch[1] > 0) {
        suggestedCategories.push(bestMatch[0]);
      } else {
        suggestedCategories.push("other-documents");
      }
    } else {
      suggestedCategories.push("other-documents");
    }
  }

  return suggestedCategories;
};

/**
 * Generate suggestions for additional categories based on document content
 * @param text The extracted text from the document
 * @param currentCategories The currently assigned categories
 * @returns An array of suggested category IDs not already assigned
 */
export const suggestAdditionalCategories = (
  text: string,
  currentCategories: string[]
): string[] => {
  const allSuggestions = autoCategorizeDocument(text);

  // Filter out categories that are already assigned
  return allSuggestions.filter((categoryId) => !currentCategories.includes(categoryId));
};

/**
 * Extract text from a PDF file
 * This is a mock implementation that would be replaced with actual PDF.js code
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Randomly select content from the PDF array
  const randomIndex = Math.floor(Math.random() * mockTextContent.pdf.length);
  return mockTextContent.pdf[randomIndex];
};

/**
 * Extract text from an image file
 * This is a mock implementation that would be replaced with actual Tesseract.js code
 */
export const extractTextFromImage = async (file: File): Promise<string> => {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const fileType = getFileTypeFromName(file.name);

  if (fileType === FileType.JPG) {
    const randomIndex = Math.floor(Math.random() * mockTextContent.jpg.length);
    return mockTextContent.jpg[randomIndex];
  } else if (fileType === FileType.PNG) {
    const randomIndex = Math.floor(Math.random() * mockTextContent.png.length);
    return mockTextContent.png[randomIndex];
  }

  // Fallback
  return "Unrecognized image content. Please try a different image.";
};

/**
 * Get the current OCR processing queue length
 * @returns The number of files in the queue
 */
export const getOCRQueueLength = (): number => {
  return ocrQueue.getQueueLength();
};

/**
 * Clear the OCR processing queue
 */
export const clearOCRQueue = (): void => {
  ocrQueue.clearQueue();
};
