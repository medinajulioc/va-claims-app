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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Condition } from "@/lib/conditions";
import {
  PlusCircle,
  BarChart2,
  Clock,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  FileText
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface ConditionCardProps {
  condition: Condition;
  logs: Log[];
  onLogClick: () => void;
  onViewTrends: () => void;
  onViewHistory: () => void;
  className?: string;
}

export function ConditionCard({
  condition,
  logs,
  onLogClick,
  onViewTrends,
  onViewHistory,
  className
}: ConditionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Filter logs for this condition
  const conditionLogs = logs.filter((log) => log.condition === condition.id);

  // Get the most recent log
  const mostRecentLog =
    conditionLogs.length > 0
      ? conditionLogs.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
      : null;

  // Calculate stats
  const totalLogs = conditionLogs.length;
  const prostratingCount = conditionLogs.filter((log) => log.data.prostrating === "Yes").length;
  const prostratingPercentage =
    totalLogs > 0 ? Math.round((prostratingCount / totalLogs) * 100) : 0;

  // Calculate average severity
  const avgSeverity =
    conditionLogs.length > 0
      ? (
          conditionLogs.reduce((sum, log) => sum + (parseInt(log.data.severity) || 0), 0) /
          conditionLogs.length
        ).toFixed(1)
      : "N/A";

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  // Get days since last log
  const daysSinceLastLog = mostRecentLog
    ? Math.floor(
        (new Date().getTime() - new Date(mostRecentLog.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Get severity color
  const getSeverityColor = (severity: string | number) => {
    const severityNum = typeof severity === "string" ? parseFloat(severity) : severity;
    if (severityNum >= 8) return "text-red-500";
    if (severityNum >= 6) return "text-orange-500";
    if (severityNum >= 4) return "text-yellow-500";
    return "text-green-500";
  };

  // Get days since color
  const getDaysSinceColor = (days: number | null) => {
    if (days === null) return "";
    if (days > 30) return "text-green-500";
    if (days > 14) return "text-yellow-500";
    return "text-red-500";
  };

  // Get VA rating based on prostrating attacks
  const getVARating = () => {
    // Calculate monthly rate (assuming logs span at least a month)
    const oldestLog =
      conditionLogs.length > 0
        ? conditionLogs.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )[0]
        : null;

    if (!oldestLog || conditionLogs.length < 2) return "Insufficient data";

    const monthsBetween =
      (new Date().getTime() - new Date(oldestLog.timestamp).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsBetween < 0.5) return "Insufficient data";

    const monthlyRate = prostratingCount / monthsBetween;

    // Check for severe economic inadaptability
    const hasSevereImpact = conditionLogs.some(
      (log) =>
        log.data.impact === "Complete inability to function" ||
        log.data.impact === "Severe limitation"
    );

    if (monthlyRate > 1 && hasSevereImpact) return "50%";
    if (monthlyRate >= 1) return "30%";
    if (monthlyRate >= 0.5) return "10%";
    return "0%";
  };

  const vaRating = getVARating();

  // Get VA rating color
  const getVARatingColor = (rating: string) => {
    if (rating === "50%") return "text-red-500";
    if (rating === "30%") return "text-orange-500";
    if (rating === "10%") return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <Card
      className={cn(
        "bg-card relative overflow-hidden transition-all duration-300",
        isHovered ? "-translate-y-1 transform shadow-md" : "shadow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Background pattern for visual interest */}
      <div
        className="from-primary/5 absolute inset-0 z-0 bg-gradient-to-br to-transparent opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${condition.color || "#888"} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${condition.color || "#888"} 1%, transparent 0%)`,
          backgroundSize: "100px 100px"
        }}
      />

      {/* Card content */}
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">{condition.name}</CardTitle>
              <CardDescription>{condition.description}</CardDescription>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: `${condition.color}20` }}>
              {condition.icon ? (
                <span className="text-2xl" style={{ color: condition.color }}>
                  {condition.icon}
                </span>
              ) : (
                <Activity className="h-6 w-6" style={{ color: condition.color }} />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          {totalLogs > 0 ? (
            <div className="space-y-4">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Total Logs</div>
                    <FileText className="text-muted-foreground h-3 w-3" />
                  </div>
                  <div className="mt-1 text-xl font-semibold">{totalLogs}</div>
                </div>

                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Last Log</div>
                    <Calendar className="text-muted-foreground h-3 w-3" />
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm font-medium">
                      {mostRecentLog ? formatDate(mostRecentLog.timestamp) : "N/A"}
                    </span>
                    {daysSinceLastLog !== null && (
                      <span className={`ml-1 text-xs ${getDaysSinceColor(daysSinceLastLog)}`}>
                        ({daysSinceLastLog}d ago)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* VA Rating and Severity */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Avg Severity</div>
                    <AlertCircle className="text-muted-foreground h-3 w-3" />
                  </div>
                  <div className={`mt-1 text-xl font-semibold ${getSeverityColor(avgSeverity)}`}>
                    {avgSeverity}
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">VA Rating</div>
                    <CheckCircle2 className="text-muted-foreground h-3 w-3" />
                  </div>
                  <div className={`mt-1 text-xl font-semibold ${getVARatingColor(vaRating)}`}>
                    {vaRating}
                  </div>
                </div>
              </div>

              {/* Prostrating stats */}
              <div className="bg-card rounded-lg border p-2">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-xs">Prostrating Attacks</div>
                  <span className="text-sm font-medium">
                    {prostratingCount} ({prostratingPercentage}%)
                  </span>
                </div>
                <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${prostratingPercentage}%` }}
                  />
                </div>
              </div>

              {mostRecentLog && (
                <div className="bg-card rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Last Severity</div>
                    <span
                      className={`font-medium ${getSeverityColor(mostRecentLog.data.severity || 0)}`}>
                      {mostRecentLog.data.severity || "N/A"}
                    </span>
                  </div>
                  {mostRecentLog.data.notes && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {mostRecentLog.data.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-muted mb-3 rounded-full p-3">
                <PlusCircle className="text-muted-foreground h-6 w-6" />
              </div>
              <p className="text-muted-foreground mb-1">No logs recorded yet</p>
              <p className="text-muted-foreground text-sm">
                Track your {condition.name.toLowerCase()} symptoms to build your VA claim evidence
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewHistory}
                  disabled={totalLogs === 0}>
                  <FileText className="mr-1 h-4 w-4" />
                  History
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {totalLogs > 0 ? `View ${totalLogs} log entries` : "No logs to view yet"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onViewTrends} disabled={totalLogs < 2}>
                  <BarChart2 className="mr-1 h-4 w-4" />
                  Trends
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {totalLogs >= 2 ? "View patterns and analytics" : "Need at least 2 logs for trends"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button onClick={onLogClick}>
            <PlusCircle className="mr-1 h-4 w-4" />
            Log Now
          </Button>
        </CardFooter>
      </div>

      {/* Quick action overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300",
          isHovered ? "opacity-100" : ""
        )}>
        <Button variant="default" size="lg" className="shadow-lg" onClick={onLogClick}>
          Log {condition.name} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
