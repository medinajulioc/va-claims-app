"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Loader2 } from "lucide-react";
import { modelTypes } from "../data";

interface NewJobFormProps {
  onSubmit: (data: { name: string; baseModel: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  selectedDocumentCount: number;
}

export function NewJobForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  selectedDocumentCount 
}: NewJobFormProps) {
  const [name, setName] = useState("");
  const [baseModel, setBaseModel] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, baseModel });
  };

  const isFormValid = name.trim() !== "" && baseModel !== "";

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Fine-Tuning Job</CardTitle>
          <CardDescription>
            Configure the parameters for your new fine-tuning job
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="job-name">Job Name</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Give your fine-tuning job a descriptive name to help identify it later.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="job-name"
              placeholder="E.g., VA Claims Analyzer v1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="base-model">Base Model</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Select the foundation model to fine-tune with your documents. Different models have different capabilities and performance characteristics.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={baseModel} onValueChange={setBaseModel} required>
              <SelectTrigger id="base-model">
                <SelectValue placeholder="Select a base model" />
              </SelectTrigger>
              <SelectContent>
                {modelTypes.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected Documents</span>
              <span className="font-medium">{selectedDocumentCount}</span>
            </div>
            {selectedDocumentCount === 0 ? (
              <p className="text-muted-foreground mt-1 text-xs">
                You need to select at least one document for fine-tuning
              </p>
            ) : selectedDocumentCount < 5 ? (
              <p className="text-amber-500 mt-1 text-xs">
                We recommend at least 5 documents for optimal fine-tuning results
              </p>
            ) : (
              <p className="text-green-500 mt-1 text-xs">
                Good selection! {selectedDocumentCount} documents should provide good results
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || selectedDocumentCount === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 