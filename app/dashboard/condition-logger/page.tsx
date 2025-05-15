"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { conditions } from "@/lib/conditions";
import { mockLogs } from "@/lib/mock/mockLogs";
import { templates } from "@/lib/templates";
import { ConditionCard } from "@/components/condition-logger/ConditionCard";
import { DynamicForm } from "@/components/condition-logger/DynamicForm";
import { TrendsView } from "@/components/condition-logger/TrendsView";
import { LogTable } from "@/components/condition-logger/LogTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Search,
  FileDown,
  BarChart2,
  ListFilter,
  Calendar,
  FileText,
  Info,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConditionLoggerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const viewParam = searchParams.get("view") || "dashboard";
  const conditionParam = searchParams.get("condition");
  const logIdParam = searchParams.get("logId");

  // State
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(conditionParam);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [isEditingLog, setIsEditingLog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(viewParam);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "90days" | "year">("month");

  // Load logs from localStorage on mount
  useEffect(() => {
    const storedLogs = localStorage.getItem("conditionLogs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      // Use mock data if no logs exist
      setLogs(mockLogs);
      localStorage.setItem("conditionLogs", JSON.stringify(mockLogs));
    }
  }, []);

  // Set up event listener for timeframe changes
  useEffect(() => {
    const handleTimeframeChange = (event: CustomEvent) => {
      setTimeframe(event.detail as "week" | "month" | "90days" | "year");
    };

    window.addEventListener("set-timeframe", handleTimeframeChange as EventListener);

    return () => {
      window.removeEventListener("set-timeframe", handleTimeframeChange as EventListener);
    };
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    if (conditionParam) {
      setSelectedCondition(conditionParam);
    }

    if (viewParam) {
      setActiveTab(viewParam);
    }

    if (logIdParam) {
      const log = logs.find((log) => log.id === logIdParam);
      if (log) {
        setSelectedLog(log);
        setIsEditingLog(true);
        setIsLoggingOpen(true);
      }
    }
  }, [conditionParam, viewParam, logIdParam, logs]);

  // Update URL when tab changes
  const updateUrl = (view: string, condition: string | null = null) => {
    const params = new URLSearchParams();
    params.set("view", view);
    if (condition) {
      params.set("condition", condition);
    }
    router.push(`/dashboard/condition-logger?${params.toString()}`);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateUrl(value, selectedCondition);
  };

  // Handle condition selection
  const handleConditionSelect = (conditionId: string) => {
    setSelectedCondition(conditionId);
    setIsLoggingOpen(true);
  };

  // Handle log submission
  const handleLogSubmit = (data: any) => {
    if (isEditingLog && selectedLog) {
      // Update existing log
      const updatedLogs = logs.map((log) =>
        log.id === selectedLog.id ? { ...selectedLog, data } : log
      );
      setLogs(updatedLogs);
      localStorage.setItem("conditionLogs", JSON.stringify(updatedLogs));
      toast.success("Log updated successfully");
    } else {
      // Create new log
      const newLog = {
        id: uuidv4(),
        condition: selectedCondition,
        data,
        timestamp: new Date().toISOString()
      };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      localStorage.setItem("conditionLogs", JSON.stringify(updatedLogs));
      toast.success("Symptom logged successfully");
    }

    setIsLoggingOpen(false);
    setIsEditingLog(false);
    setSelectedLog(null);
  };

  // Handle log editing
  const handleEditLog = (log: any) => {
    setSelectedLog(log);
    setSelectedCondition(log.condition);
    setIsEditingLog(true);
    setIsLoggingOpen(true);
  };

  // Handle log deletion
  const handleDeleteLog = (log: any) => {
    setLogToDelete(log);
    setIsDeleteDialogOpen(true);
  };

  // Confirm log deletion
  const confirmDeleteLog = () => {
    if (!logToDelete) return;

    const updatedLogs = logs.filter((log) => log.id !== logToDelete.id);
    setLogs(updatedLogs);
    localStorage.setItem("conditionLogs", JSON.stringify(updatedLogs));

    setIsDeleteDialogOpen(false);
    setLogToDelete(null);
    toast.success("Log deleted successfully");
  };

  // Export logs as JSON
  const handleExportLogs = (logsToExport = logs) => {
    const dataStr = JSON.stringify(logsToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `condition-logs-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Filter conditions by search term
  const filteredConditions = conditions.filter(
    (condition) =>
      condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get condition logs
  const conditionLogs = selectedCondition
    ? logs.filter((log) => log.condition === selectedCondition)
    : logs;

  // Find selected condition object
  const selectedConditionObj = conditions.find((c) => c.id === selectedCondition);

  // Get condition field templates
  const conditionTemplates = selectedCondition
    ? templates[selectedCondition as keyof typeof templates] || []
    : [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Condition Logger</h1>
          <p className="text-muted-foreground mt-1">
            Track your symptoms to build evidence for your VA disability claim
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCondition(null);
              setActiveTab("dashboard");
              updateUrl("dashboard");
            }}>
            <ListFilter className="mr-2 h-4 w-4" />
            All Conditions
          </Button>

          <Button variant="outline" onClick={() => handleExportLogs()}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>

          <Button
            onClick={() => {
              setSelectedCondition(null);
              setIsLoggingOpen(true);
            }}>
            <Plus className="mr-2 h-4 w-4" />
            Log Symptom
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredConditions.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No conditions match your search</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConditions.map((condition) => (
                <ConditionCard
                  key={condition.id}
                  condition={condition}
                  logs={logs}
                  onLogClick={() => handleConditionSelect(condition.id)}
                  onViewTrends={() => {
                    setSelectedCondition(condition.id);
                    setActiveTab("trends");
                    updateUrl("trends", condition.id);
                  }}
                  onViewHistory={() => {
                    setSelectedCondition(condition.id);
                    setActiveTab("history");
                    updateUrl("history", condition.id);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <LogTable
            logs={logs}
            conditions={conditions}
            onEdit={handleEditLog}
            onDelete={handleDeleteLog}
            onExport={handleExportLogs}
          />
        </TabsContent>

        <TabsContent value="trends">
          {selectedCondition ? (
            <TrendsView
              logs={conditionLogs}
              condition={selectedConditionObj?.name}
              timeframe={timeframe}
            />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <Info className="text-muted-foreground mb-2 h-10 w-10" />
              <p className="text-muted-foreground">Select a condition to view trends</p>
              <div className="mt-4">
                <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Logging Dialog */}
      <Dialog open={isLoggingOpen} onOpenChange={setIsLoggingOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {isEditingLog
                  ? "Edit Log"
                  : selectedCondition
                    ? `Log ${conditions.find((c) => c.id === selectedCondition)?.name} Symptoms`
                    : "Log Symptoms"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsLoggingOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              {isEditingLog
                ? "Update your symptom information below"
                : "Record your symptoms to build evidence for your VA claim"}
            </DialogDescription>
          </DialogHeader>

          <DynamicForm
            conditions={conditions}
            selectedCondition={selectedCondition}
            onConditionChange={setSelectedCondition}
            onSubmit={handleLogSubmit}
            initialValues={selectedLog?.data}
            templates={conditionTemplates}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this log entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
