"use client";

import { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize,
  Download,
  Printer,
  Crop,
  ImageIcon,
  Scan,
  Highlighter,
  Square,
  StickyNote,
  Hand,
  RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { File as FileType, DocumentQuality } from "@/types/file-manager";
import useFileManagerStore from "@/store/useFileManagerStore";

interface ImageViewerProps {
  file: FileType;
}

export function ImageViewer({ file }: ImageViewerProps) {
  const {
    zoom,
    rotation,
    annotationMode,
    annotationColor,
    setZoom,
    zoomIn,
    zoomOut,
    setRotation,
    rotateClockwise,
    rotateCounterClockwise,
    resetView,
    setAnnotationMode,
    setAnnotationColor,
    addAnnotation
  } = useFileManagerStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Update file with mock dimensions if not set
  useEffect(() => {
    if (!file.dimensions && imageRef.current) {
      const width = imageRef.current.naturalWidth || 800;
      const height = imageRef.current.naturalHeight || 600;
      setImageDimensions({ width, height });
    } else if (file.dimensions) {
      setImageDimensions(file.dimensions);
    }
  }, [file]);

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

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (annotationMode !== "none") {
      // Handling annotation click
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Add annotation
        if (file.id) {
          addAnnotation(file.id, {
            type: annotationMode,
            pageNumber: 1, // For images, always page 1
            color: annotationColor,
            position: {
              x,
              y,
              width: annotationMode === "rectangle" ? 10 : undefined,
              height: annotationMode === "rectangle" ? 10 : undefined
            },
            content: annotationMode === "note" ? "New note" : undefined
          });
        }
      }
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || annotationMode !== "none") return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Determine image quality indicator
  const imageQuality = file.documentQuality || DocumentQuality.MEDIUM;
  const qualityColor = {
    [DocumentQuality.LOW]: "bg-red-500",
    [DocumentQuality.MEDIUM]: "bg-yellow-500",
    [DocumentQuality.HIGH]: "bg-green-500"
  };

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="bg-muted flex items-center justify-between gap-2 rounded-t-lg border-b p-1">
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded border">
            <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>

            <div className="w-32 px-2">
              <Slider
                value={[zoom * 100]}
                min={25}
                max={300}
                step={5}
                onValueChange={(value) => setZoom(value[0] / 100)}
                className="w-full"
              />
            </div>

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

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetView} className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
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
              <TooltipContent>Highlight area</TooltipContent>
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
              <TooltipContent>Pan tool</TooltipContent>
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
                  <Crop className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Crop image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Scan className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enhance scan</TooltipContent>
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

      {/* Image Viewer */}
      <div
        className="bg-muted/50 relative flex flex-1 items-center justify-center overflow-hidden p-4"
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          cursor: isDragging ? "grabbing" : annotationMode === "none" ? "grab" : "crosshair"
        }}>
        <div
          className="bg-background relative mx-auto shadow-md"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out"
          }}>
          {/* Show image or placeholder */}
          {file.type === "jpg" || file.type === "png" ? (
            <>
              <img
                ref={imageRef}
                src={file.url || "/placeholder-image.jpg"}
                alt={file.name}
                className="h-auto max-h-full w-auto max-w-full rounded border object-contain"
                style={{
                  maxWidth: `${imageDimensions.width}px`,
                  maxHeight: `${imageDimensions.height}px`
                }}
              />
              {/* Annotations overlay */}
              <div className="pointer-events-none absolute inset-0">
                {file.annotations
                  ?.filter((a) => a.pageNumber === 1)
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
            </>
          ) : (
            <div className="flex h-96 w-96 items-center justify-center rounded border">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="text-muted-foreground h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  This component is designed for image files.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Image quality indicator */}
        <div className="absolute right-4 bottom-4 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <div className={`mr-1.5 h-2 w-2 rounded-full ${qualityColor[imageQuality]}`} />
            Image Quality: {imageQuality}
          </Badge>
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {Math.round(zoom * 100)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
