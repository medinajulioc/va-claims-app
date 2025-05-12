"use client";

import { useState, useEffect, useRef } from "react";
import { Folder, X, Plus, Check, FolderOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import useFileManagerStore from "@/store/useFileManagerStore";
import { Category } from "@/types/file-manager";
import { getCategoryIcon } from "@/lib/mock/file-categories";

interface CategorySelectorProps {
  fileId: string;
  selectedCategoryIds: string[];
  onCategoryAdd?: (categoryId: string) => void;
  onCategoryRemove?: (categoryId: string) => void;
  compact?: boolean;
}

export function CategorySelector({
  fileId,
  selectedCategoryIds,
  onCategoryAdd,
  onCategoryRemove,
  compact = false
}: CategorySelectorProps) {
  const { categories, assignCategory, removeCategory, addCategory } = useFileManagerStore();
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creatingCategory]);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      handleCategoryRemove(categoryId);
    } else {
      handleCategoryAdd(categoryId);
    }
  };

  const handleCategoryAdd = (categoryId: string) => {
    assignCategory(fileId, categoryId);
    onCategoryAdd?.(categoryId);
    setOpen(false);
  };

  const handleCategoryRemove = (categoryId: string) => {
    removeCategory(fileId, categoryId);
    onCategoryRemove?.(categoryId);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
      icon: "Folder",
      color: newCategoryColor
    };

    addCategory(newCategory);
    handleCategoryAdd(newCategory.id);

    // Reset form
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryColor("#6366f1");
    setCreatingCategory(false);
  };

  const availableCategories = categories.filter(
    (category) => !selectedCategoryIds.includes(category.id)
  );

  return (
    <div className={`flex ${compact ? "flex-col" : "items-center"} gap-2`}>
      {!compact && (
        <div className="flex items-center">
          <Folder className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Categories:</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {selectedCategoryIds.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          if (!category) return null;

          const IconComponent = getCategoryIcon(category.icon);

          return (
            <Badge key={category.id} variant="outline" className="flex items-center gap-1 pl-2">
              {IconComponent ? (
                <IconComponent style={{ color: category.color }} className="mr-1 h-3 w-3" />
              ) : (
                <Folder style={{ color: category.color }} className="mr-1 h-3 w-3" />
              )}
              {category.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => handleCategoryRemove(category.id)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`flex h-7 gap-1 px-2 ${compact ? "w-full justify-center" : ""}`}>
              <Plus className="h-3.5 w-3.5" />
              {!compact && <span>Add Category</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            {creatingCategory ? (
              <div className="space-y-3 p-4">
                <h3 className="text-sm font-medium">Create New Category</h3>
                <div className="space-y-2">
                  <Input
                    ref={inputRef}
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="h-9 w-9 p-1"
                    />
                    <span className="text-muted-foreground text-xs">Category color</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setCreatingCategory(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}>
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandList>
                  <CommandEmpty>No categories found</CommandEmpty>
                  <CommandGroup>
                    {availableCategories.map((category) => {
                      const IconComponent = getCategoryIcon(category.icon);

                      return (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => handleCategorySelect(category.id)}>
                          {IconComponent ? (
                            <IconComponent
                              style={{ color: category.color }}
                              className="mr-2 h-4 w-4"
                            />
                          ) : (
                            <FolderOpen
                              style={{ color: category.color }}
                              className="mr-2 h-4 w-4"
                            />
                          )}
                          <span>{category.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <div className="border-t px-2 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setCreatingCategory(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create new category
                    </Button>
                  </div>
                </CommandList>
              </Command>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
