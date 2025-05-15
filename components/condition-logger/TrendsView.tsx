"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, AlertCircle, BarChart2, CloudRain, Moon, Calendar } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface TrendsViewProps {
  logs: Log[];
  condition?: string;
  timeframe?: "week" | "month" | "90days" | "year";
}

// Simple bar chart component
const BarChart = ({
  data,
  maxValue,
  label,
  valueLabel,
  colorFn
}: {
  data: Array<{ label: string; value: number }>;
  maxValue: number;
  label: string;
  valueLabel: string;
  colorFn?: (value: number) => string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{valueLabel}</span>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = Math.min((item.value / maxValue) * 100, 100);
          const barColor = colorFn ? colorFn(item.value) : "bg-primary";

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Donut chart for simple percentages
const DonutChart = ({
  percentage,
  label,
  size = 100,
  strokeWidth = 10,
  color = "stroke-primary"
}: {
  percentage: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="stroke-muted fill-none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className={`fill-none ${color}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm">{label}</span>
    </div>
  );
};

export function TrendsView({
  logs,
  condition = "Headaches",
  timeframe = "month"
}: TrendsViewProps) {
  // Filter logs to only include the specified condition and timeframe
  const filteredLogs = useMemo(() => {
    let filtered = logs.filter((log) => log.condition === condition);

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeframe) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "90days":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return filtered.filter((log) => new Date(log.timestamp) >= cutoffDate);
  }, [logs, condition, timeframe]);

  // Calculate prostrating attack frequency
  const prostratingStats = useMemo(() => {
    const prostratingLogs = filteredLogs.filter((log) => log.data.prostrating === "Yes");
    const totalCount = prostratingLogs.length;

    // Calculate per month frequency for VA rating criteria
    const daysInTimeframe =
      timeframe === "week" ? 7 : timeframe === "month" ? 30 : timeframe === "90days" ? 90 : 365;

    const monthlyRate = (totalCount / daysInTimeframe) * 30;

    // Determine VA rating based on monthly prostrating attacks
    let vaRating = "0%";
    if (monthlyRate >= 1) {
      vaRating = "30%";
      if (
        monthlyRate > 2 &&
        filteredLogs.some(
          (log) =>
            log.data.impact === "Complete inability to function" ||
            log.data.impact === "Severe limitation"
        )
      ) {
        vaRating = "50%";
      }
    } else if (monthlyRate >= 0.5) {
      vaRating = "10%";
    }

    return {
      total: totalCount,
      monthlyRate: monthlyRate.toFixed(1),
      vaRating,
      percentage: (totalCount / filteredLogs.length) * 100 || 0
    };
  }, [filteredLogs, timeframe]);

  // Identify trigger patterns
  const triggerPatterns = useMemo(() => {
    const allTriggers: Record<string, { count: number; severity: number }> = {};
    let totalWithTriggers = 0;

    filteredLogs.forEach((log) => {
      if (log.data.triggers && Array.isArray(log.data.triggers)) {
        totalWithTriggers++;
        log.data.triggers.forEach((trigger: string) => {
          if (!allTriggers[trigger]) {
            allTriggers[trigger] = { count: 0, severity: 0 };
          }
          allTriggers[trigger].count++;
          allTriggers[trigger].severity += parseInt(log.data.severity) || 0;
        });
      }
    });

    // Calculate percentages and average severity
    const triggerStats = Object.entries(allTriggers).map(([trigger, stats]) => ({
      trigger,
      count: stats.count,
      percentage: totalWithTriggers ? Math.round((stats.count / totalWithTriggers) * 100) : 0,
      avgSeverity: stats.count ? (stats.severity / stats.count).toFixed(1) : "0"
    }));

    // Sort by frequency
    return triggerStats.sort((a, b) => b.count - a.count);
  }, [filteredLogs]);

  // Analyze sleep quality correlation
  const sleepCorrelation = useMemo(() => {
    const sleepData: Record<string, { count: number; severity: number }> = {};

    filteredLogs.forEach((log) => {
      if (log.data.sleepQuality) {
        const quality = log.data.sleepQuality;
        if (!sleepData[quality]) {
          sleepData[quality] = { count: 0, severity: 0 };
        }
        sleepData[quality].count++;
        sleepData[quality].severity += parseInt(log.data.severity) || 0;
      }
    });

    // Calculate average severity by sleep quality
    const correlation = Object.entries(sleepData).map(([quality, stats]) => ({
      quality,
      count: stats.count,
      avgSeverity: stats.count ? (stats.severity / stats.count).toFixed(1) : "0"
    }));

    // Sort by sleep quality (assuming format like "1 - Very poor")
    return correlation.sort((a, b) => {
      const aNum = parseInt(a.quality.split(" ")[0]);
      const bNum = parseInt(b.quality.split(" ")[0]);
      return aNum - bNum;
    });
  }, [filteredLogs]);

  // Analyze weather correlation
  const weatherCorrelation = useMemo(() => {
    const weatherTerms = ["sunny", "cloudy", "rain", "storm", "pressure", "humid", "hot", "cold"];
    const weatherData: Record<string, { count: number; severity: number }> = {};

    filteredLogs.forEach((log) => {
      if (log.data.weather) {
        const weather = log.data.weather.toLowerCase();

        weatherTerms.forEach((term) => {
          if (weather.includes(term)) {
            if (!weatherData[term]) {
              weatherData[term] = { count: 0, severity: 0 };
            }
            weatherData[term].count++;
            weatherData[term].severity += parseInt(log.data.severity) || 0;
          }
        });
      }
    });

    // Calculate average severity by weather condition
    const correlation = Object.entries(weatherData).map(([condition, stats]) => ({
      condition,
      count: stats.count,
      avgSeverity: stats.count ? (stats.severity / stats.count).toFixed(1) : "0"
    }));

    // Sort by frequency
    return correlation.sort((a, b) => b.count - a.count);
  }, [filteredLogs]);

  // Calculate average severity and duration
  const overallStats = useMemo(() => {
    if (!filteredLogs.length) return { avgSeverity: "0", avgDuration: "0", total: 0 };

    const totalSeverity = filteredLogs.reduce(
      (sum, log) => sum + (parseInt(log.data.severity) || 0),
      0
    );
    const totalDuration = filteredLogs.reduce((sum, log) => {
      // Handle both number and string duration formats
      const duration = log.data.duration;
      if (typeof duration === "number") {
        return sum + duration;
      } else if (typeof duration === "string") {
        // Try to extract a number from strings like "4 hours"
        const match = duration.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
      }
      return sum;
    }, 0);

    return {
      avgSeverity: (totalSeverity / filteredLogs.length).toFixed(1),
      avgDuration: (totalDuration / filteredLogs.length).toFixed(1),
      total: filteredLogs.length
    };
  }, [filteredLogs]);

  // Calculate severity distribution
  const severityDistribution = useMemo(() => {
    const distribution = Array(10).fill(0);

    filteredLogs.forEach((log) => {
      const severity = parseInt(log.data.severity);
      if (severity >= 1 && severity <= 10) {
        distribution[severity - 1]++;
      }
    });

    return distribution.map((count, index) => ({
      label: `${index + 1}`,
      value: count
    }));
  }, [filteredLogs]);

  // Group logs by date for frequency chart
  const frequencyByDate = useMemo(() => {
    const dateMap: Record<string, number> = {};

    // Get all dates in the timeframe
    const now = new Date();
    const cutoffDate = new Date();
    const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

    switch (timeframe) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "year":
        cutoffDate.setDate(now.getDate() - 365);
        break;
    }

    // Initialize all dates with 0 count
    for (let d = new Date(cutoffDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split("T")[0];
      dateMap[dateKey] = 0;
    }

    // Count logs per date
    filteredLogs.forEach((log) => {
      const dateKey = log.timestamp.split("T")[0];
      if (dateMap[dateKey] !== undefined) {
        dateMap[dateKey]++;
      }
    });

    // Convert to array format for chart
    return Object.entries(dateMap)
      .map(([dateKey, count]) => {
        const date = new Date(dateKey);
        return {
          date,
          label: dateFormat.format(date),
          value: count
        };
      })
      .slice(-14); // Show last 14 days for readability
  }, [filteredLogs, timeframe]);

  // If no logs, show empty state
  if (filteredLogs.length === 0) {
    return (
      <Card className="bg-card border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium">
            <BarChart2 className="mr-2 h-5 w-5" />
            Migraine Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-6 text-center">
            Not enough data to display trends. Log more migraines to see patterns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle className="flex items-center text-lg font-medium">
            <BarChart2 className="mr-2 h-5 w-5" />
            Migraine Trends
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="text-muted-foreground ml-2 h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px]">
                  <p>
                    Analysis based on {filteredLogs.length} logs from the past{" "}
                    {timeframe === "week"
                      ? "7 days"
                      : timeframe === "month"
                        ? "30 days"
                        : timeframe === "90days"
                          ? "90 days"
                          : "year"}
                    .
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>

          <div className="flex space-x-1">
            <Button
              variant={timeframe === "week" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("set-timeframe", { detail: "week" }))
              }
              className="h-8">
              <Calendar className="mr-1 h-3 w-3" />
              Week
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("set-timeframe", { detail: "month" }))
              }
              className="h-8">
              <Calendar className="mr-1 h-3 w-3" />
              Month
            </Button>
            <Button
              variant={timeframe === "90days" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("set-timeframe", { detail: "90days" }))
              }
              className="h-8">
              <Calendar className="mr-1 h-3 w-3" />
              90 Days
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* VA Rating Summary */}
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-md font-medium">VA Rating Analysis</h3>
            <Badge
              variant={
                prostratingStats.vaRating === "50%"
                  ? "destructive"
                  : prostratingStats.vaRating === "30%"
                    ? "default"
                    : prostratingStats.vaRating === "10%"
                      ? "secondary"
                      : "outline"
              }>
              Estimated Rating: {prostratingStats.vaRating}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-muted/20 flex flex-col items-center justify-center space-y-2 rounded-lg p-4">
              <DonutChart
                percentage={prostratingStats.percentage}
                label="Prostrating Attacks"
                color={prostratingStats.percentage > 50 ? "stroke-destructive" : "stroke-primary"}
              />
              <p className="text-center text-sm">
                <span className="font-medium">{prostratingStats.total}</span> prostrating attacks
              </p>
            </div>

            <div className="bg-muted/20 space-y-2 rounded-lg p-4">
              <h4 className="text-center text-sm font-medium">Monthly Rate</h4>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold">{prostratingStats.monthlyRate}</span>
                <span className="ml-1 text-sm">attacks/month</span>
              </div>
              <p className="text-muted-foreground text-center text-xs">
                {prostratingStats.monthlyRate >= 1
                  ? "Meets criteria for 30% or higher"
                  : prostratingStats.monthlyRate >= 0.5
                    ? "Meets criteria for 10% rating"
                    : "Below compensable threshold"}
              </p>
            </div>

            <div className="bg-muted/20 space-y-2 rounded-lg p-4">
              <h4 className="text-center text-sm font-medium">VA Rating Criteria</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>50%:</span>
                  <span>Very frequent prostrating attacks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>30%:</span>
                  <span>Monthly prostrating attacks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>10%:</span>
                  <span>Bi-monthly prostrating attacks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency and Severity Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={frequencyByDate.map((d) => ({ label: d.label, value: d.value }))}
                maxValue={Math.max(...frequencyByDate.map((d) => d.value), 1)}
                label="Headache Frequency"
                valueLabel="Occurrences"
                colorFn={(value) => (value > 0 ? "bg-primary" : "bg-muted")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={severityDistribution.filter((d) => d.value > 0)}
                maxValue={Math.max(...severityDistribution.map((d) => d.value), 1)}
                label="Pain Level Distribution"
                valueLabel="Count"
                colorFn={(value) => {
                  const index = severityDistribution.findIndex((d) => d.value === value);
                  if (index >= 7) return "bg-destructive";
                  if (index >= 4) return "bg-amber-500";
                  return "bg-primary";
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">Total Logs</span>
            <span className="text-2xl font-bold">{overallStats.total}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">Avg Severity</span>
            <span className="text-2xl font-bold">{overallStats.avgSeverity}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">Avg Duration</span>
            <span className="text-2xl font-bold">{overallStats.avgDuration}h</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <span className="text-muted-foreground text-sm">Prostrating</span>
            <span className="text-2xl font-bold">{prostratingStats.total}</span>
          </div>
        </div>

        <Tabs defaultValue="triggers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="sleep">Sleep Impact</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="pt-4">
            {triggerPatterns.length > 0 ? (
              <div className="space-y-4">
                <BarChart
                  data={triggerPatterns.slice(0, 5).map((item) => ({
                    label: item.trigger,
                    value: item.percentage
                  }))}
                  maxValue={100}
                  label="Top Triggers"
                  valueLabel="% of Headaches"
                />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Trigger Details</h4>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {triggerPatterns.slice(0, 6).map((item) => (
                      <div
                        key={item.trigger}
                        className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <div>
                          <span>{item.trigger}</span>
                          <Badge variant="outline" className="ml-2">
                            {item.percentage}%
                          </Badge>
                        </div>
                        <span className="text-muted-foreground">
                          Avg Severity: {item.avgSeverity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No trigger data available.</p>
            )}
          </TabsContent>

          <TabsContent value="sleep" className="pt-4">
            {sleepCorrelation.length > 0 ? (
              <div className="space-y-4">
                <BarChart
                  data={sleepCorrelation.map((item) => ({
                    label: item.quality,
                    value: parseFloat(item.avgSeverity)
                  }))}
                  maxValue={10}
                  label="Sleep Quality vs. Headache Severity"
                  valueLabel="Avg Severity"
                  colorFn={(value) =>
                    value > 7 ? "bg-destructive" : value > 5 ? "bg-amber-500" : "bg-primary"
                  }
                />

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 text-sm font-medium">Sleep Quality Impact</h4>
                  <p className="text-muted-foreground text-sm">
                    {sleepCorrelation.length > 0 &&
                    parseFloat(sleepCorrelation[0].avgSeverity) >
                      parseFloat(sleepCorrelation[sleepCorrelation.length - 1].avgSeverity)
                      ? "Poor sleep quality correlates with higher headache severity. Consider improving sleep habits."
                      : "No clear correlation between sleep quality and headache severity in your logs."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No sleep quality data available.</p>
            )}
          </TabsContent>

          <TabsContent value="weather" className="pt-4">
            {weatherCorrelation.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {weatherCorrelation.map((item) => (
                    <div
                      key={item.condition}
                      className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center">
                        <CloudRain className="mr-2 h-5 w-5" />
                        <span className="capitalize">{item.condition}</span>
                      </div>
                      <div>
                        <Badge
                          variant={parseFloat(item.avgSeverity) > 6 ? "destructive" : "outline"}>
                          Avg: {item.avgSeverity}
                        </Badge>
                        <span className="text-muted-foreground ml-2 text-sm">
                          {item.count} logs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 text-sm font-medium">Weather Sensitivity</h4>
                  <p className="text-muted-foreground text-sm">
                    {weatherCorrelation.length > 0
                      ? `Your logs show potential sensitivity to ${weatherCorrelation[0].condition} conditions.`
                      : "No clear weather triggers identified in your logs."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No weather data available.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
