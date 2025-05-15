"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { conditions } from "@/lib/conditions";
import { FileText, Printer, Download } from "lucide-react";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface ReportGeneratorProps {
  logs: Log[];
}

export const ReportGenerator = ({ logs }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState<"all" | "condition">("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [timeframe, setTimeframe] = useState<"all" | "30days" | "90days" | "year">("all");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeSeverityChart, setIncludeSeverityChart] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Condition Log Report - ${new Date().toLocaleDateString()}`,
    onAfterPrint: () => setIsDialogOpen(false)
  });

  // Filter logs based on selections
  const getFilteredLogs = () => {
    let filteredLogs = [...logs];

    // Filter by condition if selected
    if (reportType === "condition" && selectedCondition) {
      filteredLogs = filteredLogs.filter((log) => log.condition === selectedCondition);
    }

    // Filter by timeframe
    if (timeframe !== "all") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (timeframe) {
        case "30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= cutoffDate);
    }

    return filteredLogs;
  };

  // Calculate statistics for the report
  const calculateStats = (filteredLogs: Log[]) => {
    const stats = {
      totalLogs: filteredLogs.length,
      averageSeverity: 0,
      highestSeverity: 0,
      lowestSeverity: 10,
      conditionCounts: {} as Record<string, number>
    };

    if (filteredLogs.length === 0) return stats;

    let severitySum = 0;
    let severityCount = 0;

    filteredLogs.forEach((log) => {
      // Count by condition
      stats.conditionCounts[log.condition] = (stats.conditionCounts[log.condition] || 0) + 1;

      // Calculate severity stats if available
      if (log.data.severity !== undefined) {
        const severity = Number(log.data.severity);
        severitySum += severity;
        severityCount++;

        if (severity > stats.highestSeverity) stats.highestSeverity = severity;
        if (severity < stats.lowestSeverity) stats.lowestSeverity = severity;
      }
    });

    stats.averageSeverity =
      severityCount > 0 ? Math.round((severitySum / severityCount) * 10) / 10 : 0;

    return stats;
  };

  // Group logs by month for the severity chart
  const getChartData = (filteredLogs: Log[]) => {
    const chartData: Record<string, { count: number; totalSeverity: number; average: number }> = {};

    filteredLogs.forEach((log) => {
      if (log.data.severity === undefined) return;

      const date = new Date(log.timestamp);
      const monthYear = format(date, "MMM yyyy");

      if (!chartData[monthYear]) {
        chartData[monthYear] = { count: 0, totalSeverity: 0, average: 0 };
      }

      chartData[monthYear].count++;
      chartData[monthYear].totalSeverity += Number(log.data.severity);
      chartData[monthYear].average =
        Math.round((chartData[monthYear].totalSeverity / chartData[monthYear].count) * 10) / 10;
    });

    return chartData;
  };

  const filteredLogs = getFilteredLogs();
  const stats = calculateStats(filteredLogs);
  const chartData = getChartData(filteredLogs);
  const chartMonths = Object.keys(chartData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Condition Log Report</DialogTitle>
          <DialogDescription>
            Create a customized report of your condition logs for your records or healthcare
            provider.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(value: "all" | "condition") => {
                setReportType(value);
                if (value === "all") setSelectedCondition("");
              }}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="condition">Single Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === "condition" && (
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.name} value={condition.name}>
                      {condition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select
              value={timeframe}
              onValueChange={(value: "all" | "30days" | "90days" | "year") => setTimeframe(value)}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Report Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-details"
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(!!checked)}
              />
              <Label htmlFor="include-details" className="text-sm font-normal">
                Include detailed log entries
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-chart"
                checked={includeSeverityChart}
                onCheckedChange={(checked) => setIncludeSeverityChart(!!checked)}
              />
              <Label htmlFor="include-chart" className="text-sm font-normal">
                Include severity trend chart
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePrint} disabled={reportType === "condition" && !selectedCondition}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Hidden report template for printing */}
      <div className="hidden">
        <div ref={reportRef} className="mx-auto max-w-4xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">
              {reportType === "all" ? "All Conditions" : selectedCondition} Log Report
            </h1>
            <p className="text-muted-foreground">
              {timeframe === "all"
                ? "All Time"
                : timeframe === "30days"
                  ? "Last 30 Days"
                  : timeframe === "90days"
                    ? "Last 90 Days"
                    : "Last Year"}
            </p>
            <p className="text-muted-foreground">
              Generated on {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Total Logs</div>
                <div className="text-2xl font-bold">{stats.totalLogs}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Average Severity</div>
                <div className="text-2xl font-bold">{stats.averageSeverity}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Highest Severity</div>
                <div className="text-2xl font-bold">{stats.highestSeverity}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Lowest Severity</div>
                <div className="text-2xl font-bold">
                  {stats.lowestSeverity === 10 && stats.totalLogs === 0
                    ? "N/A"
                    : stats.lowestSeverity}
                </div>
              </div>
            </div>
          </div>

          {reportType === "all" && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Condition Breakdown</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Condition</th>
                    <th className="py-2 text-right">Count</th>
                    <th className="py-2 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.conditionCounts).map(([condition, count]) => (
                    <tr key={condition} className="border-b">
                      <td className="py-2">{condition}</td>
                      <td className="py-2 text-right">{count}</td>
                      <td className="py-2 text-right">
                        {Math.round((count / stats.totalLogs) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {includeSeverityChart && chartMonths.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Severity Trend</h2>
              <div className="h-64 rounded-lg border p-4">
                <div className="flex h-full items-end">
                  {chartMonths.map((month) => (
                    <div key={month} className="flex flex-1 flex-col items-center">
                      <div
                        className="bg-primary mx-1 w-full"
                        style={{
                          height: `${(chartData[month].average / 10) * 100}%`,
                          minHeight: "4px"
                        }}></div>
                      <div className="mt-2 text-center text-xs">{month}</div>
                      <div className="text-xs font-medium">{chartData[month].average}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {includeDetails && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Detailed Log Entries</h2>
              {filteredLogs.length > 0 ? (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex justify-between">
                        <div className="font-medium">{log.condition}</div>
                        <div className="text-muted-foreground text-sm">
                          {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
                        </div>
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        {log.data.severity && (
                          <div>
                            <span className="text-muted-foreground text-sm">Severity: </span>
                            <span className="font-medium">{log.data.severity}/10</span>
                          </div>
                        )}
                        {Object.entries(log.data)
                          .filter(([key]) => !["severity", "notes"].includes(key))
                          .map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground text-sm">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              </span>
                              <span>{value}</span>
                            </div>
                          ))}
                      </div>
                      {log.data.notes && (
                        <div className="mt-2">
                          <div className="text-muted-foreground text-sm">Notes:</div>
                          <div className="bg-muted mt-1 rounded p-2 text-sm">{log.data.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  No log entries found for the selected criteria
                </div>
              )}
            </div>
          )}

          <div className="text-muted-foreground mt-8 border-t pt-4 text-center text-sm">
            This report is for personal record-keeping and healthcare provider consultation.
            <br />
            VA Claims App - Condition Logger
          </div>
        </div>
      </div>
    </Dialog>
  );
};
