import { FileType, FileStatus } from "@/types/file-manager";
import { v4 as uuidv4 } from "uuid";

/**
 * File utilities for the file manager
 */

/**
 * Get the file type from a file extension
 * @param fileName The file name
 * @returns The file type
 */
export const getFileTypeFromName = (fileName: string): FileType => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "pdf":
      return FileType.PDF;
    case "jpg":
    case "jpeg":
      return FileType.JPG;
    case "png":
      return FileType.PNG;
    default:
      return FileType.UNKNOWN;
  }
};

/**
 * Get a color for a file type
 * @param type The file type
 * @returns The color for the file type
 */
export const getFileTypeColor = (type: FileType): string => {
  switch (type) {
    case FileType.PDF:
      return "#ef4444"; // red
    case FileType.JPG:
      return "#3b82f6"; // blue
    case FileType.PNG:
      return "#10b981"; // green
    default:
      return "#6b7280"; // gray
  }
};

/**
 * Check if a file is valid (correct type and size)
 * @param file The file to check
 * @returns An object with isValid and error message
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const validTypes = ["application/pdf", "image/jpeg", "image/png"];

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only PDF, JPG, and PNG files are allowed."
    };
  }

  // Check file size (max 20MB)
  const maxSize = 20 * 1024 * 1024; // 20MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large. Maximum size is 20MB. Current size: ${formatFileSize(file.size)}`
    };
  }

  return { isValid: true };
};

/**
 * Format file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns A formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Create a file object from a browser File object
 * @param file The browser File object
 * @param ocrText The OCR text (optional)
 * @returns A file object for the store
 */
export const createFileObject = (file: File, ocrText?: string): any => {
  const fileType = getFileTypeFromName(file.name);

  return {
    id: uuidv4(),
    name: file.name,
    type: fileType,
    size: file.size,
    uploadDate: new Date(),
    lastModified: new Date(file.lastModified),
    status: FileStatus.COMPLETE,
    url: URL.createObjectURL(file),
    thumbnailUrl: fileType === FileType.PDF ? null : URL.createObjectURL(file),
    categoryIds: [],
    tagIds: [],
    content: ocrText || "",
    metadata: {
      contentType: file.type,
      lastModified: file.lastModified
    }
  };
};

/**
 * Check if a file is an image
 * @param fileType The file type
 * @returns True if the file is an image
 */
export const isImageFile = (fileType: FileType): boolean => {
  return fileType === FileType.JPG || fileType === FileType.PNG;
};

/**
 * Create a thumbnail URL for a file
 * This is a mock implementation that would be replaced with actual thumbnail generation
 * @param file The file
 * @returns A thumbnail URL
 */
export const createThumbnailUrl = (file: File): string => {
  const fileType = getFileTypeFromName(file.name);

  if (isImageFile(fileType)) {
    // For images, we would normally create a thumbnail
    // For mock purposes, we'll just return a placeholder
    return "/mock/thumbnails/image-thumbnail.png";
  } else if (fileType === FileType.PDF) {
    // For PDFs, we would normally extract the first page
    return "/mock/thumbnails/pdf-thumbnail.png";
  } else {
    // For unknown file types
    return "/mock/thumbnails/generic-thumbnail.png";
  }
};
