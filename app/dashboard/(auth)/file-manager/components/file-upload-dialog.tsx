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

interface FileUploadDialogProps {
  customTrigger?: React.ReactNode;
}

export function FileUploadDialog({ customTrigger }: FileUploadDialogProps) {
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

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (files.length === 0) return 0;

    const totalProgress = files.reduce((acc, file) => acc + file.progress, 0);
    return Math.round(totalProgress / files.length);
  }, [files]);

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);

    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));

    // Update stats if the file was already processed
    if (fileToRemove?.status === FileStatus.COMPLETE) {
      setUploadStats((prev) => ({ ...prev, completed: prev.completed - 1, total: prev.total - 1 }));
    } else if (fileToRemove?.status === FileStatus.ERROR) {
      setUploadStats((prev) => ({ ...prev, failed: prev.failed - 1, total: prev.total - 1 }));
    } else {
      setUploadStats((prev) => ({ ...prev, total: prev.total - 1 }));
    }
  };

  const getFileIcon = (file: FileWithPreview) => {
    const iconClass = "h-5 w-5";

    switch (file.status) {
      case FileStatus.COMPLETE:
        return <CheckCircle className={`text-green-500 ${iconClass}`} />;
      case FileStatus.ERROR:
        return <AlertCircle className={`text-red-500 ${iconClass}`} />;
      default:
        switch (file.fileType) {
          case FileType.PDF:
            return <FileText className={`text-primary ${iconClass}`} />;
          case FileType.JPG:
          case FileType.PNG:
            return <Image className={`text-primary ${iconClass}`} />;
          default:
            return <FileIcon className={`text-primary ${iconClass}`} />;
        }
    }
  };

  const processFile = async (file: FileWithPreview) => {
    try {
      // Update status to processing
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === file.id ? { ...f, status: FileStatus.PROCESSING } : f))
      );

      // Simulate processing steps with progress updates
      for (let progress = 10; progress <= 90; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f)));
      }

      // In a real app, this would be where you'd send the file to your backend
      // For now, we'll simulate OCR processing and auto-categorization
      if (
        file.fileType === FileType.PDF ||
        file.fileType === FileType.JPG ||
        file.fileType === FileType.PNG
      ) {
        // Simulate OCR processing
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create a file object for the store
        const fileObject = createFileObject(file);

        // Add to store
        addFile(fileObject);
      } else {
        // For other file types, just add to store
        const fileObject = createFileObject(file);

        // Add to store
        addFile(fileObject);
      }

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
        return "text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {customTrigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {customTrigger}
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="file-upload-dialog-trigger">
          <PlusCircle className="mr-2 h-4 w-4" /> Upload Files
        </Button>
      )}
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
          className={`mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <div className="text-center">
            <Upload className="text-primary/30 mx-auto h-12 w-12" aria-hidden="true" />
            <div className="mt-4 flex flex-col items-center text-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={handleButtonClick}
                className="mb-2 font-medium">
                Select files
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
              </Button>
              <p className="text-muted-foreground text-sm">or drag and drop</p>
              <p className="text-muted-foreground mt-2 text-xs">PDF, JPG, PNG up to 20MB</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="font-medium">Selected Files ({files.length}/20)</div>
              <div className="text-muted-foreground">
                {uploadStats.completed} complete, {uploadStats.failed} failed
              </div>
            </div>

            {uploadInProgress && (
              <div className="mt-2 mb-2">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Overall progress ({overallProgress}%)</span>
                  <span>
                    {uploadStats.completed}/{uploadStats.total} files
                  </span>
                </div>
                <Progress value={overallProgress} className="mt-1 h-1.5" />
              </div>
            )}

            <div className="mt-2 max-h-[240px] overflow-y-auto">
              <ul className="divide-border divide-y rounded-md border">
                {files.map((file) => (
                  <li key={file.id} className="flex flex-col py-3 pr-2 pl-4 text-sm leading-6">
                    <div className="flex items-center justify-between">
                      <div className="flex w-0 flex-1 items-center">
                        {getFileIcon(file)}
                        <div className="ml-2 flex min-w-0 flex-1 gap-1">
                          <span
                            className={`truncate font-medium ${
                              file.status === FileStatus.ERROR ? "text-destructive" : ""
                            }`}>
                            {file.name}
                          </span>
                          <span className="text-muted-foreground shrink-0">
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
                      <div className="text-destructive mt-1 text-xs">{file.error}</div>
                    ) : (
                      file.status !== FileStatus.COMPLETE && (
                        <div className="mt-2 w-full">
                          <Progress value={file.progress} className="h-1.5" />
                          <div className="text-muted-foreground mt-1 text-xs">
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

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              files.length === 0 ||
              files.every((f) => f.status === FileStatus.ERROR) ||
              uploadInProgress
            }
            className="gap-2">
            {uploadInProgress ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
