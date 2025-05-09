"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart3, Brain, Database, Download, MoreHorizontal, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FineTunedModel } from "../data";

interface ModelsGalleryProps {
  models: FineTunedModel[];
  onViewMetrics: (modelId: string) => void;
  onToggleActive: (modelId: string, active: boolean) => void;
}

export function ModelsGallery({ models, onViewMetrics, onToggleActive }: ModelsGalleryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fine-Tuned Models</CardTitle>
        <CardDescription>Your available models fine-tuned on VA claims data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.length === 0 ? (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <Brain className="text-muted-foreground mb-2 h-10 w-10" />
              <p className="text-muted-foreground text-center text-sm">
                No fine-tuned models available yet. <br />
                Complete a fine-tuning job to create your first model.
              </p>
            </div>
          ) : (
            models.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      variant={model.status === "active" ? "default" : "outline"}
                      className="mb-2">
                      {model.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Model Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewMetrics(model.id)}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Metrics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export Model
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-1 text-base">{model.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Zap className="mr-1 h-3 w-3" />
                    {model.baseModel}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{model.version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{formatDate(model.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Documents</p>
                      <p className="flex items-center font-medium">
                        <Database className="mr-1 h-3 w-3" />
                        {model.documentsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-medium">{(model.metrics.accuracy * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 flex justify-between border-t px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`active-${model.id}`}
                      checked={model.status === "active"}
                      onCheckedChange={(checked) => onToggleActive(model.id, checked)}
                    />
                    <Label htmlFor={`active-${model.id}`}>
                      {model.status === "active" ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onViewMetrics(model.id)}>
                    Metrics
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
