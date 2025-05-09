"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Check,
  Clock,
  FileText,
  PlayCircle,
  PlusCircle,
  RefreshCw,
  XCircle
} from "lucide-react";
import { FineTuningJob } from "../data";

interface JobsListProps {
  jobs: FineTuningJob[];
  onCreateNewJob: () => void;
  onViewJob: (jobId: string) => void;
}

export function JobsList({ jobs, onCreateNewJob, onViewJob }: JobsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const getStatusBadge = (status: FineTuningJob["status"]) => {
    switch (status) {
      case "queued":
        return (
          <Badge variant="outline" className="flex items-center gap-1 font-normal">
            <Clock className="h-3 w-3" /> Queued
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 font-normal">
            <RefreshCw className="h-3 w-3 animate-spin" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600 font-normal">
            <Check className="h-3 w-3" /> Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 font-normal">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fine-Tuning Jobs</CardTitle>
          <CardDescription>Manage your fine-tuning jobs and track their progress</CardDescription>
        </div>
        <Button onClick={onCreateNewJob} size="sm" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Job</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Base Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="hidden sm:table-cell">Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="text-muted-foreground mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-sm">No fine-tuning jobs found.</p>
                      <Button variant="link" size="sm" className="mt-2" onClick={onCreateNewJob}>
                        Create your first job
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium">{job.name}</div>
                      <div className="text-muted-foreground hidden text-xs md:block lg:hidden">
                        {job.baseModel}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.baseModel}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(job.status)}
                        {job.status === "in_progress" && (
                          <Progress value={job.progress} className="h-1.5 w-24" />
                        )}
                        {job.status === "failed" && job.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex cursor-help items-center text-xs text-red-500">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  <span>Error details</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{job.error}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{job.documentsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onViewJob(job.id)}>
                        <span className="sr-only">View job details</span>
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
