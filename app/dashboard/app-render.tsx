"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from "@/components/ui/custom/prompt/input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Paperclip, SquareIcon, X } from "lucide-react";
import { Suggestion } from "@/components/ui/custom/prompt/suggestion";
import { ChatContainer } from "@/components/ui/custom/prompt/chat-container";
import { Message, MessageContent, MessageAvatar } from "@/components/ui/custom/prompt/message";
import { CfrMarkdown } from "@/components/ui/custom/prompt/cfr-markdown";
import { cn } from "@/lib/utils";
import { PromptLoader } from "@/components/ui/custom/prompt/loader";
import { PromptScrollButton } from "@/components/ui/custom/prompt/scroll-button";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import { RegulationSearchResults } from "@/components/ui/custom/prompt/regulation-search-results";
import { ecfrService } from "@/lib/services/ecfr-service";
import { RegulationSummary } from "@/lib/services/ecfr-service/types";
import { isCfrQuery, extractRegulationSearchTerms } from "@/lib/utils/cfr-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/store/useUserStore";
import { generateAvatarFallback } from "@/lib/utils";

const chatSuggestions = [
  "How do I file a VA disability claim?",
  "What evidence supports a PTSD claim?",
  "Conditions qualifying for Agent Orange presumptive",
  "How to appeal a VA denial decision",
  "What happens during a C&P exam?"
];

// Add some CFR-specific suggestions
const cfrSuggestions = [
  "What does 38 CFR 3.303 say about service connection?",
  "Explain 38 CFR 3.309 presumptive conditions",
  "What are the mental disorder ratings in 38 CFR 4.130?",
  "How does 38 CFR define Agent Orange exposure?"
];

// Combine suggestions, but prioritize regular ones first
const allSuggestions = [...chatSuggestions, ...cfrSuggestions];

