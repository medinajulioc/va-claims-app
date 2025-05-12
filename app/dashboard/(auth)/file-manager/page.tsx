"use client";

import { useEffect } from "react";

import {
  FileUploadDialog,
  TableRecentFiles,
  SummaryCards,
  StorageStatusCard,
  FolderListCards
} from "@/app/dashboard/(auth)/file-manager/components";

import useFileManagerStore from "@/store/useFileManagerStore";
import { mockFiles } from "@/lib/mock/file-data";
import { predefinedCategories, predefinedTags } from "@/lib/mock/file-categories";

export default function Page() {
  const { initializeStore } = useFileManagerStore();

  // Initialize store with mock data
  useEffect(() => {
    initializeStore({
      files: mockFiles,
      categories: predefinedCategories,
      tags: predefinedTags
    });
  }, [initializeStore]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">VA Claims File Manager</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Upload, organize, and manage documents related to your VA disability claims
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <FileUploadDialog />
        </div>
      </div>

      <div className="mt-2">
        <SummaryCards />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FolderListCards />
        </div>
        <div>
          <StorageStatusCard />
        </div>
      </div>

      <div className="mt-2">
        <TableRecentFiles />
      </div>
    </div>
  );
}
