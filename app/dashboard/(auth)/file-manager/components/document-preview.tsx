"use client";

import { useState } from "react";
import { File, Eye, FileText, Info, Download, Star, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { File as FileType, FileType as FileTypeEnum } from "@/types/file-manager";
import { formatFileSize } from "@/lib/utils/file-utils";
import { CategorySelector } from "./category-selector";
import { TagInput } from "./tag-input";
import useFileManagerStore from "@/store/useFileManagerStore";
import { PDFViewer } from "./pdf-viewer";
import { ImageViewer } from "./image-viewer";

export interface DocumentPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType | null;
}

export function DocumentPreview({ open, onOpenChange, file }: DocumentPreviewProps) {
  const { toggleFileStarred, deleteFile } = useFileManagerStore();
  const [activeTab, setActiveTab] = useState("preview");

  if (!file) {
    return null;
  }

  const handleDelete = () => {
    deleteFile(file.id);
    onOpenChange(false);
  };

  const handleStarToggle = () => {
    toggleFileStarred(file.id);
  };

  // Function to render appropriate viewer based on file type
  const renderPreviewContent = () => {
    switch (file.type) {
      case FileTypeEnum.PDF:
        return <PDFViewer file={file} />;
      case FileTypeEnum.JPG:
      case FileTypeEnum.PNG:
        return <ImageViewer file={file} />;
      default:
        return (
          <div className="flex h-96 flex-col items-center justify-center p-8">
            <File className="text-muted-foreground mb-4 h-20 w-20" />
            <h3 className="mb-2 text-xl font-semibold">{file.name}</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Preview not available for this file type
            </p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        <DialogHeader className="bg-muted flex flex-row items-center justify-between p-4">
          <div className="flex flex-1 items-center gap-2">
            <DialogTitle className="mr-auto text-lg">{file.name}</DialogTitle>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStarToggle}
              className={file.starred ? "text-yellow-500" : ""}>
              <Star className="h-4 w-4" fill={file.starred ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="preview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-[80vh]">
          <div className="bg-muted border-b px-4">
            <TabsList className="h-12 bg-transparent">
              <TabsTrigger value="preview" className="data-[state=active]:bg-background">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-background">
                <Info className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-background">
                <FileText className="mr-2 h-4 w-4" />
                Extracted Text
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Preview Tab */}
          <TabsContent value="preview" className="h-full">
            {renderPreviewContent()}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="h-full p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* File Information */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">File Information</h3>
                <div className="rounded-lg border">
                  <div className="border-b px-4 py-3">
                    <span className="text-muted-foreground text-sm font-medium">File Name</span>
                    <p className="font-medium">{file.name}</p>
                  </div>
                  <div className="border-b px-4 py-3">
                    <span className="text-muted-foreground text-sm font-medium">Type</span>
                    <p className="font-medium">{file.type.toUpperCase()}</p>
                  </div>
                  <div className="border-b px-4 py-3">
                    <span className="text-muted-foreground text-sm font-medium">Size</span>
                    <p className="font-medium">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="border-b px-4 py-3">
                    <span className="text-muted-foreground text-sm font-medium">Date Added</span>
                    <p className="font-medium">
                      {file.uploadDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="border-b px-4 py-3">
                    <span className="text-muted-foreground text-sm font-medium">Last Modified</span>
                    <p className="font-medium">
                      {file.lastModified
                        ? file.lastModified.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                        : "Not available"}
                    </p>
                  </div>
                  {file.pageCount && (
                    <div className="border-b px-4 py-3">
                      <span className="text-muted-foreground text-sm font-medium">Pages</span>
                      <p className="font-medium">{file.pageCount}</p>
                    </div>
                  )}
                  {file.dimensions && (
                    <div className="px-4 py-3">
                      <span className="text-muted-foreground text-sm font-medium">Dimensions</span>
                      <p className="font-medium">{`${file.dimensions.width} × ${file.dimensions.height}px`}</p>
                    </div>
                  )}
                </div>

                {/* Document Quality */}
                {file.documentQuality && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-semibold">Document Quality</h4>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="relative h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            file.documentQuality === "high"
                              ? "w-full bg-green-500"
                              : file.documentQuality === "medium"
                                ? "w-2/3 bg-yellow-500"
                                : "w-1/3 bg-red-500"
                          }`}
                        />
                      </div>
                      <span className="capitalize">{file.documentQuality}</span>
                    </div>
                  </div>
                )}

                {/* Annotations summary */}
                {file.annotations && file.annotations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-semibold">Annotations</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="font-normal">
                        {file.annotations.filter((a) => a.type === "highlight").length} Highlights
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {file.annotations.filter((a) => a.type === "note").length} Notes
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {file.annotations.filter((a) => a.type === "rectangle").length} Rectangles
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {file.annotations.filter((a) => a.type === "underline").length} Underlines
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories and Tags */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Categories and Tags</h3>
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <h4 className="mb-2 text-sm font-medium">Categories</h4>
                    <CategorySelector fileId={file.id} selectedCategoryIds={file.categoryIds} />
                  </div>
                  <div className="p-4">
                    <h4 className="mb-2 text-sm font-medium">Tags</h4>
                    <TagInput fileId={file.id} selectedTagIds={file.tagIds} />
                  </div>
                </div>

                {/* Metadata */}
                {file.metadata && Object.keys(file.metadata).length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-semibold">Metadata</h3>
                    <div className="rounded-lg border">
                      {Object.entries(file.metadata).map(([key, value]) => (
                        <div key={key} className="border-b px-4 py-3 last:border-0">
                          <span className="text-muted-foreground text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <p className="font-medium">
                            {typeof value === "object" ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="h-full">
            <div className="flex h-full flex-col">
              {file.content ? (
                <ScrollArea className="h-full w-full p-6">
                  <div className="mx-auto max-w-4xl">
                    <pre className="font-sans break-words whitespace-pre-wrap">{file.content}</pre>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8">
                  <FileText className="text-muted-foreground mb-4 h-16 w-16" />
                  <h3 className="mb-2 text-lg font-medium">No text content available</h3>
                  <p className="text-muted-foreground text-center">
                    This file does not have any extracted text content or OCR processing has not
                    been completed.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
