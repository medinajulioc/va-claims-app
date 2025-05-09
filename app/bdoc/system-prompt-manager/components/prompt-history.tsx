"use client";

import { useState } from "react";
import { SystemPrompt, SystemPromptVersion } from "../types";
import { mockPrompts, mockVersions } from "../data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileDiff,
  History,
  RotateCcw,
  Search,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PromptHistory() {
  const [prompts] = useState<SystemPrompt[]>(mockPrompts);
  const [versions] = useState<SystemPromptVersion[]>(mockVersions);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showDiffView, setShowDiffView] = useState(false);

  // Get all active prompts
  const activePrompts = prompts.filter((p) => p.isActive);

  // Get selected prompt
  const selectedPrompt = selectedPromptId ? prompts.find((p) => p.id === selectedPromptId) : null;

  // Get versions for selected prompt
  const promptVersions = selectedPromptId
    ? versions
        .filter((v) => v.promptId === selectedPromptId)
        .sort((a, b) => b.versionNumber - a.versionNumber)
    : [];

  // Get selected version
  const selectedVersion = selectedVersionId
    ? versions.find((v) => v.id === selectedVersionId)
    : null;

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  };

  // Get versions that match search
  const filteredVersions = promptVersions.filter((version) => {
    if (!searchQuery.trim()) return true;

    return (
      version.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.changes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-auto">
          <Select value={selectedPromptId || ""} onValueChange={setSelectedPromptId}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Select a prompt to view history" />
            </SelectTrigger>
            <SelectContent>
              {activePrompts.length > 0 ? (
                activePrompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No active prompts found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedPrompt && (
          <div className="flex w-full items-center sm:w-auto">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search versions..."
                className="w-full pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {selectedPrompt ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Version History: {selectedPrompt.name}</h3>
            <Badge>
              {promptVersions.length} Version{promptVersions.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {filteredVersions.length > 0 ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Version</TableHead>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="w-[180px]">Author</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead className="w-[100px] text-center">Status</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVersions.map((version) => (
                    <TableRow key={version.id} className={cn(version.isDeployed && "bg-muted/30")}>
                      <TableCell className="font-medium">v{version.versionNumber}</TableCell>
                      <TableCell>{formatDate(version.createdAt)}</TableCell>
                      <TableCell>{version.authorName}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{version.changes}</TableCell>
                      <TableCell className="text-center">
                        {version.isDeployed ? (
                          <Badge
                            variant="success"
                            className="mx-auto flex items-center justify-center">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Deployed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="mx-auto flex items-center justify-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedVersionId(version.id)}>
                              <FileDiff className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                Prompt Version {version.versionNumber} - {selectedPrompt.name}
                              </DialogTitle>
                              <DialogDescription>
                                Created by {version.authorName} on {formatDate(version.createdAt)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Change Description</h4>
                                <Badge variant={version.isDeployed ? "success" : "outline"}>
                                  {version.isDeployed ? "Deployed" : "Draft"}
                                </Badge>
                              </div>
                              <div className="bg-muted/50 rounded-md border p-3">
                                {version.changes}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">Content</h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDiffView(!showDiffView)}>
                                    {showDiffView ? (
                                      <>
                                        <ChevronUp className="mr-2 h-4 w-4" />
                                        Hide Diff
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="mr-2 h-4 w-4" />
                                        Show Diff
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <div className="bg-muted/50 max-h-[400px] overflow-y-auto rounded-md border p-4 whitespace-pre-wrap">
                                  {version.content}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              {!version.isDeployed && (
                                <Button variant="default" className="w-full sm:w-auto">
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Restore This Version
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border p-8">
              <History className="text-muted-foreground mb-3 h-10 w-10" />
              <h3 className="text-lg font-medium">No matching versions found</h3>
              {searchQuery ? (
                <p className="text-muted-foreground mt-1">Try adjusting your search query</p>
              ) : (
                <p className="text-muted-foreground mt-1">
                  This prompt doesn't have any versions yet
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border p-8">
          <History className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-xl font-medium">Select a Prompt</h3>
          <p className="text-muted-foreground mt-1 max-w-md text-center">
            Choose a prompt from the dropdown above to view its version history
          </p>
        </div>
      )}
    </div>
  );
}
