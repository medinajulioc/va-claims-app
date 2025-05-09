"use client";

import { useState } from "react";
import { SystemPrompt, SystemPromptCategory, PreviewSettings, PreviewResponse } from "../types";
import { MinimalTiptapEditor } from "@/components/ui/custom/minimal-tiptap";
import { Content } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit,
  Plus,
  Save,
  Tag as TagIcon,
  X
} from "lucide-react";
import { PromptPreview } from "./prompt-preview";

interface PromptEditorProps {
  prompt: SystemPrompt;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedPrompt: SystemPrompt) => void;
  onCancel: () => void;
}

export function PromptEditor({ prompt, isEditing, onEdit, onSave, onCancel }: PromptEditorProps) {
  const [editedPrompt, setEditedPrompt] = useState<SystemPrompt>(prompt);
  const [activeEditorTab, setActiveEditorTab] = useState<string>("edit");
  const [newTag, setNewTag] = useState<string>("");
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    userContext: "User is a veteran looking for help with a disability claim.",
    userMessage: "Can you help me understand how to file a disability claim?"
  });
  const [previewResponse, setPreviewResponse] = useState<PreviewResponse | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);

  // Handler for updating basic prompt details
  const handleChange = (field: keyof SystemPrompt, value: any) => {
    setEditedPrompt({
      ...editedPrompt,
      [field]: value
    });
  };

  // Handler for updating prompt content
  const handleContentChange = (content: Content) => {
    // Convert content to string for storage
    const contentString = typeof content === "string" ? content : JSON.stringify(content);

    setEditedPrompt({
      ...editedPrompt,
      content: contentString
    });
  };

  // Handler for adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !editedPrompt.tags.includes(newTag.trim())) {
      setEditedPrompt({
        ...editedPrompt,
        tags: [...editedPrompt.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  // Handler for removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setEditedPrompt({
      ...editedPrompt,
      tags: editedPrompt.tags.filter((tag) => tag !== tagToRemove)
    });
  };

  // Handler for generating preview
  const handleGeneratePreview = () => {
    setIsGeneratingPreview(true);

    // Simulate API delay
    setTimeout(() => {
      // Mock response generation
      const mockResponse: PreviewResponse = {
        id: `preview-${Date.now()}`,
        message: `Based on your system prompt, here's how I would respond to the user's query about filing a disability claim:
        
I'd be happy to help you understand the disability claim filing process. VA disability claims are submitted to request benefits for a service-connected condition.

Here's a simplified overview of the process:
1. Gather your evidence (medical records, service records)
2. Complete VA Form 21-526EZ (Application for Disability Compensation)
3. Submit your claim online through VA.gov, by mail, or with a VSO's help
4. Attend any required C&P exams
5. Wait for the VA's decision

Would you like me to explain any specific part of this process in more detail? Or do you have questions about qualifying conditions or evidence requirements?

I recommend working with a Veterans Service Officer (VSO) who can provide free assistance with your claim. They can help ensure you submit a complete and well-documented application.`,
        createdAt: new Date().toISOString()
      };

      setPreviewResponse(mockResponse);
      setIsGeneratingPreview(false);
    }, 2000);
  };

  // Format the display content based on whether editing is enabled
  const displayContent = isEditing ? editedPrompt.content : prompt.content;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{isEditing ? "Edit Prompt" : prompt.name}</h2>
          <p className="text-muted-foreground text-sm">
            {isEditing
              ? "Make changes to the system prompt and save when complete"
              : prompt.description}
          </p>
        </div>

        {!isEditing && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Prompt
            </Button>
            <Button
              variant={prompt.isActive ? "default" : "secondary"}
              onClick={() => handleChange("isActive", !editedPrompt.isActive)}>
              {prompt.isActive ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Active
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Inactive
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit System Prompt</CardTitle>
            <CardDescription>
              Configure the behavior of your AI assistant with this system prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Prompt Name</Label>
                  <Input
                    id="name"
                    value={editedPrompt.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter prompt name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedPrompt.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the purpose of this prompt"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editedPrompt.category}
                    onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="claims">Claims</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {editedPrompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => handleRemoveTag(tag)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {editedPrompt.tags.length === 0 && (
                      <span className="text-muted-foreground text-xs">
                        No tags added. Tags help with organizing and filtering prompts.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content</Label>
              <Tabs
                defaultValue="edit"
                value={activeEditorTab}
                onValueChange={setActiveEditorTab}
                className="space-y-4">
                <TabsList>
                  <TabsTrigger value="edit">Edit Content</TabsTrigger>
                  <TabsTrigger value="preview">Preview Response</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-4">
                  <MinimalTiptapEditor
                    value={displayContent as any}
                    onChange={handleContentChange}
                    className="min-h-[300px]"
                    editorContentClassName="min-h-[300px]"
                  />
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <PromptPreview
                    promptContent={editedPrompt.content}
                    previewSettings={previewSettings}
                    onPreviewSettingsChange={setPreviewSettings}
                    previewResponse={previewResponse}
                    isGenerating={isGeneratingPreview}
                    onGeneratePreview={handleGeneratePreview}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handleChange("isActive", !editedPrompt.isActive)}>
                {editedPrompt.isActive ? "Set as Inactive" : "Set as Active"}
              </Button>
              <Button onClick={() => onSave(editedPrompt)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Prompt Details</CardTitle>
                <CardDescription>
                  Created by {prompt.authorName} on{" "}
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {prompt.deployedVersion ? (
                  <Badge variant="success" className="flex items-center">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Deployed
                  </Badge>
                ) : prompt.isActive ? (
                  <Badge>Active</Badge>
                ) : (
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <p className="capitalize">{prompt.category}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p>{new Date(prompt.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <TagIcon className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length === 0 && (
                    <span className="text-muted-foreground text-sm">No tags</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Prompt Content</h3>
              <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="preview">Preview Response</TabsTrigger>
                </TabsList>

                <TabsContent value="content">
                  <div className="bg-muted/50 min-h-[300px] rounded-md border p-4 whitespace-pre-wrap">
                    {displayContent}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <PromptPreview
                    promptContent={prompt.content}
                    previewSettings={previewSettings}
                    onPreviewSettingsChange={setPreviewSettings}
                    previewResponse={previewResponse}
                    isGenerating={isGeneratingPreview}
                    onGeneratePreview={handleGeneratePreview}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
