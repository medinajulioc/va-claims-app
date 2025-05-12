/**
 * File Manager Types
 * Type definitions for the file manager functionality
 */

/**
 * File type enumeration
 */
export enum FileType {
  PDF = "pdf",
  JPG = "jpg",
  PNG = "png",
  UNKNOWN = "unknown"
}

/**
 * File status enumeration
 */
export enum FileStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETE = "complete",
  ERROR = "error"
}

/**
 * OCR processing status enumeration
 */
export enum OCRProcessingStatus {
  QUEUED = "queued",
  PROCESSING = "processing",
  COMPLETE = "complete",
  FAILED = "failed",
  RETRY = "retry"
}

/**
 * Document quality enumeration
 */
export enum DocumentQuality {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

/**
 * File interface representing an uploaded document
 */
export interface File {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadDate: Date;
  lastModified?: Date;
  status: FileStatus;
  url?: string;
  thumbnailUrl?: string;
  starred: boolean;
  categoryIds: string[];
  tagIds: string[];
  content?: string;
  metadata?: Record<string, any>;
  progress?: number;

  // Advanced document properties
  pageCount?: number;
  currentPage?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  documentQuality?: DocumentQuality;
  previewPages?: string[]; // URLs to individual page previews for PDFs
  annotations?: Annotation[];
  rotation?: number; // Rotation in degrees (0, 90, 180, 270)
  zoom?: number; // Zoom level (1.0 = 100%)
}

/**
 * Annotation interface for document markup
 */
export interface Annotation {
  id: string;
  type: "highlight" | "note" | "rectangle" | "underline";
  pageNumber: number;
  content?: string;
  color: string;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Category interface for organizing files
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
}

/**
 * Tag interface for labeling files
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

/**
 * Filter options for the file manager
 */
export interface FilterOptions {
  types?: FileType[];
  categories?: string[];
  tags?: string[];
  starred?: boolean;
  uncategorized?: boolean;
}

/**
 * Sort option for the file manager
 */
export interface SortOption {
  field: "name" | "type" | "size" | "uploadDate";
  direction: "asc" | "desc";
}

/**
 * OCR result from processing a file
 */
export interface OCRResult {
  text: string;
  confidence: number;
  categorySuggestions?: string[];
  tagSuggestions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Upload progress interface
 */
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: FileStatus;
  error?: string;
}

/**
 * OCR processing queue item
 */
export interface OCRQueueItem {
  fileId: string;
  fileName: string;
  status: OCRProcessingStatus;
  progress: number; // 0-100
  attempt: number;
  maxAttempts: number;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * File filter options
 */
export interface FileFilterOptions {
  search?: string;
  categories?: string[];
  tags?: string[];
  types?: FileType[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  starred?: boolean;
  uncategorized?: boolean;
}
