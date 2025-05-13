"use client";

import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Bold, Italic, Code } from "lucide-react";
import { Markdown } from "./markdown";

type PromptInputContextType = {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
  markdownMode: boolean;
  setMarkdownMode: (value: boolean) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (value: boolean) => void;
  insertMarkdown: (prefix: string, suffix?: string) => void;
};

const PromptInputContext = createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
  markdownMode: false,
  setMarkdownMode: () => {},
  isPreviewMode: false,
  setIsPreviewMode: () => {},
  insertMarkdown: () => {}
});

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a Input");
  }
  return context;
}

type PromptInputProps = {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  markdownMode?: boolean;
  onMarkdownModeChange?: (value: boolean) => void;
};

function Input({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  markdownMode = false,
  onMarkdownModeChange
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const [internalMarkdownMode, setInternalMarkdownMode] = useState(markdownMode);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleMarkdownModeChange = (newValue: boolean) => {
    setInternalMarkdownMode(newValue);
    onMarkdownModeChange?.(newValue);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = internalValue.substring(start, end);

    const newValue =
      internalValue.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      internalValue.substring(end);

    handleChange(newValue);

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled: isLoading,
          markdownMode: internalMarkdownMode,
          setMarkdownMode: handleMarkdownModeChange,
          isPreviewMode,
          setIsPreviewMode,
          insertMarkdown
        }}>
        <div
          className={cn("border-input bg-background rounded-3xl border p-2 shadow-xs", className)}>
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean;
} & React.ComponentProps<typeof Textarea>;

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled, isPreviewMode, markdownMode } =
    usePromptInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (disableAutosize) return;

    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  if (isPreviewMode && markdownMode) {
    return (
      <div
        className={cn(
          "min-h-[44px] w-full rounded border-none bg-transparent p-2 shadow-none outline-none",
          "text-foreground overflow-y-auto dark:text-white",
          className
        )}
        style={{ maxHeight }}>
        <Markdown>{value}</Markdown>
      </div>
    );
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        "text-foreground placeholder:text-muted-foreground dark:text-white",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  );
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>;

function PromptInputActions({ children, className, ...props }: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

type PromptInputActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function MarkdownControls() {
  const { markdownMode, setMarkdownMode, isPreviewMode, setIsPreviewMode, insertMarkdown } =
    usePromptInput();

  if (!markdownMode) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        onClick={() => insertMarkdown("**", "**")}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        onClick={() => insertMarkdown("*", "*")}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        onClick={() => insertMarkdown("`", "`")}>
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        onClick={() => setIsPreviewMode(!isPreviewMode)}>
        {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export { Input, PromptInputTextarea, PromptInputActions, PromptInputAction, MarkdownControls };
