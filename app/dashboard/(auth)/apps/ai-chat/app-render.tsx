"use client";

import React, { useRef, useState } from "react";
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
import { Message, MessageContent } from "@/components/ui/custom/prompt/message";
import { Markdown } from "@/components/ui/custom/prompt/markdown";
import { cn } from "@/lib/utils";
import { PromptLoader } from "@/components/ui/custom/prompt/loader";
import { PromptScrollButton } from "@/components/ui/custom/prompt/scroll-button";

const chatSuggestions = [
  "What's the latest tech trend?",
  "How does this work?",
  "Generate an image of a cat",
  "Generate a REST API with Express.js",
  "What’s the best UX for onboarding?"
];

export default function AppRender() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [isFirstResponse, setIsFirstResponse] = useState(false); // Understanding whether the conversation has started or not

  const [isStreaming, setIsStreaming] = useState(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamContentRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<
    { id: number; role: string; content: string; files?: File[] }[]
  >([]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

      setPrompt("");
      setFiles([]);

      await delay(2000);

      const fullResponse =
        "Fetching data in Next.js using getServerSideProps is straightforward. Here's a basic example:\n\n```ts\nexport async function getServerSideProps() {\n  const res = await fetch('https://api.example.com/data');\n  const data = await res.json();\n\n  return {\n    props: { data },\n  };\n}\n```\n\nThis function runs on the server before rendering the page and provides `data` as props.\nIt's ideal for dynamic data that changes often.\n\nWould you like to see an example using `getStaticProps` instead?";

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

  React.useEffect(() => {
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
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
      <ChatContainer
        className={cn("relative w-full flex-1 space-y-4 pe-2", { hidden: !isFirstResponse })}
        ref={containerRef}
        scrollToRef={bottomRef}>
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <Message
              key={message.id}
              className={message.role === "user" ? "justify-end" : "justify-start"}>
              <div
                className={cn("max-w-[85%] flex-1 sm:max-w-[75%]", {
                  "justify-end text-end": !isAssistant
                })}>
                {isAssistant ? (
                  <div className="bg-secondary text-foreground prose rounded-lg px-3 py-2">
                    <Markdown className={"space-y-4"}>{message.content}</Markdown>
                  </div>
                ) : message?.files && message.files.length > 0 ? (
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      {message.files.map((file, index) => (
                        <FileListItem key={index} index={index} file={file} dismiss={false} />
                      ))}
                    </div>
                    {message.content ? (
                      <MessageContent className="bg-primary text-primary-foreground inline-flex">
                        {message.content}
                      </MessageContent>
                    ) : null}
                  </div>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground inline-flex text-start">
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          );
        })}

        {isStreaming && (
          <div className="ps-2">
            <PromptLoader variant="pulse-dot" />
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

      <Input
        value={prompt}
        onValueChange={setPrompt}
        onSubmit={streamResponse}
        className="w-full max-w-(--breakpoint-md)">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {files.map((file, index) => (
              <FileListItem key={index} index={index} file={file} />
            ))}
          </div>
        )}

        <PromptInputTextarea placeholder="Ask me anything..." />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <PromptInputAction tooltip="Attach files">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Paperclip className="text-primary size-5" />
            </label>
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

      {/*Chat suggestions*/}
      {!isFirstResponse && (
        <div className="flex flex-wrap gap-2">
          {chatSuggestions.map((suggestion: string, key: number) => (
            <Suggestion key={key} onClick={() => setPrompt(suggestion)}>
              {suggestion}
            </Suggestion>
          ))}
        </div>
      )}
    </div>
  );
}
