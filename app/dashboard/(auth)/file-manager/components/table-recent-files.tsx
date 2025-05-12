"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  File,
  FileText,
  FileImage,
  Trash2,
  Download,
  Share2,
  ChevronRight,
  Search,
  Filter,
  Star,
  SlidersHorizontal,
  Eye,
  Tag,
  XCircle,
  Folder,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
  FileQuestion
} from "lucide-react";
import { format } from "date-fns";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import useFileManagerStore from "@/store/useFileManagerStore";
import { formatFileSize, getFileTypeColor } from "@/lib/utils/file-utils";
import { File as FileType, FileType as FileExtType, SortOption } from "@/types/file-manager";
import { getCategoryById, getTagById, getCategoryIcon } from "@/lib/mock/file-categories";

import { DocumentPreview } from "./document-preview";
import { CategorySelector } from "./category-selector";
import { TagInput } from "./tag-input";

// Helper component to render category icons with proper typing
const CategoryIcon = ({
  iconName,
  color,
  className
}: {
  iconName: string;
  color: string;
  className: string;
}) => {
  // Use specific Lucide icons directly based on iconName
  switch (iconName) {
    case "FileText":
      return <FileText className={className} color={color} />;
    case "Stethoscope":
      return <Stethoscope className={className} color={color} />;
    case "Medal":
      return <Medal className={className} color={color} />;
    case "BookOpen":
      return <BookOpen className={className} color={color} />;
    case "Mail":
      return <Mail className={className} color={color} />;
    case "FileSignature":
      return <FileSignature className={className} color={color} />;
    case "FileCheck":
      return <FileCheck className={className} color={color} />;
    case "Award":
      return <Award className={className} color={color} />;
    case "FileWarning":
      return <FileWarning className={className} color={color} />;
    case "Clock":
      return <Clock className={className} color={color} />;
    case "FileCog":
      return <FileCog className={className} color={color} />;
    case "FileQuestion":
      return <FileQuestion className={className} color={color} />;
    case "Folder":
      return <Folder className={className} color={color} />;
    default:
      return <Folder className={className} color={color} />;
  }
};

