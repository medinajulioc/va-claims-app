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
import { motion, AnimatePresence } from "framer-motion";

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

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const tabTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <motion.div
      className="space-y-6 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <h1 className="text-3xl font-bold tracking-tight">Condition Logger</h1>
          <p className="text-muted-foreground">
            Track and document your symptoms for VA disability claims
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {hasFlareUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Flare-Up Detected</AlertTitle>
                <AlertDescription>
                  One or more of your conditions has reached flare-up level severity. Consider
                  seeking medical attention if symptoms persist.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Tabs */}
        <Tabs value={dashboardTab} onValueChange={setDashboardTab} className="w-full">
          <TabsList className="bg-muted/50 mb-6 grid w-full grid-cols-3 p-1">
            <TabsTrigger
              value="logger"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Logger
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="claims"
              className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
              <BarChart2 className="mr-2 h-4 w-4" />
              Claims
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabTransition}>
              <TabsContent value="logger" className="mt-0 space-y-6">
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-card col-span-full rounded-lg border p-6 shadow-sm">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-2xl leading-none font-semibold tracking-tight">
                        Getting Started
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Select a condition below to start logging your symptoms. Regular logging
                        helps establish a record of your condition for VA disability claims.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Condition cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={condition.name}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}>
                      <ConditionCard
                        condition={condition}
                        onSelect={handleSelectCondition}
                        isSelected={selectedCondition?.name === condition.name}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Dynamic form and logs */}
                <AnimatePresence mode="wait">
                  {selectedCondition && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-muted/50 mb-4 grid w-full grid-cols-2 p-1">
                          <TabsTrigger
                            value="log"
                            className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
                            Log Symptoms
                          </TabsTrigger>
                          <TabsTrigger
                            value="history"
                            className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
                            View History
                          </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}>
                            <TabsContent value="log" className="mt-0">
                              <Card className="bg-card rounded-lg border p-6 shadow-sm">
                                <h3 className="mb-4 text-xl font-semibold">
                                  {selectedCondition.name} Symptom Logger
                                </h3>
                                <p className="text-muted-foreground mb-6 text-sm">
                                  Log your {selectedCondition.name.toLowerCase()} symptoms below.
                                  Regular tracking helps establish patterns and provides
                                  documentation for your VA disability claim.
                                </p>
                                <DynamicForm
                                  condition={selectedCondition}
                                  onSubmit={handleFormSubmit}
                                />
                              </Card>
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                              <Card className="bg-card rounded-lg border p-6 shadow-sm">
                                <LogTable
                                  logs={logs}
                                  selectedCondition={selectedCondition.name}
                                  onDeleteLog={handleDeleteLog}
                                  onViewDetails={handleViewDetails}
                                />
                              </Card>
                            </TabsContent>
                          </motion.div>
                        </AnimatePresence>
                      </Tabs>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* All logs table when no condition is selected */}
                <AnimatePresence>
                  {!selectedCondition && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-card rounded-lg border p-6 shadow-sm">
                      <LogTable
                        logs={logs}
                        onDeleteLog={handleDeleteLog}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabTransition}>
              <TabsContent value="analytics" className="mt-0 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Progress Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}>
                    <ProgressCard logs={logs} />
                  </motion.div>

                  {/* Correlation View */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <CorrelationView logs={logs} />
                  </motion.div>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabTransition}>
              <TabsContent value="claims" className="mt-0 space-y-6">
                {/* Claims Tracker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}>
                  <ClaimsTracker />
                </motion.div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Log detail dialog */}
      <LogDetailDialog log={selectedLog} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </motion.div>
  );
}
