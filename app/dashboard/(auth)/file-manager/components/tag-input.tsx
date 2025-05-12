"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, X, Plus, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tag as TagType } from "@/types/file-manager";

interface TagInputProps {
  fileId: string;
  selectedTagIds: string[];
  onTagAdd?: (tagId: string) => void;
  onTagRemove?: (tagId: string) => void;
  compact?: boolean;
}

export function TagInput({
  fileId,
  selectedTagIds,
  onTagAdd,
  onTagRemove,
  compact = false
}: TagInputProps) {
  const { tags, assignTag, removeTag, addTag } = useFileManagerStore();
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6366f1");
  const [creatingTag, setCreatingTag] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingTag && inputRef.current) {
      inputRef.current.focus();
    }
  }, [creatingTag]);

  const handleTagSelect = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      handleTagRemove(tagId);
    } else {
      handleTagAdd(tagId);
    }
  };

  const handleTagAdd = (tagId: string) => {
    assignTag(fileId, tagId);
    onTagAdd?.(tagId);
    setOpen(false);
  };

  const handleTagRemove = (tagId: string) => {
    removeTag(fileId, tagId);
    onTagRemove?.(tagId);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const newTag: TagType = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
      count: 1
    };

    addTag(newTag);
    handleTagAdd(newTag.id);

    // Reset form
    setNewTagName("");
    setNewTagColor("#6366f1");
    setCreatingTag(false);
  };

  const availableTags = tags.filter((tag) => !selectedTagIds.includes(tag.id));

  return (
    <div className={`flex ${compact ? "flex-col" : "items-center"} gap-2`}>
      {!compact && (
        <div className="flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Tags:</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {selectedTagIds.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;

          return (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ backgroundColor: `${tag.color}20` }}
              className="flex items-center gap-1 pl-2">
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => handleTagRemove(tag.id)}>
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
              {!compact && <span>Add Tag</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            {creatingTag ? (
              <div className="space-y-3 p-4">
                <h3 className="text-sm font-medium">Create New Tag</h3>
                <div className="space-y-2">
                  <Input
                    ref={inputRef}
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="h-9 w-9 p-1"
                    />
                    <span className="text-muted-foreground text-xs">Tag color</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setCreatingTag(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleCreateTag} disabled={!newTagName.trim()}>
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => handleTagSelect(tag.id)}>
                        <div
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <div className="border-t px-2 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setCreatingTag(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create new tag
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
