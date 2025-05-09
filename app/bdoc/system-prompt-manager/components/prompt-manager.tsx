"use client";

import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { SystemPrompt, SystemPromptCategory } from "../types";
import { mockPrompts } from "../data/mock-data";
import { PromptListItem } from "./prompt-list-item";
import { PromptEditor } from "./prompt-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export interface PromptManagerProps {
  className?: string;
}

export function PromptManager({ className }: PromptManagerProps) {
  const [prompts, setPrompts] = useState<SystemPrompt[]>(mockPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInactivePrompts, setShowInactivePrompts] = useState(false);

  // Handler for creating a new prompt
  const handleCreatePrompt = () => {
    const newPrompt: SystemPrompt = {
      id: `prompt-${Date.now()}`,
      name: "New System Prompt",
      description: "Description of the new prompt",
      content: "Enter your system prompt content here...",
      category: "general",
      tags: ["general"],
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: "user-001", // Mock user ID
      authorName: "John Smith", // Mock user name
      deployedVersion: null
    };

    setPrompts([...prompts, newPrompt]);
    setSelectedPromptId(newPrompt.id);
    setIsEditing(true);
  };

  // Filter prompts based on search query and category
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || prompt.category === categoryFilter;

    const matchesActive = showInactivePrompts ? true : prompt.isActive;

    return matchesSearch && matchesCategory && matchesActive;
  });

  // Get the selected prompt
  const selectedPrompt = selectedPromptId ? prompts.find((p) => p.id === selectedPromptId) : null;

  // Handler for updating a prompt
  const handleUpdatePrompt = (updatedPrompt: SystemPrompt) => {
    setPrompts(
      prompts.map((p) =>
        p.id === updatedPrompt.id ? { ...updatedPrompt, updatedAt: new Date().toISOString() } : p
      )
    );
    setIsEditing(false);
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
      {/* Left sidebar with list of prompts */}
      <div className="w-full space-y-4 lg:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">System Prompts</h3>
          <Button onClick={handleCreatePrompt} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="claims">Claims</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex cursor-pointer items-center space-x-2 text-sm font-medium">
            <input
              type="checkbox"
              className="text-primary focus:ring-primary rounded border-gray-300"
              checked={showInactivePrompts}
              onChange={(e) => setShowInactivePrompts(e.target.checked)}
            />
            <span>Show Inactive Prompts</span>
          </label>
        </div>

        <div className="h-[calc(100vh-26rem)] overflow-y-auto rounded-md border">
          {filteredPrompts.length > 0 ? (
            <div className="divide-y">
              {filteredPrompts.map((prompt) => (
                <PromptListItem
                  key={prompt.id}
                  prompt={prompt}
                  isSelected={prompt.id === selectedPromptId}
                  onClick={() => {
                    setSelectedPromptId(prompt.id);
                    setIsEditing(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground p-4 text-center">
              No prompts found. Try adjusting your filters or create a new prompt.
            </div>
          )}
        </div>
      </div>

      {/* Right content area with prompt editor or details */}
      <div className="w-full space-y-4 lg:w-2/3">
        {selectedPrompt ? (
          <PromptEditor
            prompt={selectedPrompt}
            isEditing={isEditing}
            onSave={handleUpdatePrompt}
            onCancel={handleCancelEdit}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <div className="flex h-[calc(100vh-20rem)] items-center justify-center rounded-md border p-8">
            <div className="space-y-3 text-center">
              <h3 className="text-xl font-medium">No Prompt Selected</h3>
              <p className="text-muted-foreground">
                Select a prompt from the list or create a new one to get started.
              </p>
              <Button onClick={handleCreatePrompt}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Prompt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
