"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FolderOpen,
  Plus,
  FileText,
  Stethoscope,
  Medal,
  BookOpen,
  Mail,
  FileSignature,
  FileCheck,
  Award,
  FileWarning,
  Clock,
  FileCog,
  FileQuestion,
  Folder
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useFileManagerStore from "@/store/useFileManagerStore";
import { getCategoryById } from "@/lib/mock/file-categories";

export function FolderListCards() {
  const { categories, files, setFilterOptions, addCategory, filterOptions } = useFileManagerStore();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  const [openDialog, setOpenDialog] = useState(false);

  // Get count of files by category
  const getFileCountByCategory = (categoryId: string) => {
    return files.filter((file) => file.categoryIds.includes(categoryId)).length;
  };

  // Get total count of files
  const getTotalFileCount = () => files.length;

  // Get count of uncategorized files
  const getUncategorizedFileCount = () => {
    return files.filter((file) => file.categoryIds.length === 0).length;
  };

  // Get count of starred files
  const getStarredFileCount = () => {
    return files.filter((file) => file.starred).length;
  };

  // Handle clicking on a category card
  const handleCategoryClick = (categoryId: string) => {
    setFilterOptions({
      ...filterOptions,
      categories: [categoryId]
    });
  };

  // Handle clicking on "All Files"
  const handleAllFilesClick = () => {
    setFilterOptions({});
  };

  // Handle clicking on "Uncategorized"
  const handleUncategorizedClick = () => {
    setFilterOptions({
      uncategorized: true
    } as any);
  };

  // Handle clicking on "Starred"
  const handleStarredClick = () => {
    setFilterOptions({
      starred: true
    } as any);
  };

  // Handle creating a new category
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    addCategory({
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || `Custom category for ${newCategoryName.trim()}`,
      icon: "Folder",
      color: newCategoryColor
    });

    // Reset form
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryColor("#6366f1");
    setOpenDialog(false);
  };

  // Render category icon with appropriate color
  const renderCategoryIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5" style={{ color }} />;
      case "Stethoscope":
        return <Stethoscope className="h-5 w-5" style={{ color }} />;
      case "Medal":
        return <Medal className="h-5 w-5" style={{ color }} />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5" style={{ color }} />;
      case "Mail":
        return <Mail className="h-5 w-5" style={{ color }} />;
      case "FileSignature":
        return <FileSignature className="h-5 w-5" style={{ color }} />;
      case "FileCheck":
        return <FileCheck className="h-5 w-5" style={{ color }} />;
      case "Award":
        return <Award className="h-5 w-5" style={{ color }} />;
      case "FileWarning":
        return <FileWarning className="h-5 w-5" style={{ color }} />;
      case "Clock":
        return <Clock className="h-5 w-5" style={{ color }} />;
      case "FileCog":
        return <FileCog className="h-5 w-5" style={{ color }} />;
      case "FileQuestion":
        return <FileQuestion className="h-5 w-5" style={{ color }} />;
      default:
        return <Folder className="h-5 w-5" style={{ color }} />;
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-muted/5 flex flex-row items-center justify-between space-y-0 pt-6 pb-2">
        <CardTitle className="text-lg font-semibold">Document Categories</CardTitle>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Create a custom category to organize your documents
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Describe this category"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-10 w-10 p-1"
                  />
                  <span className="text-muted-foreground text-sm">
                    Choose a color for this category
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {/* All Files Card */}
          <button
            className="hover:bg-accent group flex h-full flex-col items-center justify-between rounded-lg border p-4 text-left transition-colors"
            onClick={handleAllFilesClick}>
            <div className="flex w-full items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <FolderOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">All Files</div>
                <div className="text-muted-foreground truncate text-sm">All uploaded documents</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between pt-3">
              <div className="text-muted-foreground text-sm font-medium">
                {getTotalFileCount()} files
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Starred Files Card */}
          <button
            className="hover:bg-accent group flex h-full flex-col items-center justify-between rounded-lg border p-4 text-left transition-colors"
            onClick={handleStarredClick}>
            <div className="flex w-full items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
                <FolderOpen className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">Starred</div>
                <div className="text-muted-foreground truncate text-sm">Important documents</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between pt-3">
              <div className="text-muted-foreground text-sm font-medium">
                {getStarredFileCount()} files
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Uncategorized Files Card */}
          <button
            className="hover:bg-accent group flex h-full flex-col items-center justify-between rounded-lg border p-4 text-left transition-colors"
            onClick={handleUncategorizedClick}>
            <div className="flex w-full items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <FolderOpen className="h-5 w-5 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">Uncategorized</div>
                <div className="text-muted-foreground truncate text-sm">
                  Files without a category
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between pt-3">
              <div className="text-muted-foreground text-sm font-medium">
                {getUncategorizedFileCount()} files
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Category Cards */}
          {categories.map((category) => {
            const fileCount = getFileCountByCategory(category.id);

            return (
              <button
                key={category.id}
                className="hover:bg-accent group flex h-full flex-col items-center justify-between rounded-lg border p-4 text-left transition-colors"
                onClick={() => handleCategoryClick(category.id)}>
                <div className="flex w-full items-center space-x-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${category.color}20` }}>
                    {renderCategoryIcon(category.icon, category.color)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{category.name}</div>
                    <div className="text-muted-foreground truncate text-sm">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-3">
                  <div className="text-muted-foreground text-sm font-medium">
                    {fileCount} {fileCount === 1 ? "file" : "files"}
                  </div>
                  <ChevronRight className="text-muted-foreground h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
