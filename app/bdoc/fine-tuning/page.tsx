"use client";

import { useState } from "react";
import { generateMeta } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Zap } from "lucide-react";

import { DocumentSelector } from "./components/DocumentSelector";
import { JobsList } from "./components/JobsList";
import { ModelsGallery } from "./components/ModelsGallery";
import { NewJobForm } from "./components/NewJobForm";
import { PerformanceMetrics } from "./components/PerformanceMetrics";

import { 
  fineTuningDocuments, 
  fineTuningJobs, 
  fineTunedModels, 
  modelPerformanceData 
} from "./data";

export default function FineTuningPage() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for selecting/deselecting a document
  const handleSelectDocument = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedDocuments((prev) => [...prev, id]);
    } else {
      setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
    }
  };

  // Handler for selecting/deselecting all documents
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(fineTuningDocuments.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  // Handler for creating a new fine-tuning job
  const handleCreateJob = (data: { name: string; baseModel: string }) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would make an API call to create the job
      console.log("Creating job:", {
        ...data,
        documentIds: selectedDocuments
      });
      
      setIsSubmitting(false);
      setShowNewJobDialog(false);
      // Could add the new job to the jobs list here
    }, 1500);
  };

  // Handler for viewing model metrics
  const handleViewMetrics = (modelId: string) => {
    setSelectedModelId(modelId);
    setShowMetricsDialog(true);
  };

  // Handler for toggling model active status
  const handleToggleModelActive = (modelId: string, active: boolean) => {
    // In a real app, this would make an API call to update the model status
    console.log("Toggling model:", modelId, active);
  };

  // Get the selected model for metrics display
  const selectedModel = selectedModelId 
    ? fineTunedModels.find(model => model.id === selectedModelId) 
    : null;
    
  // Get performance data for the selected model
  const selectedModelPerformance = selectedModelId
    ? modelPerformanceData.filter(data => data.modelId === selectedModelId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Fine-Tuning</h1>
        <Button 
          onClick={() => {
            setShowNewJobDialog(true);
            setActiveTab("documents");
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Fine-Tuning Job
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-4 pt-4">
          <JobsList 
            jobs={fineTuningJobs} 
            onCreateNewJob={() => {
              setShowNewJobDialog(true);
              setActiveTab("documents");
            }}
            onViewJob={(jobId) => {
              // In a real app, this would navigate to a job details page
              console.log("View job:", jobId);
            }}
          />
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4 pt-4">
          <ModelsGallery 
            models={fineTunedModels} 
            onViewMetrics={handleViewMetrics}
            onToggleActive={handleToggleModelActive}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <DocumentSelector 
            documents={fineTuningDocuments}
            selectedDocuments={selectedDocuments}
            onSelectDocument={handleSelectDocument}
            onSelectAll={handleSelectAll}
          />
          
          {selectedDocuments.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowNewJobDialog(true)}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Create Job with Selected Documents
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* New Job Dialog */}
      <Dialog 
        open={showNewJobDialog} 
        onOpenChange={setShowNewJobDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Fine-Tuning Job</DialogTitle>
            <DialogDescription>
              Configure your new fine-tuning job with the selected documents
            </DialogDescription>
          </DialogHeader>
          <NewJobForm 
            onSubmit={handleCreateJob}
            onCancel={() => setShowNewJobDialog(false)}
            isSubmitting={isSubmitting}
            selectedDocumentCount={selectedDocuments.length}
          />
        </DialogContent>
      </Dialog>
      
      {/* Model Metrics Dialog */}
      <Dialog 
        open={showMetricsDialog && selectedModel !== null} 
        onOpenChange={setShowMetricsDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Model Performance Metrics</DialogTitle>
            <DialogDescription>
              Detailed performance analysis for the selected model
            </DialogDescription>
          </DialogHeader>
          {selectedModel && (
            <PerformanceMetrics 
              model={selectedModel}
              performanceData={selectedModelPerformance}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 