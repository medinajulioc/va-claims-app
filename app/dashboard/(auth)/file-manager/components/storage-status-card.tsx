"use client";

import { FileType } from "@/types/file-manager";
import { formatFileSize } from "@/lib/utils/file-utils";
import useFileManagerStore from "@/store/useFileManagerStore";
import { FileText, FileImage, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function StorageStatusCard() {
  const { files } = useFileManagerStore();

  // Calculate total size
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  // Maximum storage in bytes (20GB for mock purposes)
  const maxStorage = 20 * 1024 * 1024 * 1024;

  // Calculate used percentage
  const usedPercentage = (totalSize / maxStorage) * 100;

  // Calculate usage by file type
  const pdfSize = files
    .filter((file) => file.type === FileType.PDF)
    .reduce((total, file) => total + file.size, 0);

  const jpgSize = files
    .filter((file) => file.type === FileType.JPG)
    .reduce((total, file) => total + file.size, 0);

  const pngSize = files
    .filter((file) => file.type === FileType.PNG)
    .reduce((total, file) => total + file.size, 0);

  const otherSize = files
    .filter((file) => file.type === FileType.UNKNOWN)
    .reduce((total, file) => total + file.size, 0);

  // Calculate percentages by file type
  const pdfPercentage = totalSize > 0 ? (pdfSize / totalSize) * 100 : 0;
  const jpgPercentage = totalSize > 0 ? (jpgSize / totalSize) * 100 : 0;
  const pngPercentage = totalSize > 0 ? (pngSize / totalSize) * 100 : 0;
  const otherPercentage = totalSize > 0 ? (otherSize / totalSize) * 100 : 0;

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-muted/5 pt-6 pb-2">
        <CardTitle className="text-lg font-semibold">Storage Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground font-medium">Used Storage</div>
            <div className="font-medium">
              {formatFileSize(totalSize)} / {formatFileSize(maxStorage)}
            </div>
          </div>
          <Progress value={usedPercentage} className="h-2.5" />
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div>{formatFileSize(maxStorage - totalSize)} available</div>
            <div>{Math.round(usedPercentage)}% used</div>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="text-sm font-medium">Storage by File Type</h4>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                    <File className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <div className="text-sm font-medium">PDF Documents</div>
                </div>
                <div className="text-sm font-medium">{formatFileSize(pdfSize)}</div>
              </div>
              <Progress value={pdfPercentage} className="h-1.5" indicatorColor="bg-red-500" />
              <div className="text-muted-foreground text-right text-xs">
                {Math.round(pdfPercentage)}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <FileImage className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-sm font-medium">JPG Images</div>
                </div>
                <div className="text-sm font-medium">{formatFileSize(jpgSize)}</div>
              </div>
              <Progress value={jpgPercentage} className="h-1.5" indicatorColor="bg-blue-500" />
              <div className="text-muted-foreground text-right text-xs">
                {Math.round(jpgPercentage)}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <FileImage className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <div className="text-sm font-medium">PNG Images</div>
                </div>
                <div className="text-sm font-medium">{formatFileSize(pngSize)}</div>
              </div>
              <Progress value={pngPercentage} className="h-1.5" indicatorColor="bg-green-500" />
              <div className="text-muted-foreground text-right text-xs">
                {Math.round(pngPercentage)}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    <FileText className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div className="text-sm font-medium">Other Files</div>
                </div>
                <div className="text-sm font-medium">{formatFileSize(otherSize)}</div>
              </div>
              <Progress value={otherPercentage} className="h-1.5" indicatorColor="bg-gray-500" />
              <div className="text-muted-foreground text-right text-xs">
                {Math.round(otherPercentage)}%
              </div>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground bg-muted/10 rounded-md p-3 text-center text-sm">
          Total of <span className="font-medium">{files.length}</span> files using{" "}
          <span className="font-medium">{formatFileSize(totalSize)}</span> of storage
        </div>
      </CardContent>
    </Card>
  );
}
