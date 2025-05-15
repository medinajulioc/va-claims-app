"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface ProgressCardProps {
  logs: Log[];
}

export const ProgressCard = ({ logs }: ProgressCardProps) => {
  const progressData = useMemo(() => {
    // Get unique days logged
    const uniqueDays = new Set(logs.map((log) => log.timestamp.split("T")[0])).size;

    // Count logs per condition
    const conditionCounts: Record<string, number> = {};
    logs.forEach((log) => {
      conditionCounts[log.condition] = (conditionCounts[log.condition] || 0) + 1;
    });

    // Calculate consecutive days logged (simplified version)
    const sortedDates = [...new Set(logs.map((log) => log.timestamp.split("T")[0]))].sort();
    let consecutiveDays = 0;
    if (sortedDates.length > 0) {
      consecutiveDays = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          consecutiveDays++;
        } else {
          break;
        }
      }
    }

    return {
      uniqueDays,
      conditionCounts,
      consecutiveDays,
      totalLogs: logs.length
    };
  }, [logs]);

  // Target is 30 days of logging
  const progressPercentage = Math.min((progressData.uniqueDays / 30) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Progress Tracking
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Regular symptom logging strengthens your VA disability claim</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-sm font-medium">
                  Days Logged: {progressData.uniqueDays}/30
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total unique days with at least one symptom logged</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-muted-foreground text-sm">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" aria-label="Logging progress" />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">
            Consecutive Days: {progressData.consecutiveDays}
          </h4>
          <div className="space-y-1">
            {Object.entries(progressData.conditionCounts).map(([condition, count]) => (
              <div key={condition} className="flex items-center justify-between">
                <span className="text-sm">{condition}:</span>
                <span className="text-sm font-medium">{count} logs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          <p>Total logs: {progressData.totalLogs}</p>
        </div>
      </CardContent>
    </Card>
  );
};