export default function AppRender() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [isFirstResponse, setIsFirstResponse] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamContentRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<
    { id: number; role: string; content: string; files?: File[] }[]
  >([]);

  // State for CFR regulation search results
  const [regulationResults, setRegulationResults] = useState<RegulationSummary[]>([]);
  const [isSearchingRegulations, setIsSearchingRegulations] = useState(false);

  // Add this line to get user information for avatars
  const { firstName, lastName } = useUserStore();

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Check if a query is related to CFR and search for regulations
  const searchRegulations = async (query: string) => {
    if (!isCfrQuery(query)) return;

    setIsSearchingRegulations(true);
    try {
      const searchTerms = extractRegulationSearchTerms(query);
      const results = await ecfrService.searchRegulations(searchTerms);
      setRegulationResults(results.results.slice(0, 3)); // Limit to top 3 results
    } catch (error) {
      console.error("Error searching regulations:", error);
    } finally {
      setIsSearchingRegulations(false);
    }
  };

  // Include regulation in response
  const includeRegulationInResponse = (regulation: RegulationSummary) => {
    // In a real implementation, this would modify the AI response
    // For now, we'll just append it to the last assistant message
    const lastAssistantMessageIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === "assistant");

    if (lastAssistantMessageIndex >= 0) {
      const actualIndex = messages.length - 1 - lastAssistantMessageIndex;
      const updatedMessages = [...messages];

      const citationText = `\n\n**Relevant Regulation:**\n\n${regulation.heading}\n\n${regulation.content}\n\nSource: [${regulation.heading}](${regulation.url})`;

      updatedMessages[actualIndex] = {
        ...updatedMessages[actualIndex],
        content: updatedMessages[actualIndex].content + citationText
      };

      setMessages(updatedMessages);
      setRegulationResults([]); // Clear results after including one
    }
  };

  const streamResponse = async () => {
    if (isStreaming) return;

    if (prompt.trim() || files.length > 0) {
      setIsFirstResponse(true);
      setIsStreaming(true);

      const newMessageId = messages.length + 1;
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId,
          role: "user",
          content: prompt,
          files: files
        }
      ]);

      // Search for regulations if the query is CFR-related
      await searchRegulations(prompt);

      setPrompt("");
      setFiles([]);

      await delay(1000);

      // Generate a mock response based on the query type
      let fullResponse = "";

      if (isCfrQuery(prompt)) {
        fullResponse = `Based on Title 38 of the Code of Federal Regulations (CFR), which covers VA benefits, I can provide some information about your question.

The relevant section is 38 CFR 3.303, which outlines the principles of service connection. According to this regulation, service connection means that evidence establishes that a particular injury or disease resulting in disability was incurred during active military service.

For a claim to be successful, you generally need:
1. A current diagnosed disability
2. An in-service event, injury, or illness
3. A medical nexus linking the current disability to the in-service occurrence

The regulation specifically states that service connection may be granted for any disease diagnosed after discharge when all the evidence establishes that the disease was incurred in service.

Would you like me to provide more specific information about any part of this regulation?`;
      } else {
        fullResponse = `To file a VA disability claim, you'll need to follow these steps:

1. **Gather evidence** - Collect medical records, service records, and any supporting documentation for your claim.

2. **Complete VA Form 21-526EZ** - This is the Application for Disability Compensation and Related Compensation Benefits form.

3. **Submit your claim** - You can file online through VA.gov (fastest method), by mail, in person at a VA regional office, or with an accredited representative.

4. **Attend C&P exam** - If requested by the VA, you'll need to attend a Compensation & Pension examination to evaluate your condition.

5. **Wait for a decision** - The VA will review your claim and send a decision letter with their determination.

The process typically takes 3-5 months, though some claims may take longer depending on complexity and evidence needed. Would you like more specific information about any of these steps?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId + 1,
          role: "assistant",
          content: ""
        }
      ]);

      let charIndex = 0;
      streamContentRef.current = "";

      streamIntervalRef.current = setInterval(() => {
        if (charIndex < fullResponse.length) {
          streamContentRef.current += fullResponse[charIndex];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newMessageId + 1 ? { ...msg, content: streamContentRef.current } : msg
            )
          );
          charIndex++;
        } else {
          clearInterval(streamIntervalRef.current!);
          setIsStreaming(false);
        }
      }, 30);
    }
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  const FileListItem = ({
    file,
    dismiss = true,
    index
  }: {
    file: File;
    dismiss?: boolean;
    index: number;
  }) => (
    <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
      <Paperclip className="size-4" />
      <span className="max-w-[120px] truncate">{file.name}</span>
      {dismiss && (
        <button
          onClick={() => handleRemoveFile(index)}
          className="hover:bg-secondary/50 rounded-full p-1">
          <X className="size-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-card flex h-[calc(100vh-16rem)] w-full flex-col items-center justify-center space-y-4 rounded-lg border p-4 shadow-sm">
      <ChatContainer
        className={cn("relative w-full flex-1 space-y-4 pe-2", { hidden: !isFirstResponse })}
        ref={containerRef}
        scrollToRef={bottomRef}>
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <Message
              key={message.id}
              className={cn("items-start", isAssistant ? "" : "justify-end")}>
              {isAssistant && (
                <MessageAvatar
                  src="/images/avatars/ai-assistant.png"
                  alt="AI Assistant"
                  fallback="AI"
                />
              )}

              <div className={cn("flex flex-col gap-2", isAssistant ? "" : "items-end")}>
                <MessageContent markdown={true} className={isAssistant ? "" : "bg-primary/10"}>
                  {message.content}
                </MessageContent>

                {message.files && message.files.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.files.map((file, index) => (
                      <FileListItem key={index} file={file} dismiss={false} index={index} />
                    ))}
                  </div>
                )}
              </div>

              {!isAssistant && (
                <MessageAvatar
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`}
                  alt="User"
                  fallback={generateAvatarFallback(`${firstName} ${lastName}`)}
                />
              )}
            </Message>
          );
        })}

        {isStreaming && (
          <div className="ps-2">
            <PromptLoader variant="pulse-dot" />
          </div>
        )}

        {/* Show regulation search results if available */}
        {regulationResults.length > 0 && !isStreaming && (
          <div className="ps-2 pt-2">
            <RegulationSearchResults
              results={regulationResults}
              onSelectRegulation={includeRegulationInResponse}
            />
          </div>
        )}

        {isSearchingRegulations && !isStreaming && (
          <div className="ps-2">
            <p className="text-muted-foreground text-sm">Searching regulations...</p>
          </div>
        )}
      </ChatContainer>

      <div className="fixed right-4 bottom-4">
        <PromptScrollButton
          containerRef={containerRef}
          scrollRef={bottomRef}
          className="shadow-sm"
        />
      </div>

      <Input value={prompt} onValueChange={setPrompt} onSubmit={streamResponse} className="w-full">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {files.map((file, index) => (
              <FileListItem key={index} file={file} dismiss={true} index={index} />
            ))}
          </div>
        )}

        <PromptInputTextarea placeholder="Ask about VA claims or research..." />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <PromptInputAction tooltip="Attach files">
            <FileUploadDialog
              customTrigger={
                <div className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl">
                  <Paperclip className="text-primary size-5" />
                </div>
              }
            />
          </PromptInputAction>

          <PromptInputAction tooltip={isStreaming ? "Stop generation" : "Send message"}>
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={streamResponse}>
              {isStreaming ? <SquareIcon /> : <ArrowUpIcon />}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </Input>

      {!isFirstResponse && (
        <div className="mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-3 pt-4">
          {allSuggestions.map((suggestion: string, key: number) => (
            <Suggestion
              key={key}
              variant="outline"
              size="lg"
              className="border-primary/30 hover:border-primary/80 text-sm sm:text-base"
              onClick={() => {
                setPrompt(suggestion);
                streamResponse();
              }}>
              {suggestion}
            </Suggestion>
          ))}
        </div>
      )}
    </div>
  );
}