export function TableRecentFiles() {
  const {
    files,
    categories,
    tags,
    filterOptions,
    searchQuery,
    sortOption,
    deleteFile,
    toggleFileStarred,
    setFilterOptions,
    setSearchQuery,
    setSortOption,
    getFilteredFiles,
    assignCategory,
    removeCategory,
    assignTag,
    removeTag
  } = useFileManagerStore();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const filteredFiles = getFilteredFiles();

  useEffect(() => {
    if (selectedFileId) {
      const file = files.find((f) => f.id === selectedFileId) || null;
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  }, [selectedFileId, files]);

  useEffect(() => {
    // Reset selected items when filtered files change
    setSelectedItems([]);
    setIsSelectAllChecked(false);
  }, [filteredFiles.length]);

  const getFileIcon = (type: FileExtType) => {
    switch (type) {
      case FileExtType.PDF:
        return (
          <FileText className="h-4 w-4" style={{ color: getFileTypeColor(FileExtType.PDF) }} />
        );
      case FileExtType.JPG:
      case FileExtType.PNG:
        return <FileImage className="h-4 w-4" style={{ color: getFileTypeColor(type) }} />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleSortChange = (field: SortOption["field"]) => {
    setSortOption({
      field,
      direction: sortOption.field === field && sortOption.direction === "asc" ? "desc" : "asc"
    });
  };

  const getSortIndicator = (field: SortOption["field"]) => {
    if (sortOption.field !== field)
      return <ArrowUpDown className="text-muted-foreground/70 ml-2 h-4 w-4" />;
    return sortOption.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const toggleFilterCategory = (categoryId: string) => {
    const categories = filterOptions.categories || [];
    const updatedCategories = categories.includes(categoryId)
      ? categories.filter((id) => id !== categoryId)
      : [...categories, categoryId];

    setFilterOptions({
      ...filterOptions,
      categories: updatedCategories.length > 0 ? updatedCategories : undefined
    });
  };

  const toggleFilterTag = (tagId: string) => {
    const tags = filterOptions.tags || [];
    const updatedTags = tags.includes(tagId) ? tags.filter((id) => id !== tagId) : [...tags, tagId];

    setFilterOptions({
      ...filterOptions,
      tags: updatedTags.length > 0 ? updatedTags : undefined
    });
  };

  const toggleFilterType = (type: FileExtType) => {
    const types = filterOptions.types || [];
    const updatedTypes = types.includes(type) ? types.filter((t) => t !== type) : [...types, type];

    setFilterOptions({
      ...filterOptions,
      types: updatedTypes.length > 0 ? updatedTypes : undefined
    });
  };

  const clearFilters = () => {
    setFilterOptions({});
    setSearchQuery("");
  };

  const hasActiveFilters = () => {
    return (
      searchQuery !== "" ||
      (filterOptions.categories && filterOptions.categories.length > 0) ||
      (filterOptions.tags && filterOptions.tags.length > 0) ||
      (filterOptions.types && filterOptions.types.length > 0) ||
      filterOptions.starred !== undefined ||
      filterOptions.uncategorized !== undefined
    );
  };

  const toggleSelectAllItems = () => {
    if (isSelectAllChecked) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFiles.map((file) => file.id));
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} files?`)) {
      selectedItems.forEach((id) => deleteFile(id));
      setSelectedItems([]);
    }
  };

  const openPreview = (fileId: string) => {
    setSelectedFileId(fileId);
    setPreviewOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="bg-muted/5 flex flex-row items-center justify-between space-y-0 pt-6 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">Files</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {filteredFiles.length} {filteredFiles.length === 1 ? "file" : "files"} found
            </p>
          </div>
          <div className="ml-auto flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="search"
                placeholder="Search files..."
                className="w-full pl-9 sm:w-[250px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10">
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters() && (
                      <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-medium">Filters</span>
                    {hasActiveFilters() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary h-auto p-0"
                        onClick={clearFilters}>
                        Clear all
                      </Button>
                    )}
                  </div>
                  <DropdownMenuSeparator />

                  <div className="px-3 py-2">
                    <p className="mb-2 text-sm font-medium">File Type</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="filter-pdf"
                          checked={filterOptions.types?.includes(FileExtType.PDF)}
                          onCheckedChange={() => toggleFilterType(FileExtType.PDF)}
                        />
                        <label htmlFor="filter-pdf" className="ml-2 text-sm">
                          PDF
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="filter-jpg"
                          checked={filterOptions.types?.includes(FileExtType.JPG)}
                          onCheckedChange={() => toggleFilterType(FileExtType.JPG)}
                        />
                        <label htmlFor="filter-jpg" className="ml-2 text-sm">
                          JPG
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="filter-png"
                          checked={filterOptions.types?.includes(FileExtType.PNG)}
                          onCheckedChange={() => toggleFilterType(FileExtType.PNG)}
                        />
                        <label htmlFor="filter-png" className="ml-2 text-sm">
                          PNG
                        </label>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="px-3 py-2">
                    <p className="mb-2 text-sm font-medium">Categories</p>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={filterOptions.categories?.includes(category.id)}
                              onCheckedChange={() => toggleFilterCategory(category.id)}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 truncate text-sm">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="px-3 py-2">
                    <p className="mb-2 text-sm font-medium">Tags</p>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-2">
                        {tags.map((tag) => (
                          <div key={tag.id} className="flex items-center">
                            <Checkbox
                              id={`tag-${tag.id}`}
                              checked={filterOptions.tags?.includes(tag.id)}
                              onCheckedChange={() => toggleFilterTag(tag.id)}
                            />
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="ml-2 flex items-center text-sm">
                              <div
                                className="mr-1 h-2 w-2 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              {tag.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="px-3 py-2">
                    <p className="mb-2 text-sm font-medium">Other Filters</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="filter-starred"
                          checked={filterOptions.starred === true}
                          onCheckedChange={() =>
                            setFilterOptions({
                              ...filterOptions,
                              starred: filterOptions.starred === true ? undefined : true
                            })
                          }
                        />
                        <label htmlFor="filter-starred" className="ml-2 flex items-center text-sm">
                          <Star className="mr-1 h-3 w-3 text-yellow-500" /> Starred
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="filter-uncategorized"
                          checked={filterOptions.uncategorized === true}
                          onCheckedChange={() =>
                            setFilterOptions({
                              ...filterOptions,
                              uncategorized: filterOptions.uncategorized === true ? undefined : true
                            })
                          }
                        />
                        <label htmlFor="filter-uncategorized" className="ml-2 text-sm">
                          Uncategorized
                        </label>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={sortOption.field === "name"}
                    onCheckedChange={() => handleSortChange("name")}>
                    Sort by Name{" "}
                    {sortOption.field === "name" &&
                      (sortOption.direction === "asc" ? "(A-Z)" : "(Z-A)")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption.field === "uploadDate"}
                    onCheckedChange={() => handleSortChange("uploadDate")}>
                    Sort by Date{" "}
                    {sortOption.field === "uploadDate" &&
                      (sortOption.direction === "asc" ? "(Oldest)" : "(Newest)")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption.field === "size"}
                    onCheckedChange={() => handleSortChange("size")}>
                    Sort by Size{" "}
                    {sortOption.field === "size" &&
                      (sortOption.direction === "asc" ? "(Smallest)" : "(Largest)")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOption.field === "type"}
                    onCheckedChange={() => handleSortChange("type")}>
                    Sort by Type{" "}
                    {sortOption.field === "type" &&
                      (sortOption.direction === "asc" ? "(A-Z)" : "(Z-A)")}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            {selectedItems.length > 0 && (
              <div className="bg-muted mb-4 flex items-center justify-between rounded-md p-2">
                <span className="text-sm">
                  {selectedItems.length} {selectedItems.length === 1 ? "file" : "files"} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-7 gap-1">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={isSelectAllChecked}
                      onCheckedChange={toggleSelectAllItems}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange("name")}
                      className="flex items-center font-medium">
                      File Name{getSortIndicator("name")}
                    </Button>
                  </TableHead>
                  <TableHead>Categories & Tags</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange("type")}
                      className="flex items-center font-medium">
                      Type{getSortIndicator("type")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange("size")}
                      className="flex items-center font-medium">
                      Size{getSortIndicator("size")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange("uploadDate")}
                      className="flex items-center font-medium whitespace-nowrap">
                      Upload Date{getSortIndicator("uploadDate")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[90px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center">
                        <FileText className="mb-2 h-10 w-10" />
                        <p className="mb-2">No files found</p>
                        {hasActiveFilters() && (
                          <Button
                            variant="link"
                            className="text-primary h-auto p-0"
                            onClick={clearFilters}>
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id} className="group">
                      <TableCell className="align-top">
                        <Checkbox
                          checked={selectedItems.includes(file.id)}
                          onCheckedChange={() => toggleSelectItem(file.id)}
                          aria-label={`Select ${file.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-sm items-start space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={
                              file.starred
                                ? "text-yellow-500"
                                : "text-muted-foreground opacity-0 group-hover:opacity-100"
                            }
                            onClick={() => toggleFileStarred(file.id)}>
                            <Star className="h-4 w-4" />
                          </Button>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              {getFileIcon(file.type)}
                              <button
                                className="ml-2 font-medium hover:underline focus:underline focus:outline-none"
                                onClick={() => openPreview(file.id)}>
                                {file.name}
                              </button>
                              {file.content && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="outline" className="ml-2 h-5 text-xs">
                                        OCR
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">Text extracted with OCR</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            {file.content && (
                              <p className="text-muted-foreground line-clamp-2 max-w-xs text-xs">
                                {file.content.substring(0, 150)}
                                {file.content.length > 150 && "..."}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex max-w-xs flex-wrap gap-1">
                            {file.categoryIds.length > 0 ? (
                              file.categoryIds.map((categoryId) => {
                                const category = getCategoryById(categoryId);
                                if (!category) return null;

                                return (
                                  <Badge
                                    key={categoryId}
                                    variant="outline"
                                    className="flex h-6 items-center gap-1 pl-2">
                                    <CategoryIcon
                                      iconName={category.icon}
                                      color={category.color}
                                      className="mr-1 h-3 w-3"
                                    />
                                    {category.name}
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className="text-muted-foreground text-xs italic">
                                Uncategorized
                              </span>
                            )}
                          </div>
                          <div className="flex max-w-xs flex-wrap gap-1">
                            {file.tagIds.length > 0 ? (
                              file.tagIds.map((tagId) => {
                                const tag = getTagById(tagId);
                                if (!tag) return null;

                                return (
                                  <Badge
                                    key={tagId}
                                    variant="outline"
                                    style={{ backgroundColor: `${tag.color}20` }}
                                    className="h-5">
                                    {tag.name}
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className="text-muted-foreground text-xs italic">No tags</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold"
                          style={{ color: getFileTypeColor(file.type) }}>
                          {file.type.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatFileSize(file.size)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(file.uploadDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => openPreview(file.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openPreview(file.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toggleFileStarred(file.id)}>
                                <Star
                                  className={`mr-2 h-4 w-4 ${file.starred ? "text-yellow-500" : ""}`}
                                />
                                {file.starred ? "Remove Star" : "Star File"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  if (window.confirm(`Delete file "${file.name}"?`)) {
                                    deleteFile(file.id);
                                  }
                                }}
                                className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      {previewOpen && selectedFile && (
        <DocumentPreview file={selectedFile} open={previewOpen} onOpenChange={setPreviewOpen} />
      )}
    </>
  );
}
