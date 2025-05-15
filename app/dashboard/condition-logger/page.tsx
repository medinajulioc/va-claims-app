"use client";

import { useState, useEffect } from "react";
import { conditions, Condition } from "@/lib/conditions";
import { mockLogs } from "@/lib/mockData";
import { ConditionCard } from "@/components/condition-logger/ConditionCard";
import { DynamicForm } from "@/components/condition-logger/DynamicForm";
import { LogTable } from "@/components/condition-logger/LogTable";
import { LogDetailDialog } from "@/components/condition-logger/LogDetailDialog";
import { ProgressCard } from "@/components/condition-logger/ProgressCard";
import { ClaimsTracker } from "@/components/condition-logger/ClaimsTracker";
import { CorrelationView } from "@/components/condition-logger/CorrelationView";
import { toast } from "sonner";
import { AlertCircle, BarChart2, Calendar, LineChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

export default function ConditionLoggerPage() {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasFlareUp, setHasFlareUp] = useState(false);
  const [activeTab, setActiveTab] = useState("log");
  const [dashboardTab, setDashboardTab] = useState("logger");

  // Load logs from localStorage or use mock data
  useEffect(() => {
    const storedLogs = localStorage.getItem("conditionLogs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      setLogs(mockLogs);
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conditionLogs", JSON.stringify(logs));
  }, [logs]);

  // Check for flare-ups
  useEffect(() => {
    if (logs.length > 0) {
      const recentLogs = [...logs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Check the most recent log for each condition
      const conditionMap = new Map<string, Log>();
      recentLogs.forEach((log) => {
        if (!conditionMap.has(log.condition)) {
          conditionMap.set(log.condition, log);
        }
      });

      // Check if any recent log has severity above the flare-up threshold
      let hasFlare = false;
      conditionMap.forEach((log) => {
        const condition = conditions.find((c) => c.name === log.condition);
        if (
          condition?.flareUpThreshold &&
          log.data.severity >= condition.flareUpThreshold.severity
        ) {
          hasFlare = true;
        }
      });

      setHasFlareUp(hasFlare);
    }
  }, [logs]);

  const handleSelectCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    setActiveTab("log"); // Switch to log tab when selecting a condition
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (!selectedCondition) return;

    // Create a new log entry
    const newLog: Log = {
      id: Date.now().toString(),
      condition: selectedCondition.name,
      data,
      timestamp: new Date().toISOString()
    };

    // Add the new log to the logs array
    setLogs((prevLogs) => [newLog, ...prevLogs]);

    // Show success message
    toast.success(`${selectedCondition.name} symptoms logged successfully`);

    // Check for flare-up
    if (
      selectedCondition.flareUpThreshold &&
      data.severity >= selectedCondition.flareUpThreshold.severity
    ) {
      toast.warning(
        `Flare-up detected! Your ${selectedCondition.name.toLowerCase()} severity is high.`,
        {
          duration: 5000
        }
      );
    }

    // Switch to history tab after logging
    setActiveTab("history");
  };

  const handleDeleteLog = (id: string) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this log?")) {
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
      toast.success("Log deleted successfully");
    }
  };

  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  // Get logs for the selected condition
  const getConditionLogs = () => {
    if (!selectedCondition) return [];
    return logs.filter((log) => log.condition === selectedCondition.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Condition Logger</h1>
          <p className="text-muted-foreground">
            Track and document your symptoms for VA disability claims
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {hasFlareUp && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Flare-Up Detected</AlertTitle>
            <AlertDescription>
              One or more of your conditions has reached flare-up level severity. Consider seeking
              medical attention if symptoms persist.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={dashboardTab} onValueChange={setDashboardTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="logger">
              <Calendar className="mr-2 h-4 w-4" />
              Logger
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="claims">
              <BarChart2 className="mr-2 h-4 w-4" />
              Claims
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logger" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card col-span-full rounded-lg border p-6 shadow">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-2xl leading-none font-semibold tracking-tight">
                    Getting Started
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Select a condition below to start logging your symptoms. Regular logging helps
                    establish a record of your condition for VA disability claims.
                  </p>
                </div>
              </div>
            </div>

            {/* Condition cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {conditions.map((condition) => (
                <ConditionCard
                  key={condition.name}
                  condition={condition}
                  onSelect={handleSelectCondition}
                  isSelected={selectedCondition?.name === condition.name}
                />
              ))}
            </div>

            {/* Dynamic form and logs */}
            {selectedCondition && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="log">Log Symptoms</TabsTrigger>
                  <TabsTrigger value="history">View History</TabsTrigger>
                </TabsList>

                <TabsContent value="log">
                  <Card className="bg-card rounded-lg border p-6 shadow">
                    <h3 className="mb-4 text-xl font-semibold">
                      {selectedCondition.name} Symptom Logger
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Log your {selectedCondition.name.toLowerCase()} symptoms below. Regular
                      tracking helps establish patterns and provides documentation for your VA
                      disability claim.
                    </p>
                    <DynamicForm condition={selectedCondition} onSubmit={handleFormSubmit} />
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="bg-card rounded-lg border p-6 shadow">
                    <LogTable
                      logs={logs}
                      selectedCondition={selectedCondition.name}
                      onDeleteLog={handleDeleteLog}
                      onViewDetails={handleViewDetails}
                    />
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* All logs table when no condition is selected */}
            {!selectedCondition && (
              <div className="bg-card rounded-lg border p-6 shadow">
                <LogTable
                  logs={logs}
                  onDeleteLog={handleDeleteLog}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Progress Card */}
              <ProgressCard logs={logs} />

              {/* Correlation View */}
              <CorrelationView logs={logs} />
            </div>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            {/* Claims Tracker */}
            <ClaimsTracker />
          </TabsContent>
        </Tabs>
      </div>

      {/* Log detail dialog */}
      <LogDetailDialog log={selectedLog} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
