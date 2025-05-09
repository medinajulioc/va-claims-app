"use client";

import { useState } from "react";
import { SystemPrompt, SystemPromptDeployment, SystemPromptVersion } from "../types";
import { mockPrompts, mockVersions, mockDeployments } from "../data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Cloud,
  CloudOff,
  FileTextIcon,
  History,
  Info,
  Loader2,
  PlayCircle,
  RocketIcon,
  Settings,
  ShieldAlert,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PromptDeployment() {
  const [prompts] = useState<SystemPrompt[]>(mockPrompts);
  const [versions] = useState<SystemPromptVersion[]>(mockVersions);
  const [deployments] = useState<SystemPromptDeployment[]>(mockDeployments);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [deploymentInProgress, setDeploymentInProgress] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [deployablePrompts, setDeployablePrompts] = useState<SystemPrompt[]>(
    prompts.filter((p) => p.isActive && !p.deployedVersion)
  );

  // Get deployed prompts
  const deployedPrompts = prompts.filter((p) => p.deployedVersion !== null);

  // Get active deployments scheduled for future
  const scheduledDeployments = deployments.filter(
    (d) => d.status === "scheduled" && d.scheduledFor && new Date(d.scheduledFor) > new Date()
  );

  // Get deployment history
  const deploymentHistory = deployments
    .filter((d) => d.status === "completed" || d.status === "failed")
    .sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());

  // Format date
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

  // Calculate time until deployment
  const calculateTimeUntil = (dateString: string) => {
    const now = new Date();
    const deployDate = new Date(dateString);
    const diffInMs = deployDate.getTime() - now.getTime();

    if (diffInMs <= 0) return "Deploying now";

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
    }

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
  };

  // Handle prompt selection
  const togglePromptSelection = (promptId: string) => {
    if (selectedPrompts.includes(promptId)) {
      setSelectedPrompts(selectedPrompts.filter((id) => id !== promptId));
    } else {
      setSelectedPrompts([...selectedPrompts, promptId]);
    }
  };

  // Handle deploy button click
  const handleDeploy = () => {
    setDeploymentInProgress(true);
    setDeploymentError(null);

    // Simulate API call delay
    setTimeout(() => {
      // Simulate successful deployment
      setDeploymentInProgress(false);
      setDeploymentComplete(true);

      // Reset after showing success message
      setTimeout(() => {
        setDeploymentComplete(false);
        setSelectedPrompts([]);
        // Update the deployable prompts list (simulating that they're now deployed)
        setDeployablePrompts(deployablePrompts.filter((p) => !selectedPrompts.includes(p.id)));
      }, 3000);
    }, 2000);
  };

  // Get deployment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="mx-auto flex items-center justify-center">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="mx-auto flex items-center justify-center">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="mx-auto flex items-center justify-center">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="mx-auto flex items-center justify-center">
            <Timer className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="mx-auto flex items-center justify-center">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">System Prompt Deployment</h3>
        <p className="text-muted-foreground text-sm">
          Deploy system prompts to make them available in the chat interface. Changes take
          approximately 1 minute to propagate.
        </p>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Deployments</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Prompts</TabsTrigger>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {deployedPrompts.length > 0 || scheduledDeployments.length > 0 ? (
            <div className="space-y-6">
              {/* Currently deployed prompts */}
              {deployedPrompts.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Currently Deployed Prompts</h4>
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Prompt Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="w-[120px]">Version</TableHead>
                          <TableHead className="w-[180px]">Deployed On</TableHead>
                          <TableHead className="w-[180px]">Deployed By</TableHead>
                          <TableHead className="w-[100px] text-center">Environment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deployedPrompts.map((prompt) => {
                          // Find the deployment record for this prompt
                          const deployment = deployments.find(
                            (d) =>
                              d.promptId === prompt.id && d.versionId === prompt.deployedVersion
                          );

                          // Find the version record
                          const version = versions.find((v) => v.id === prompt.deployedVersion);

                          return (
                            <TableRow key={prompt.id}>
                              <TableCell className="font-medium">{prompt.name}</TableCell>
                              <TableCell className="capitalize">{prompt.category}</TableCell>
                              <TableCell>v{version?.versionNumber || "?"}</TableCell>
                              <TableCell>
                                {deployment ? formatDate(deployment.deployedAt) : "Unknown"}
                              </TableCell>
                              <TableCell>{deployment?.deployedByName || "System"}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="capitalize">
                                  {deployment?.environment || "production"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Scheduled deployments */}
              {scheduledDeployments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Scheduled Deployments</h4>
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Prompt Name</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead className="w-[180px]">Scheduled For</TableHead>
                          <TableHead className="w-[150px]">Time Remaining</TableHead>
                          <TableHead className="w-[100px] text-center">Status</TableHead>
                          <TableHead className="w-[100px] text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledDeployments.map((deployment) => {
                          // Find the prompt
                          const prompt = prompts.find((p) => p.id === deployment.promptId);

                          // Find the version
                          const version = versions.find((v) => v.id === deployment.versionId);

                          return (
                            <TableRow key={deployment.id}>
                              <TableCell className="font-medium">
                                {prompt?.name || "Unknown Prompt"}
                              </TableCell>
                              <TableCell>v{version?.versionNumber || "?"}</TableCell>
                              <TableCell>
                                {deployment.scheduledFor
                                  ? formatDate(deployment.scheduledFor)
                                  : "Unknown"}
                              </TableCell>
                              <TableCell>
                                {deployment.scheduledFor
                                  ? calculateTimeUntil(deployment.scheduledFor)
                                  : "Unknown"}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(deployment.status)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive">
                                  Cancel
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border p-8">
              <Cloud className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-xl font-medium">No Active Deployments</h3>
              <p className="text-muted-foreground mt-1 max-w-md text-center">
                There are no active deployments at this time. Deploy a prompt using the "Deploy
                Prompts" tab.
              </p>
              <Button className="mt-4" onClick={() => setActiveTab("deploy")}>
                Go to Deployment
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          {deployablePrompts.length > 0 ? (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <Checkbox
                          id="select-all"
                          checked={
                            selectedPrompts.length === deployablePrompts.length &&
                            deployablePrompts.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPrompts(deployablePrompts.map((p) => p.id));
                            } else {
                              setSelectedPrompts([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="w-[250px]">Prompt Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[120px]">Version</TableHead>
                      <TableHead className="w-[180px]">Last Updated</TableHead>
                      <TableHead className="w-[180px]">Author</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deployablePrompts.map((prompt) => {
                      const lastVersion = versions
                        .filter((v) => v.promptId === prompt.id)
                        .sort((a, b) => b.versionNumber - a.versionNumber)[0];

                      return (
                        <TableRow key={prompt.id}>
                          <TableCell>
                            <Checkbox
                              id={`select-${prompt.id}`}
                              checked={selectedPrompts.includes(prompt.id)}
                              onCheckedChange={() => togglePromptSelection(prompt.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{prompt.name}</TableCell>
                          <TableCell className="capitalize">{prompt.category}</TableCell>
                          <TableCell>v{lastVersion?.versionNumber || "1"}</TableCell>
                          <TableCell>{formatDate(prompt.updatedAt)}</TableCell>
                          <TableCell>{prompt.authorName}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  {selectedPrompts.length > 0 ? (
                    <span>
                      Selected {selectedPrompts.length} prompt
                      {selectedPrompts.length !== 1 ? "s" : ""} for deployment
                    </span>
                  ) : (
                    <span>Select prompts to deploy</span>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={selectedPrompts.length === 0 || deploymentInProgress}>
                      {deploymentInProgress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <RocketIcon className="mr-2 h-4 w-4" />
                          Deploy Selected
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deployment</DialogTitle>
                      <DialogDescription>
                        You are about to deploy {selectedPrompts.length} prompt
                        {selectedPrompts.length !== 1 ? "s" : ""} to production. This will replace
                        any existing deployed prompts with the same name.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Changes will take approximately 1 minute to propagate to all systems.
                          During this time, some users may receive responses using the previous
                          prompt.
                        </AlertDescription>
                      </Alert>

                      <div className="max-h-60 overflow-y-auto rounded-md border p-3">
                        <div className="space-y-2">
                          {selectedPrompts.map((promptId) => {
                            const prompt = prompts.find((p) => p.id === promptId);
                            return prompt ? (
                              <div key={prompt.id} className="flex items-center space-x-2">
                                <FileTextIcon className="text-muted-foreground h-4 w-4" />
                                <span>{prompt.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}} disabled={deploymentInProgress}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeploy}
                        disabled={deploymentInProgress}
                        className="min-w-[120px]">
                        {deploymentInProgress ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deploying...
                          </>
                        ) : deploymentComplete ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Deployed!
                          </>
                        ) : (
                          <>
                            <RocketIcon className="mr-2 h-4 w-4" />
                            Deploy Now
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border p-8">
              <CloudOff className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-xl font-medium">No Deployable Prompts</h3>
              <p className="text-muted-foreground mt-1 max-w-md text-center">
                There are no active prompts available for deployment. Create a new prompt or
                activate an existing one in the "Current Prompts" tab.
              </p>
              <Button className="mt-4" onClick={() => setActiveTab("active")}>
                Go to Active Deployments
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {deploymentHistory.length > 0 ? (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Prompt Name</TableHead>
                    <TableHead className="w-[120px]">Version</TableHead>
                    <TableHead className="w-[180px]">Deployed On</TableHead>
                    <TableHead className="w-[180px]">Deployed By</TableHead>
                    <TableHead className="w-[130px] text-center">Environment</TableHead>
                    <TableHead className="w-[100px] text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deploymentHistory.map((deployment) => {
                    // Find the prompt
                    const prompt = prompts.find((p) => p.id === deployment.promptId);

                    // Find the version
                    const version = versions.find((v) => v.id === deployment.versionId);

                    return (
                      <TableRow
                        key={deployment.id}
                        className={cn(deployment.status === "failed" && "bg-destructive/5")}>
                        <TableCell className="font-medium">
                          {prompt?.name || "Unknown Prompt"}
                        </TableCell>
                        <TableCell>v{version?.versionNumber || "?"}</TableCell>
                        <TableCell>{formatDate(deployment.deployedAt)}</TableCell>
                        <TableCell>{deployment.deployedByName}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="capitalize">
                            {deployment.environment}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(deployment.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border p-8">
              <History className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-xl font-medium">No Deployment History</h3>
              <p className="text-muted-foreground mt-1 max-w-md text-center">
                There is no deployment history available. Deploy a prompt to start building history.
              </p>
              <Button className="mt-4" onClick={() => setActiveTab("deploy")}>
                Go to Deployment
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
