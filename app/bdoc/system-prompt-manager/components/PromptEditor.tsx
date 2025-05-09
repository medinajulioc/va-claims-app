"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { SystemPrompt, SystemPromptVersion } from "../data/types";
import { PromptVersionHistory } from "./PromptVersionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savePrompt, savePromptVersion } from "../data/actions";

interface PromptEditorProps {
  prompt: SystemPrompt;
  onSave: (prompt: SystemPrompt) => void;
}

export const PromptEditor = ({ prompt, onSave }: PromptEditorProps) => {
  const [content, setContent] = useState(prompt.content);
  const [hasChanged, setHasChanged] = useState(false);
  const [changeComment, setChangeComment] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("edit");

  useEffect(() => {
    setContent(prompt.content);
    setHasChanged(false);
  }, [prompt]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanged(e.target.value !== prompt.content);
  };

  const handleSave = () => {
    if (!changeComment.trim()) {
      toast.error("Please provide a change comment");
      return;
    }

    // Create a new version based on current content
    const newVersion: SystemPromptVersion = {
      id: nanoid(),
      promptId: prompt.id,
      versionNumber:
        prompt.versions.length > 0
          ? Math.max(...prompt.versions.map((v) => v.versionNumber)) + 1
          : 1,
      content,
      timestamp: new Date().toISOString(),
      author: "Current User", // In a real app, use the actual user
      changeComment,
      isActive: true
    };

    // Mark previous active version as inactive
    const updatedVersions = prompt.versions.map((version) => ({
      ...version,
      isActive: false
    }));

    // Add the new version
    updatedVersions.push(newVersion);

    // Update the prompt with new content and version
    const updatedPrompt = {
      ...prompt,
      content,
      lastUpdated: new Date().toISOString(),
      versions: updatedVersions
    };

    // Save to backend (mock)
    savePrompt(updatedPrompt);
    savePromptVersion(newVersion);

    // Update state
    onSave(updatedPrompt);
    setHasChanged(false);
    setChangeComment("");
    setIsSaveDialogOpen(false);
    toast.success("Prompt saved successfully");
  };

  const handleRestore = (version: SystemPromptVersion) => {
    // Ask for confirmation or change comment before restoring
    if (window.confirm(`Restore version ${version.versionNumber}?`)) {
      setContent(version.content);
      setHasChanged(version.content !== prompt.content);
      setChangeComment(`Restored from version ${version.versionNumber}`);

      if (version.content !== prompt.content) {
        setIsSaveDialogOpen(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{prompt.name}</CardTitle>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="history">Version History ({prompt.versions.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit">
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="prompt-content">Content</Label>
                  <Textarea
                    id="prompt-content"
                    value={content}
                    onChange={handleContentChange}
                    className="min-h-[400px] font-mono"
                    placeholder="Enter your system prompt content..."
                  />
                </div>
                <div className="text-muted-foreground text-sm">
                  <p>Last updated: {new Date(prompt.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {hasChanged && <span className="text-sm text-yellow-500">*Unsaved changes</span>}
              </div>
              <Button disabled={!hasChanged} onClick={() => setIsSaveDialogOpen(true)}>
                Save Changes
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="history">
            <CardContent>
              <PromptVersionHistory
                versions={prompt.versions}
                onRestore={handleRestore}
                currentContent={prompt.content}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="change-comment">Change Comment (Required)</Label>
              <Input
                id="change-comment"
                placeholder="Describe your changes..."
                value={changeComment}
                onChange={(e) => setChangeComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!changeComment.trim()}>
              Save Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
