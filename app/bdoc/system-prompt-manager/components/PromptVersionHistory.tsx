"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { SystemPromptVersion } from "../data/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DiffViewer } from "./DiffViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PromptVersionHistoryProps {
  versions: SystemPromptVersion[];
  onRestore: (version: SystemPromptVersion) => void;
  currentContent: string;
}

export const PromptVersionHistory = ({
  versions,
  onRestore,
  currentContent
}: PromptVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<SystemPromptVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<SystemPromptVersion | null>(null);

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleVersionSelect = (version: SystemPromptVersion) => {
    if (compareVersion) {
      // If we already have a version selected for comparison
      setSelectedVersion(version);
    } else {
      setSelectedVersion(version);
      setCompareVersion(null);
    }
  };

  const handleCompareSelect = (version: SystemPromptVersion) => {
    if (selectedVersion && selectedVersion.id === version.id) {
      // Can't compare with itself
      return;
    }
    setCompareVersion(version);
  };

  const resetSelection = () => {
    setSelectedVersion(null);
    setCompareVersion(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Version History</h3>
        {compareVersion && (
          <Button variant="ghost" size="sm" onClick={resetSelection}>
            Clear Selection
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Version</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Change Comment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVersions.length > 0 ? (
            sortedVersions.map((version) => (
              <TableRow
                key={version.id}
                className={
                  selectedVersion?.id === version.id || compareVersion?.id === version.id
                    ? "bg-muted/50"
                    : ""
                }>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>v{version.versionNumber}</span>
                    {version.isActive && <Badge variant="outline">Current</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell>{version.author}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {version.changeComment || "No comment"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Version {version.versionNumber} -{" "}
                            {new Date(version.timestamp).toLocaleString()}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <h4 className="mb-2 font-medium">Change Comment:</h4>
                          <p className="text-muted-foreground mb-4 text-sm">
                            {version.changeComment || "No comment provided"}
                          </p>
                          <div className="bg-card rounded-md border p-4">
                            <pre className="overflow-auto text-sm whitespace-pre-wrap">
                              {version.content}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {!version.isActive && (
                      <Button variant="ghost" size="sm" onClick={() => onRestore(version)}>
                        Restore
                      </Button>
                    )}

                    {selectedVersion ? (
                      compareVersion ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={compareVersion.id === version.id}>
                              Compare
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh] max-w-6xl">
                            <DialogHeader>
                              <DialogTitle>
                                Comparing v{compareVersion.versionNumber} with v
                                {selectedVersion.versionNumber}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 h-[calc(80vh-120px)]">
                              <DiffViewer
                                oldValue={compareVersion.content}
                                newValue={selectedVersion.content}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompareSelect(version)}
                          disabled={selectedVersion.id === version.id}>
                          Compare
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVersionSelect(version)}>
                        Select
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-4 text-center">
                No version history available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedVersion && !compareVersion && (
        <div className="mt-6 rounded-md border p-4">
          <h3 className="text-md mb-4 font-medium">Compare with Current Version</h3>
          <Tabs defaultValue="diff">
            <TabsList>
              <TabsTrigger value="diff">Diff View</TabsTrigger>
              <TabsTrigger value="selected">Selected Version</TabsTrigger>
              <TabsTrigger value="current">Current Version</TabsTrigger>
            </TabsList>
            <TabsContent value="diff" className="mt-2 h-[400px]">
              <DiffViewer oldValue={selectedVersion.content} newValue={currentContent} />
            </TabsContent>
            <TabsContent value="selected" className="mt-2">
              <div className="bg-card rounded-md border p-4">
                <h4 className="mb-2 text-sm font-medium">
                  Version {selectedVersion.versionNumber} -{" "}
                  {new Date(selectedVersion.timestamp).toLocaleString()}
                </h4>
                <pre className="h-[340px] overflow-auto text-sm whitespace-pre-wrap">
                  {selectedVersion.content}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="current" className="mt-2">
              <div className="bg-card rounded-md border p-4">
                <h4 className="mb-2 text-sm font-medium">Current Version</h4>
                <pre className="h-[340px] overflow-auto text-sm whitespace-pre-wrap">
                  {currentContent}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
