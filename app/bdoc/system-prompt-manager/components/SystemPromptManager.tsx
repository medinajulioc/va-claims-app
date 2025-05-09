"use client";

import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SystemPrompt, SystemPromptCategory } from "../data/types";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { PromptEditor } from "./PromptEditor";
import { savePrompt, saveCategory, deletePrompt, deleteCategory } from "../data/actions";

interface SystemPromptManagerProps {
  initialPrompts: SystemPrompt[];
  initialCategories: SystemPromptCategory[];
}

export function SystemPromptManager({ 
  initialPrompts, 
  initialCategories 
}: SystemPromptManagerProps) {
  const [prompts, setPrompts] = useState<SystemPrompt[]>(initialPrompts);
  const [categories, setCategories] = useState<SystemPromptCategory[]>(initialCategories);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [activeTab, setActiveTab] = useState("prompts");
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  
  // Form state for creating new prompts
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptCategoryId, setNewPromptCategoryId] = useState<string>("uncategorized");
  
  // Form state for creating new categories
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366F1"); // Default indigo color
  
  const sortedPrompts = [...prompts].sort((a, b) => a.name.localeCompare(b.name));
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  
  const handleSavePrompt = (updatedPrompt: SystemPrompt) => {
    // Update the prompts list
    setPrompts(prevPrompts => 
      prevPrompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p)
    );
    
    // If this is the currently selected prompt, update it
    if (selectedPrompt?.id === updatedPrompt.id) {
      setSelectedPrompt(updatedPrompt);
    }
  };
  
  const handleCreatePrompt = async () => {
    if (!newPromptName.trim()) {
      toast.error("Please enter a prompt name");
      return;
    }
    
    // Create a new prompt
    const newPrompt: SystemPrompt = {
      id: nanoid(),
      name: newPromptName.trim(),
      content: "# System Prompt\n\nYou are a helpful assistant.",
      categoryId: newPromptCategoryId === "uncategorized" ? undefined : newPromptCategoryId || undefined,
      lastUpdated: new Date().toISOString(),
      versions: [
        {
          id: nanoid(),
          promptId: "", // Will be filled in below
          versionNumber: 1,
          content: "# System Prompt\n\nYou are a helpful assistant.",
          timestamp: new Date().toISOString(),
          author: "Current User", // In a real app, use the actual user
          changeComment: "Initial version",
          isActive: true
        }
      ]
    };
    
    // Set the promptId in the version
    newPrompt.versions[0].promptId = newPrompt.id;
    
    // Save to "backend"
    try {
      await savePrompt(newPrompt);
      
      // Update local state
      setPrompts(prev => [...prev, newPrompt]);
      setNewPromptName("");
      setNewPromptCategoryId("uncategorized");
      setIsCreatePromptOpen(false);
      setSelectedPrompt(newPrompt);
      
      toast.success("Prompt created successfully");
    } catch (error) {
      toast.error("Failed to create prompt");
      console.error(error);
    }
  };
  
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    // Create a new category
    const newCategory: SystemPromptCategory = {
      id: nanoid(),
      name: newCategoryName.trim(),
      color: newCategoryColor
    };
    
    // Save to "backend"
    try {
      await saveCategory(newCategory);
      
      // Update local state
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName("");
      setNewCategoryColor("#6366F1");
      setIsCreateCategoryOpen(false);
      
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };
  
  const handleDeletePrompt = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this prompt? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deletePrompt(id);
      
      // Update local state
      setPrompts(prev => prev.filter(p => p.id !== id));
      
      // If this was the selected prompt, clear selection
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(null);
      }
      
      toast.success("Prompt deleted successfully");
    } catch (error) {
      toast.error("Failed to delete prompt");
      console.error(error);
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    // Check if any prompts are using this category
    const promptsUsingCategory = prompts.filter(p => p.categoryId === id);
    
    let confirmMessage = "Are you sure you want to delete this category?";
    if (promptsUsingCategory.length > 0) {
      confirmMessage += ` ${promptsUsingCategory.length} prompt(s) are currently using this category and will be moved to 'Uncategorized'.`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    try {
      await deleteCategory(id);
      
      // Update local state
      setCategories(prev => prev.filter(c => c.id !== id));
      
      // Update any prompts that were using this category
      if (promptsUsingCategory.length > 0) {
        setPrompts(prev => 
          prev.map(p => p.categoryId === id ? { ...p, categoryId: undefined } : p)
        );
      }
      
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };
  
  const getCategoryById = (id?: string) => {
    if (!id) return null;
    return categories.find(c => c.id === id) || null;
  };
  
  const getCategoryColor = (categoryId?: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.color : "#CBD5E1"; // Default slate color
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Prompt Manager</CardTitle>
          <CardDescription>
            Create, edit, and manage system prompts for your AI applications. System prompts help control AI behavior by providing context and instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">System Prompts</h3>
                <Dialog open={isCreatePromptOpen} onOpenChange={setIsCreatePromptOpen}>
                  <DialogTrigger asChild>
                    <Button>Create New Prompt</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New System Prompt</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="prompt-name">Prompt Name</Label>
                        <Input
                          id="prompt-name"
                          placeholder="Enter prompt name..."
                          value={newPromptName}
                          onChange={(e) => setNewPromptName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prompt-category">Category (Optional)</Label>
                        <Select value={newPromptCategoryId} onValueChange={setNewPromptCategoryId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uncategorized">Uncategorized</SelectItem>
                            {sortedCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleCreatePrompt}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex gap-6">
                <div className="w-1/3 border rounded-md overflow-hidden">
                  <div className="bg-card p-3 border-b">
                    <h4 className="font-medium">System Prompts</h4>
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    {sortedPrompts.length > 0 ? (
                      <ul className="divide-y">
                        {sortedPrompts.map((prompt) => (
                          <li 
                            key={prompt.id}
                            className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                              selectedPrompt?.id === prompt.id ? "bg-muted" : ""
                            }`}
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: getCategoryColor(prompt.categoryId) }}
                                />
                                <span>{prompt.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePrompt(prompt.id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No prompts available. Create your first prompt.
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-2/3">
                  {selectedPrompt ? (
                    <PromptEditor 
                      prompt={selectedPrompt} 
                      onSave={handleSavePrompt} 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center border rounded-md p-8">
                      <div className="text-center text-muted-foreground">
                        <h3 className="text-lg font-medium mb-2">No Prompt Selected</h3>
                        <p>Select a prompt from the list to view and edit it, or create a new one.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Categories</h3>
                <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>Create New Category</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          placeholder="Enter category name..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="category-color"
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="flex-1"
                            placeholder="#6366F1"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleCreateCategory}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Prompts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.length > 0 ? (
                    sortedCategories.map((category) => {
                      const promptCount = prompts.filter(p => p.categoryId === category.id).length;
                      
                      return (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{promptCount}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No categories available. Create your first category.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 