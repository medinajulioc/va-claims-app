"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
  MarkdownControls
} from "@/components/ui/custom/prompt/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  Paperclip,
  SquareIcon,
  X,
  Type,
  FileText,
  ClipboardCheck,
  Percent,
  Stethoscope
} from "lucide-react";
import { Suggestion } from "@/components/ui/custom/prompt/suggestion";
import { ChatContainer } from "@/components/ui/custom/prompt/chat-container";
import { Message, MessageContent, MessageAvatar } from "@/components/ui/custom/prompt/message";
import { CfrMarkdown } from "@/components/ui/custom/prompt/cfr-markdown";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";

// Mock components for the ones that don't exist yet
const PromptLoader = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-primary size-2 animate-pulse rounded-full"></div>
    <div
      className="bg-primary size-2 animate-pulse rounded-full"
      style={{ animationDelay: "0.2s" }}></div>
    <div
      className="bg-primary size-2 animate-pulse rounded-full"
      style={{ animationDelay: "0.4s" }}></div>
  </div>
);

const FileUploadDialog = ({ customTrigger }: { customTrigger: React.ReactNode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div onClick={handleClick}>{customTrigger}</div>
      <input type="file" ref={fileInputRef} className="hidden" multiple />
    </>
  );
};

export default function AppRender() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [markdownMode, setMarkdownMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 4000;

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("chatDraft");
    if (savedDraft) {
      setPrompt(savedDraft);
    }
  }, []);

  // Save draft to localStorage when prompt changes
  useEffect(() => {
    localStorage.setItem("chatDraft", prompt);
  }, [prompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const streamResponse = () => {
    if (!prompt.trim() && files.length === 0) return;

    // Mock streaming response
    setIsLoading(true);
    setIsStopped(false);

    // Add user message
    const userMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: prompt,
        timestamp: new Date()
      }
    ]);

    // Clear the input and saved draft
    setPrompt("");
    localStorage.removeItem("chatDraft");

    // Mock assistant response after a delay
    setTimeout(() => {
      if (!isStopped) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              'This is a mock response to your message. In a real implementation, this would be streamed from an API. You can use **markdown** in your responses for better formatting.\n\n```javascript\nconst example = "This is a code block";\nconsole.log(example);\n```\n\nYou can also use:\n- Bullet points\n- For lists\n\nOr even [links](https://va.gov) to resources.',
            timestamp: new Date()
          }
        ]);
        setIsLoading(false);
      }
    }, 1500);
  };

  const stopResponse = () => {
    setIsLoading(false);
    setIsStopped(true);
  };

  const handleSuggestionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const suggestionText = e.currentTarget.textContent;
    if (suggestionText) {
      setPrompt(suggestionText);
    }
  };

  return (
    <div className="bg-card flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center space-y-4 rounded-lg border p-4 shadow-sm">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
        <ChatContainer
          className="mb-4 flex-1"
          empty={messages.length === 0}
          emptyState={
            <div className="animate-fadeIn flex h-full flex-col items-center justify-center">
              <div className="bg-primary/10 rounded-full p-2">
                <div className="bg-primary/20 flex size-7 items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-2 max-w-[450px] space-y-1 text-center">
                <h3 className="text-lg font-semibold">Welcome to VA Claims Assistant</h3>
                <p className="text-muted-foreground text-xs">
                  I&apos;m here to help with your VA disability claims questions. You can ask about
                  the claims process, evidence requirements, or specific conditions.
                </p>
                <div className="mt-2">
                  <h4 className="mb-1.5 text-sm font-medium">Popular questions:</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div
                      className="bg-muted/50 hover:bg-muted border-border/40 hover:border-border/60 flex cursor-pointer flex-col items-start rounded-lg border p-2.5 shadow-sm transition-all hover:shadow-md"
                      onClick={() => setPrompt("How do I file a VA disability claim?")}>
                      <div className="flex w-full items-center">
                        <div className="bg-primary/10 mr-1.5 rounded-full p-1">
                          <FileText className="text-primary size-3" />
                        </div>
                        <div className="text-sm font-medium">Claims Process</div>
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        How do I file a VA disability claim?
                      </div>
                    </div>
                    <div
                      className="bg-muted/50 hover:bg-muted border-border/40 hover:border-border/60 flex cursor-pointer flex-col items-start rounded-lg border p-2.5 shadow-sm transition-all hover:shadow-md"
                      onClick={() => setPrompt("What evidence do I need for a PTSD claim?")}>
                      <div className="flex w-full items-center">
                        <div className="bg-primary/10 mr-1.5 rounded-full p-1">
                          <ClipboardCheck className="text-primary size-3" />
                        </div>
                        <div className="text-sm font-medium">Evidence Requirements</div>
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        What evidence do I need for a PTSD claim?
                      </div>
                    </div>
                    <div
                      className="bg-muted/50 hover:bg-muted border-border/40 hover:border-border/60 flex cursor-pointer flex-col items-start rounded-lg border p-2.5 shadow-sm transition-all hover:shadow-md"
                      onClick={() => setPrompt("How are VA disability ratings calculated?")}>
                      <div className="flex w-full items-center">
                        <div className="bg-primary/10 mr-1.5 rounded-full p-1">
                          <Percent className="text-primary size-3" />
                        </div>
                        <div className="text-sm font-medium">Disability Ratings</div>
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        How are VA disability ratings calculated?
                      </div>
                    </div>
                    <div
                      className="bg-muted/50 hover:bg-muted border-border/40 hover:border-border/60 flex cursor-pointer flex-col items-start rounded-lg border p-2.5 shadow-sm transition-all hover:shadow-md"
                      onClick={() => setPrompt("What is a C&P exam and how should I prepare?")}>
                      <div className="flex w-full items-center">
                        <div className="bg-primary/10 mr-1.5 rounded-full p-1">
                          <Stethoscope className="text-primary size-3" />
                        </div>
                        <div className="text-sm font-medium">Exam Preparation</div>
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        What is a C&P exam and how should I prepare?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }>
          {messages.map((message) => (
            <Message
              key={message.id}
              isUser={message.role === "user"}
              timestamp={message.timestamp}>
              {message.role === "user" ? null : (
                <MessageAvatar src="/images/assistant-avatar.png" alt="Assistant" fallback="AI" />
              )}
              <MessageContent
                markdown={message.role === "assistant"}
                isUser={message.role === "user"}>
                {message.content}
              </MessageContent>
              {message.role === "user" ? (
                <MessageAvatar src="/images/user-avatar.png" alt="You" fallback="You" />
              ) : null}
            </Message>
          ))}
          {isLoading && (
            <Message>
              <MessageAvatar src="/images/assistant-avatar.png" alt="Assistant" fallback="AI" />
              <MessageContent>
                <PromptLoader />
              </MessageContent>
            </Message>
          )}
        </ChatContainer>

        <Input
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={streamResponse}
          className="w-full">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                  <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => removeFile(index)}>
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isPreviewMode && markdownMode && prompt ? (
            <div className="border-border mb-2 rounded-md border p-3">
              <Markdown>{prompt}</Markdown>
            </div>
          ) : null}

          <div className="relative">
            <PromptInputTextarea
              className="min-h-[80px] pr-12"
              placeholder="Type your message here..."
              disabled={isLoading}
            />
          </div>

          <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <PromptInputAction tooltip="Attach files">
                <FileUploadDialog
                  customTrigger={
                    <div className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl">
                      <Paperclip className="text-primary size-5" />
                    </div>
                  }
                />
              </PromptInputAction>

              <PromptInputAction tooltip={markdownMode ? "Disable markdown" : "Enable markdown"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-2xl", markdownMode && "bg-secondary")}
                  onClick={() => setMarkdownMode(!markdownMode)}>
                  <Type className="text-primary size-4" />
                </Button>
              </PromptInputAction>

              {markdownMode && (
                <div className="hidden sm:flex">
                  <MarkdownControls />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <MessageLengthIndicator
                currentLength={prompt.length}
                maxLength={MAX_MESSAGE_LENGTH}
                className="mr-2"
              />

              {isLoading ? (
                <Button type="button" size="icon" variant="destructive" onClick={stopResponse}>
                  <SquareIcon className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    (!prompt.trim() && files.length === 0) || prompt.length > MAX_MESSAGE_LENGTH
                  }>
                  <ArrowUpIcon className="size-4" />
                </Button>
              )}
            </div>
          </PromptInputActions>
        </Input>

        {!isLoading && messages.length === 0 && (
          <div className="grid grid-cols-3 gap-2 pt-3">
            <Suggestion onClick={handleSuggestionClick}>
              How do I file a VA disability claim?
            </Suggestion>
            <Suggestion onClick={handleSuggestionClick}>
              What evidence do I need for a PTSD claim?
            </Suggestion>
            <Suggestion onClick={handleSuggestionClick}>
              How are VA disability ratings calculated?
            </Suggestion>
          </div>
        )}
      </div>
    </div>
  );
}
