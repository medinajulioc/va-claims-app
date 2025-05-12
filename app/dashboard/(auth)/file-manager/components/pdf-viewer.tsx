"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Search,
  Printer,
  Highlighter,
  StickyNote,
  Square,
  Underline,
  Hand
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { File as FileType } from "@/types/file-manager";
import useFileManagerStore from "@/store/useFileManagerStore";

interface PDFViewerProps {
  file: FileType;
}

export function PDFViewer({ file }: PDFViewerProps) {
  const {
    currentPage,
    zoom,
    rotation,
    annotationMode,
    annotationColor,
    setCurrentPage,
    nextPage,
    prevPage,
    setZoom,
    zoomIn,
    zoomOut,
    setRotation,
    rotateClockwise,
    rotateCounterClockwise,
    resetView,
    setAnnotationMode,
    setAnnotationColor
  } = useFileManagerStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data for this demo
  const totalPages = file.pageCount || 1;

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page)) {
      setCurrentPage(page);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="bg-muted flex items-center justify-between gap-2 rounded-t-lg border-b p-1">
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded border">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center px-1">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={handlePageChange}
                className="h-6 w-12 text-center"
              />
              <span className="text-muted-foreground mx-1 text-xs">/ {totalPages}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-2 flex items-center rounded border">
            <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Select value={String(zoom)} onValueChange={(val) => setZoom(parseFloat(val))}>
              <SelectTrigger className="h-8 w-24 border-0">
                <SelectValue placeholder={`${Math.round(zoom * 100)}%`}>
                  {Math.round(zoom * 100)}%
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">50%</SelectItem>
                <SelectItem value="0.75">75%</SelectItem>
                <SelectItem value="1">100%</SelectItem>
                <SelectItem value="1.25">125%</SelectItem>
                <SelectItem value="1.5">150%</SelectItem>
                <SelectItem value="2">200%</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-2 flex items-center rounded border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={rotateCounterClockwise}
                  className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={rotateClockwise} className="h-8 w-8">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate right</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center rounded border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={annotationMode === "highlight"}
                  onPressedChange={() =>
                    setAnnotationMode(annotationMode === "highlight" ? "none" : "highlight")
                  }
                  className="h-8 w-8">
                  <Highlighter className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Highlight</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={annotationMode === "underline"}
                  onPressedChange={() =>
                    setAnnotationMode(annotationMode === "underline" ? "none" : "underline")
                  }
                  className="h-8 w-8">
                  <Underline className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={annotationMode === "rectangle"}
                  onPressedChange={() =>
                    setAnnotationMode(annotationMode === "rectangle" ? "none" : "rectangle")
                  }
                  className="h-8 w-8">
                  <Square className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Rectangle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={annotationMode === "note"}
                  onPressedChange={() =>
                    setAnnotationMode(annotationMode === "note" ? "none" : "note")
                  }
                  className="h-8 w-8">
                  <StickyNote className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Add note</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={annotationMode === "none"}
                  onPressedChange={() => setAnnotationMode("none")}
                  className="h-8 w-8">
                  <Hand className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Hand tool</TooltipContent>
            </Tooltip>

            {annotationMode !== "none" && (
              <Select
                value={annotationColor}
                onValueChange={setAnnotationColor}
                defaultValue="#FFEB3B">
                <SelectTrigger className="h-8 w-8 border-0 p-0">
                  <SelectValue>
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: annotationColor }}
                    />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#FFEB3B">
                    <div className="mr-2 inline-block h-4 w-4 rounded-full bg-yellow-400" />
                    Yellow
                  </SelectItem>
                  <SelectItem value="#4CAF50">
                    <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-500" />
                    Green
                  </SelectItem>
                  <SelectItem value="#2196F3">
                    <div className="mr-2 inline-block h-4 w-4 rounded-full bg-blue-500" />
                    Blue
                  </SelectItem>
                  <SelectItem value="#F44336">
                    <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-500" />
                    Red
                  </SelectItem>
                  <SelectItem value="#9C27B0">
                    <div className="mr-2 inline-block h-4 w-4 rounded-full bg-purple-600" />
                    Purple
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="ml-2 flex items-center rounded border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search document</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="bg-muted/50 relative flex flex-1 items-center justify-center overflow-auto p-4">
        <div
          className="bg-background relative mx-auto shadow-md"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center",
            maxWidth: "100%",
            transition: "transform 0.2s ease-in-out"
          }}>
          {/* Show placeholder for demo */}
          {file.type === "pdf" ? (
            <div className="flex h-[842px] w-[595px] flex-col items-center justify-center rounded border p-8">
              <div className="bg-muted/30 mb-4 h-16 w-64 rounded" />
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-muted/20 mb-2 h-4 w-full rounded" />
              ))}
              <div className="relative mt-8 flex h-40 w-full items-center justify-center rounded bg-black/5">
                <div className="text-muted-foreground text-xs">
                  Page {currentPage} of PDF document
                </div>
                {file.annotations
                  ?.filter((a) => a.pageNumber === currentPage)
                  .map((annotation) => (
                    <div
                      key={annotation.id}
                      className="absolute"
                      style={{
                        left: `${annotation.position.x}%`,
                        top: `${annotation.position.y}%`,
                        width: annotation.position.width ? `${annotation.position.width}%` : "auto",
                        height: annotation.position.height
                          ? `${annotation.position.height}%`
                          : "auto",
                        backgroundColor:
                          annotation.type === "highlight" ? `${annotation.color}40` : "transparent",
                        borderBottom:
                          annotation.type === "underline"
                            ? `2px solid ${annotation.color}`
                            : "none",
                        border:
                          annotation.type === "rectangle" ? `2px solid ${annotation.color}` : "none"
                      }}>
                      {annotation.type === "note" && (
                        <div
                          className="h-6 w-6 rounded-full p-1"
                          style={{ backgroundColor: annotation.color }}>
                          <StickyNote className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <Badge className="mx-auto mt-8">VA Medical Record</Badge>
            </div>
          ) : (
            <div className="flex h-96 w-96 items-center justify-center rounded border">
              <p className="text-muted-foreground text-sm">
                This component is designed for PDF files.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
