"use client";

import { useState } from "react";
import { PreviewSettings, PreviewResponse } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquare, Zap } from "lucide-react";

interface PromptPreviewProps {
  promptContent: string;
  previewSettings: PreviewSettings;
  onPreviewSettingsChange: (settings: PreviewSettings) => void;
  previewResponse: PreviewResponse | null;
  isGenerating: boolean;
  onGeneratePreview: () => void;
}

export function PromptPreview({
  promptContent,
  previewSettings,
  onPreviewSettingsChange,
  previewResponse,
  isGenerating,
  onGeneratePreview
}: PromptPreviewProps) {
  // Handle changes to preview settings
  const handleSettingsChange = (field: keyof PreviewSettings, value: string) => {
    onPreviewSettingsChange({
      ...previewSettings,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userContext">User Context</Label>
            <Textarea
              id="userContext"
              value={previewSettings.userContext}
              onChange={(e) => handleSettingsChange("userContext", e.target.value)}
              placeholder="Describe the user context for this preview"
              rows={2}
            />
            <p className="text-muted-foreground text-xs">
              Provide context about the user's situation to help generate a relevant response
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userMessage">User Message</Label>
            <Textarea
              id="userMessage"
              value={previewSettings.userMessage}
              onChange={(e) => handleSettingsChange("userMessage", e.target.value)}
              placeholder="Enter a sample user message"
              rows={2}
            />
            <p className="text-muted-foreground text-xs">
              Enter a sample message that a user might send to the AI assistant
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onGeneratePreview}
          disabled={isGenerating || !previewSettings.userMessage.trim()}
          className="w-full sm:w-auto">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating preview...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Preview Response
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Preview Output</Label>
        <Card className="overflow-hidden rounded-md border">
          <CardContent className="p-0">
            {previewResponse ? (
              <div className="flex flex-col">
                <div className="bg-muted border-b p-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">AI Assistant</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(previewResponse.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[400px] min-h-[200px] overflow-y-auto p-4 text-sm whitespace-pre-wrap">
                  {previewResponse.message}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-[300px] items-center justify-center p-4 text-center">
                {isGenerating ? (
                  <div className="space-y-2">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    <p>Generating preview response...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      Click the "Generate Preview Response" button to see how the AI would respond.
                    </p>
                    <p className="text-xs">
                      The preview uses your system prompt, user context, and message to generate a
                      simulated response.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-xs">
          <p>
            This is a simulated preview based on mock data. In production, this would use the actual
            AI model with your system prompt to generate a response.
          </p>
        </div>
      </div>
    </div>
  );
}
