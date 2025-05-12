"use client";

import {
  BarChart,
  FileText,
  FolderOpen,
  HardDrive,
  PieChart,
  Share2,
  Tags,
  Star
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFileManagerStore from "@/store/useFileManagerStore";
import { formatFileSize } from "@/lib/utils/file-utils";

export function SummaryCards() {
  const { files, categories, tags } = useFileManagerStore();

  // Calculate total file size
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  // Count files with categories
  const categorizedFiles = files.filter((file) => file.categoryIds.length > 0);
  const categorizedPercentage =
    files.length > 0 ? Math.round((categorizedFiles.length / files.length) * 100) : 0;

  // Count files with tags
  const taggedFiles = files.filter((file) => file.tagIds.length > 0);
  const taggedPercentage =
    files.length > 0 ? Math.round((taggedFiles.length / files.length) * 100) : 0;

  // Count starred files
  const starredFiles = files.filter((file) => file.starred);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <div className="rounded-full bg-blue-100 p-2">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{files.length}</div>
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {formatFileSize(totalSize)} total storage used
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <div className="rounded-full bg-amber-100 p-2">
            <FolderOpen className="h-4 w-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
            <span className="truncate">{categorizedPercentage}% of files categorized</span>
            <span className="ml-1 text-xs font-medium whitespace-nowrap text-amber-600">
              {categorizedFiles.length} files
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tags</CardTitle>
          <div className="rounded-full bg-green-100 p-2">
            <Tags className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tags.length}</div>
          <p className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
            <span className="truncate">{taggedPercentage}% of files tagged</span>
            <span className="ml-1 text-xs font-medium whitespace-nowrap text-green-600">
              {taggedFiles.length} files
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Starred Files</CardTitle>
          <div className="rounded-full bg-yellow-100 p-2">
            <Star className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{starredFiles.length}</div>
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {starredFiles.length > 0
              ? `${Math.round((starredFiles.length / files.length) * 100)}% of total files`
              : "No starred files yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
