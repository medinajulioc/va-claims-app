"use client";

import * as React from "react";
import {
  PlusCircle,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Image,
  File as FileIcon,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  validateFile,
  formatFileSize,
  createFileObject,
  getFileTypeFromName
} from "@/lib/utils/file-utils";
import { FileType, FileStatus } from "@/types/file-manager";
import useFileManagerStore from "@/store/useFileManagerStore";
import { processFileWithOCR, autoCategorizeDocument } from "@/lib/services/ocr-service";
import { v4 as uuidv4 } from "uuid";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  progress: number;
  status: FileStatus;
  error?: string;
  fileType?: FileType;
}

export function FileUploadDialog() {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  const [uploadInProgress, setUploadInProgress] = React.useState(false);
  const [uploadStats, setUploadStats] = React.useState({ completed: 0, total: 0, failed: 0 });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { addFile } = useFileManagerStore();

  // Reset files when dialog is opened/closed
  React.useEffect(() => {
    if (!open) {
      // Wait a bit before clearing to allow animation to finish
      setTimeout(() => {
        setFiles([]);
        setGlobalError(null);
        setUploadInProgress(false);
        setUploadStats({ completed: 0, total: 0, failed: 0 });
      }, 300);
    }
  }, [open]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (fileList: FileList) => {
    setGlobalError(null);

    // Check overall file count limit (20 files max)
    if (files.length + fileList.length > 20) {
      setGlobalError(
        `Maximum of 20 files allowed. Selected ${fileList.length}, already have ${files.length}.`
      );
      return;
    }

    // Check for duplicates
    const currentFileNames = files.map((f) => f.name);
    const duplicates: string[] = [];

    const newFiles = Array.from(fileList).map((file) => {
      // Check for duplicates
      if (currentFileNames.includes(file.name)) {
        duplicates.push(file.name);
      }

      // Validate file
      const validation = validateFile(file);
      const fileType = getFileTypeFromName(file.name);

      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: uuidv4(),
        preview: URL.createObjectURL(file),
        progress: 0,
        status: validation.isValid ? FileStatus.UPLOADING : FileStatus.ERROR,
        error: validation.isValid ? undefined : validation.error,
        fileType: fileType
      });

      return fileWithPreview;
    });

    if (duplicates.length > 0) {
      setGlobalError(
        `Duplicate file(s): ${duplicates.join(", ")} - Please remove duplicates before uploading.`
      );
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setUploadStats((prev) => ({ ...prev, total: prev.total + newFiles.length }));
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      const updatedFiles = prevFiles.filter((file) => file.id !== id);

      // If all files with errors are removed, clear the global error
      if (!updatedFiles.some((file) => file.status === FileStatus.ERROR)) {
        setGlobalError(null);
      }

      // Update stats
      if (fileToRemove) {
        setUploadStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          failed: fileToRemove.status === FileStatus.ERROR ? prev.failed - 1 : prev.failed,
          completed:
            fileToRemove.status === FileStatus.COMPLETE ? prev.completed - 1 : prev.completed
        }));
      }

      return updatedFiles;
    });
  };

  const processFile = async (file: FileWithPreview) => {
    // Skip files with errors
    if (file.status === FileStatus.ERROR) {
      setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
      return;
    }

    try {
      // Update status to processing
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id ? { ...f, status: FileStatus.PROCESSING, progress: 30 } : f
        )
      );

      // Process with OCR using the queue-based approach
      const ocrResult = await processFileWithOCR(file, file.id, {
        onProgress: (progress) => {
          setFiles((prevFiles) =>
            prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f))
          );
        },
        onComplete: (result) => {
          console.log(`File ${file.name} processed successfully`);
        },
        onError: (error) => {
          console.error(`Error processing file ${file.name}:`, error);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: FileStatus.ERROR,
                    error: "Failed to process file. Please try again."
                  }
                : f
            )
          );
          setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
        }
      });

      // Auto-categorize based on content
      const suggestedCategories = autoCategorizeDocument(ocrResult.text);

      // Create file object for store
      const fileObject = {
        id: file.id,
        name: file.name,
        type: file.fileType || getFileTypeFromName(file.name),
        size: file.size,
        uploadDate: new Date(),
        status: FileStatus.COMPLETE,
        url: URL.createObjectURL(file),
        thumbnailUrl: file.preview,
        categoryIds: suggestedCategories,
        tagIds: [],
        content: ocrResult.text
      };

      // Add to store
      addFile(fileObject);

      // Update status to complete
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id ? { ...f, status: FileStatus.COMPLETE, progress: 100 } : f
        )
      );

      setUploadStats((prev) => ({ ...prev, completed: prev.completed + 1 }));
    } catch (error) {
      console.error("Error processing file:", error);

      // Update status to error
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: FileStatus.ERROR,
                error: "Failed to process file. Please try again."
              }
            : f
        )
      );

      setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
    }
  };

  const handleUpload = async () => {
    const validFiles = files.filter((file) => file.status !== FileStatus.ERROR);

    if (validFiles.length === 0) {
      setGlobalError("No valid files to upload.");
      return;
    }

    setUploadInProgress(true);

    // Process each valid file
    for (const file of validFiles) {
      await processFile(file);
    }

    // Check if all files are processed
    const allComplete = files.every(
      (file) => file.status === FileStatus.COMPLETE || file.status === FileStatus.ERROR
    );

    if (allComplete) {
      setUploadInProgress(false);

      // Auto-close only if there are no errors
      if (!files.some((file) => file.status === FileStatus.ERROR)) {
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
    }
  };

  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case FileStatus.COMPLETE:
        return "text-green-500";
      case FileStatus.ERROR:
        return "text-red-500";
      case FileStatus.PROCESSING:
        return "text-blue-500";
      case FileStatus.UPLOADING:
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case FileStatus.COMPLETE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case FileStatus.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case FileStatus.PROCESSING:
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = (file: FileWithPreview) => {
    const fileType = file.fileType || getFileTypeFromName(file.name);

    switch (fileType) {
      case FileType.PDF:
        return <FileText className="h-5 w-5 text-red-500" />;
      case FileType.JPG:
      case FileType.PNG:
        return <Image className="h-5 w-5 text-blue-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Calculate overall progress
  const overallProgress = files.length
    ? Math.floor(files.reduce((sum, file) => sum + file.progress, 0) / files.length)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Upload Files
      </Button>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload documents related to your VA claim. Supported formats: PDF, JPG, PNG (max 20MB
            per file)
          </DialogDescription>
        </DialogHeader>

        {globalError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <div
          className={`mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
            dragActive ? "border-blue-500 bg-blue-50" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
              <Label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-blue-500">
                <span>Upload files</span>
                <Input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only h-auto p-0"
                  onChange={handleChange}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                />
              </Label>
              <p className="mt-1">or drag and drop</p>
              <div className="mt-2 flex items-center text-xs">
                <Badge variant="outline" className="mr-1 text-gray-600">
                  PDF
                </Badge>
                <Badge variant="outline" className="mr-1 text-gray-600">
                  JPG
                </Badge>
                <Badge variant="outline" className="mr-1 text-gray-600">
                  PNG
                </Badge>
                <span className="ml-1 text-gray-500">Up to 20MB per file</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-1 h-3 w-3 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs text-xs">
                        PDF documents work best for text-based forms. Images (JPG/PNG) are
                        recommended for photos or simple documents. Maximum 20 files per upload.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="font-medium text-gray-900">Selected Files ({files.length}/20):</div>
              <div className="text-gray-500">
                {uploadStats.completed} complete, {uploadStats.failed} failed
              </div>
            </div>

            {uploadInProgress && (
              <div className="mt-2 mb-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Overall progress ({overallProgress}%)</span>
                  <span>
                    {uploadStats.completed}/{uploadStats.total} files
                  </span>
                </div>
                <Progress value={overallProgress} className="mt-1 h-1" />
              </div>
            )}

            <div className="mt-2 max-h-[240px] overflow-y-auto">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {files.map((file) => (
                  <li key={file.id} className="flex flex-col py-3 pr-2 pl-4 text-sm leading-6">
                    <div className="flex items-center justify-between">
                      <div className="flex w-0 flex-1 items-center">
                        {getFileIcon(file)}
                        <div className="ml-2 flex min-w-0 flex-1 gap-1">
                          <span
                            className={`truncate font-medium ${
                              file.status === FileStatus.ERROR ? "text-red-500" : ""
                            }`}>
                            {file.name}
                          </span>
                          <span className="shrink-0 text-gray-400">
                            {formatFileSize(file.size)}
                          </span>
                          <span className={`shrink-0 ${getStatusColor(file.status)}`}>
                            {file.status === FileStatus.COMPLETE && "• Complete"}
                            {file.status === FileStatus.PROCESSING && "• Processing"}
                            {file.status === FileStatus.ERROR && "• Error"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </div>
                    </div>

                    {file.error ? (
                      <div className="mt-1 text-xs text-red-500">{file.error}</div>
                    ) : (
                      file.status !== FileStatus.COMPLETE && (
                        <div className="mt-2 w-full">
                          <Progress value={file.progress} className="h-1" />
                          <div className="mt-1 text-xs text-gray-500">
                            {file.status === FileStatus.PROCESSING
                              ? "Processing document..."
                              : "Ready to upload"}
                          </div>
                        </div>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              files.length === 0 ||
              files.every((f) => f.status === FileStatus.ERROR) ||
              uploadInProgress
            }>
            {uploadInProgress ? "Processing..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
