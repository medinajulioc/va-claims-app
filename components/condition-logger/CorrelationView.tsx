"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface CorrelationViewProps {
  logs: Log[];
}

export const CorrelationView = ({ logs }: CorrelationViewProps) => {
  const correlationData = useMemo(() => {
    // Group logs by date
    const logsByDate: Record<string, Log[]> = {};
    logs.forEach((log) => {
      const date = log.timestamp.split("T")[0];
      if (!logsByDate[date]) {
        logsByDate[date] = [];
      }
      logsByDate[date].push(log);
    });

    // Find dates with multiple conditions logged
    const multiConditionDates = Object.entries(logsByDate)
      .filter(([_, dateLogs]) => {
        const uniqueConditions = new Set(dateLogs.map((log) => log.condition));
        return uniqueConditions.size > 1;
      })
      .map(([date, dateLogs]) => {
        const conditions = dateLogs.map((log) => ({
          name: log.condition,
          severity: log.data.severity || 0
        }));
        return {
          date,
          conditions,
          uniqueConditions: new Set(dateLogs.map((log) => log.condition)).size
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Find common condition pairs
    const conditionPairs: Record<string, number> = {};
    multiConditionDates.forEach(({ conditions }) => {
      for (let i = 0; i < conditions.length; i++) {
        for (let j = i + 1; j < conditions.length; j++) {
          const pair = [conditions[i].name, conditions[j].name].sort().join(" & ");
          conditionPairs[pair] = (conditionPairs[pair] || 0) + 1;
        }
      }
    });

    const topPairs = Object.entries(conditionPairs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      multiConditionDates: multiConditionDates.slice(0, 10), // Show only the 10 most recent
      topPairs
    };
  }, [logs]);

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Condition Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            No logs available for correlation analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Condition Correlation
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Identifies days when multiple conditions were active</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {correlationData.topPairs.length > 0 ? (
          <>
            <div>
              <h3 className="mb-2 text-sm font-medium">Common Condition Pairs</h3>
              <div className="space-y-2">
                {correlationData.topPairs.map(([pair, count]) => (
                  <div key={pair} className="flex items-center justify-between">
                    <span className="text-sm">{pair}</span>
                    <Badge variant="outline">{count} days</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Recent Multi-Condition Days</h3>
              <div className="space-y-3">
                {correlationData.multiConditionDates.map((item) => (
                  <div key={item.date} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <time className="text-sm font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </time>
                      <Badge>{item.uniqueConditions} conditions</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.conditions.map((condition, index) => (
                        <TooltipProvider key={`${item.date}-${condition.name}-${index}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={condition.severity > 5 ? "destructive" : "secondary"}>
                                {condition.name}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Severity: {condition.severity}/10</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No correlations found yet. Log multiple conditions on the same day to see patterns.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
