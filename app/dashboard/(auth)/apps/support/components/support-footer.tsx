"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import { MessageLengthIndicator } from "@/components/ui/custom/prompt/message-length-indicator";

interface SupportFooterProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export function SupportFooter({
  onSendMessage,
  placeholder = "Type a message..."
}: SupportFooterProps) {
  const [message, setMessage] = useState("");
  const MAX_MESSAGE_LENGTH = 2000; // Mock limit for now

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t p-4">
      <div className="relative">
        <Input
          type="text"
          className="bg-background/20 focus-visible:bg-background/30 focus-visible:ring-primary/30 h-14 border-transparent px-4 pe-32 font-medium text-white shadow-transparent! ring-transparent! transition-all duration-200 ease-in-out placeholder:text-gray-300/70 focus-visible:ring-[4px] lg:pe-56"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          style={{ color: "white", caretColor: "white" }}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <div className="absolute end-4 flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="bg-background/30 text-muted-foreground hover:bg-background/50 hover:text-foreground h-9 w-9 rounded-full">
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleSendMessage}
            disabled={!message.trim()}>
            <ArrowUp className="size-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      <MessageLengthIndicator currentLength={message.length} maxLength={MAX_MESSAGE_LENGTH} />
      <div className="text-muted-foreground mt-2 text-xs">
        <span>
          Supports <strong>markdown</strong> formatting: **bold**, *italic*, `code`, ```code
          blocks```
        </span>
      </div>
    </div>
  );
}
