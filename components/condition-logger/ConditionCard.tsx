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
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileText
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Icon from "@/components/icon";

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
        "bg-card relative cursor-pointer overflow-hidden transition-all duration-300",
        isHovered ? "border-primary/50 -translate-y-1 transform shadow-md" : "shadow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Make the entire card trigger the log action
        e.stopPropagation();
        onLogClick();
      }}>
      {/* Simplified gradient background with no dots pattern */}
      <div
        className={cn(
          "absolute inset-0 z-0 opacity-10 transition-opacity duration-300",
          isHovered && "opacity-20"
        )}
        style={{
          background: `linear-gradient(135deg, ${condition.color || "#888"} 0%, transparent 80%)`
        }}
      />

      {/* Card content */}
      <div className="relative z-10">
        <CardHeader className="pt-3 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <CardTitle className="line-clamp-1 text-lg font-semibold">{condition.name}</CardTitle>
              <CardDescription className="mt-0.5 line-clamp-2 text-xs">
                {condition.description}
              </CardDescription>
            </div>
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${condition.color}15`, color: condition.color }}>
              {condition.icon ? (
                <Icon name={condition.icon} className="h-5 w-5" />
              ) : (
                <Activity className="h-5 w-5" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-1">
          {totalLogs > 0 ? (
            <div className="space-y-3">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-md p-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Total Logs</div>
                    <FileText className="text-muted-foreground ml-1 h-3 w-3 flex-shrink-0" />
                  </div>
                  <div className="mt-0.5 text-lg font-semibold">{totalLogs}</div>
                </div>

                <div className="bg-muted/30 rounded-md p-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Last Log</div>
                    <Calendar className="text-muted-foreground ml-1 h-3 w-3 flex-shrink-0" />
                  </div>
                  <div className="mt-0.5 flex items-center">
                    <span className="truncate text-xs font-medium">
                      {mostRecentLog ? formatDate(mostRecentLog.timestamp) : "N/A"}
                    </span>
                    {daysSinceLastLog !== null && (
                      <span
                        className={`ml-1 text-xs ${getDaysSinceColor(daysSinceLastLog)} whitespace-nowrap`}>
                        ({daysSinceLastLog}d ago)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* VA Rating and Severity */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-md p-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Avg Severity</div>
                    <AlertCircle className="text-muted-foreground ml-1 h-3 w-3 flex-shrink-0" />
                  </div>
                  <div className={`mt-0.5 text-lg font-semibold ${getSeverityColor(avgSeverity)}`}>
                    {avgSeverity}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-md p-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">VA Rating</div>
                    <CheckCircle2 className="text-muted-foreground ml-1 h-3 w-3 flex-shrink-0" />
                  </div>
                  <div className={`mt-0.5 text-lg font-semibold ${getVARatingColor(vaRating)}`}>
                    {vaRating}
                  </div>
                </div>
              </div>

              {/* Prostrating stats - simplified */}
              <div className="bg-muted/30 rounded-md p-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-xs">Prostrating Attacks</div>
                  <span className="ml-1 text-xs font-medium whitespace-nowrap">
                    {prostratingCount} ({prostratingPercentage}%)
                  </span>
                </div>
                <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${prostratingPercentage}%` }}
                  />
                </div>
              </div>

              {/* Log button centered at bottom of stats */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogClick();
                }}
                variant="secondary"
                size="sm"
                className="w-full transition-all duration-300">
                Log {condition.name}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-muted-foreground mb-3 max-w-[90%] text-xs">
                Track your {condition.name.toLowerCase()} symptoms to build your VA claim evidence
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogClick();
                }}
                size="sm"
                className="w-full max-w-[90%]">
                Log {condition.name}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-1 pb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewHistory();
                  }}
                  disabled={totalLogs === 0}
                  className="h-8 flex-1">
                  <FileText className="mr-1 h-3.5 w-3.5" />
                  History
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {totalLogs > 0 ? `View ${totalLogs} log entries` : "No logs to view yet"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTrends();
                  }}
                  disabled={totalLogs < 2}
                  className="ml-1 h-8 flex-1">
                  <BarChart2 className="mr-1 h-3.5 w-3.5" />
                  Trends
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {totalLogs >= 2 ? "View patterns and analytics" : "Need at least 2 logs for trends"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </div>
    </Card>
  );
}
