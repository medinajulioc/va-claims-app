"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FilePdf, Printer, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Log {
  id: string;
  condition: string;
  data: Record<string, any>;
  timestamp: string;
}

interface ReportProps {
  logs: Log[];
  condition: string;
  timeframe?: "30days" | "90days" | "180days" | "year";
}

export function Report({ logs, condition, timeframe = "90days" }: ReportProps) {
  const [reportTimeframe, setReportTimeframe] = useState<"30days" | "90days" | "180days" | "year">(
    timeframe
  );
  const [activeTab, setActiveTab] = useState("summary");
  const reportRef = useRef<HTMLDivElement>(null);

  // Filter logs by condition and timeframe
  const filteredLogs = logs.filter((log) => {
    if (log.condition !== condition) return false;

    const logDate = new Date(log.timestamp);
    const cutoffDate = new Date();

    switch (reportTimeframe) {
      case "30days":
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case "90days":
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        break;
      case "180days":
        cutoffDate.setDate(cutoffDate.getDate() - 180);
        break;
      case "year":
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
    }

    return logDate >= cutoffDate;
  });

  // Calculate summary metrics
  const totalAttacks = filteredLogs.length;
  const prostratingAttacks = filteredLogs.filter((log) => log.data.prostrating === "Yes").length;

  // Calculate average severity
  const avgSeverity = totalAttacks
    ? (
        filteredLogs.reduce((sum, log) => sum + (parseInt(log.data.severity) || 0), 0) /
        totalAttacks
      ).toFixed(1)
    : "0";

  // Calculate average duration
  const avgDuration = totalAttacks
    ? (
        filteredLogs.reduce((sum, log) => {
          const duration = log.data.duration;
          if (typeof duration === "number") {
            return sum + duration;
          } else if (typeof duration === "string") {
            const match = duration.match(/(\d+)/);
            return sum + (match ? parseInt(match[1]) : 0);
          }
          return sum;
        }, 0) / totalAttacks
      ).toFixed(1)
    : "0";

  // Calculate monthly rate of prostrating attacks for VA rating
  const daysInTimeframe =
    reportTimeframe === "30days"
      ? 30
      : reportTimeframe === "90days"
        ? 90
        : reportTimeframe === "180days"
          ? 180
          : 365;

  const monthlyRate = (prostratingAttacks / daysInTimeframe) * 30;

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

  // Identify most common triggers
  const triggerCounts: Record<string, number> = {};
  filteredLogs.forEach((log) => {
    if (log.data.triggers && Array.isArray(log.data.triggers)) {
      log.data.triggers.forEach((trigger: string) => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    }
  });

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger]) => trigger);

  // Identify most common symptoms
  const symptomCounts: Record<string, number> = {};
  filteredLogs.forEach((log) => {
    if (log.data.symptoms && Array.isArray(log.data.symptoms)) {
      log.data.symptoms.forEach((symptom: string) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    }
  });

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom]) => symptom);

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `${condition} Report - ${format(new Date(), "yyyy-MM-dd")}`,
    copyStyles: true
  });

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-medium">
          <FileText className="mr-2 h-5 w-5" />
          VA Disability Report
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={reportTimeframe}
            onValueChange={(value) => setReportTimeframe(value as any)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="180days">Last 180 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handlePrint}>
            <FilePdf className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {totalAttacks === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No Data Available</h3>
            <p className="text-muted-foreground max-w-md">
              No {condition.toLowerCase()} logs found for the selected timeframe. Try selecting a
              different timeframe or log more symptoms.
            </p>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-muted/50 grid w-full grid-cols-3 p-1">
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
                  Log Details
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-background transition-all duration-300 data-[state=active]:shadow-sm">
                  Print Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="mb-2 text-sm font-medium">VA Rating Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Total Attacks</p>
                        <p className="text-lg font-semibold">{totalAttacks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Prostrating Attacks</p>
                        <p className="text-lg font-semibold">{prostratingAttacks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Monthly Rate</p>
                        <p className="text-lg font-semibold">{monthlyRate.toFixed(1)} per month</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Estimated VA Rating</p>
                        <p className="text-lg font-semibold">{vaRating}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="mb-2 text-sm font-medium">Severity & Duration</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Average Severity (1-10)</p>
                          <p className="text-lg font-semibold">{avgSeverity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Average Duration</p>
                          <p className="text-lg font-semibold">{avgDuration} hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="mb-2 text-sm font-medium">Common Patterns</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Top Triggers</p>
                          <p className="text-sm font-medium">
                            {topTriggers.join(", ") || "None identified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Top Symptoms</p>
                          <p className="text-sm font-medium">
                            {topSymptoms.join(", ") || "None identified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="mb-2 text-sm font-medium">VA Rating Criteria (38 CFR 4.124a)</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left font-medium">Rating</th>
                          <th className="py-2 text-left font-medium">Criteria</th>
                          <th className="py-2 text-left font-medium">Your Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">0%</td>
                          <td className="py-2">With less frequent attacks</td>
                          <td className="py-2">{totalAttacks} total attacks</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">10%</td>
                          <td className="py-2">Prostrating attacks averaging one in 2 months</td>
                          <td className="py-2">{monthlyRate.toFixed(1)} per month</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">30%</td>
                          <td className="py-2">Prostrating attacks averaging once a month</td>
                          <td className="py-2">{monthlyRate.toFixed(1)} per month</td>
                        </tr>
                        <tr>
                          <td className="py-2">50%</td>
                          <td className="py-2">
                            Very frequent prostrating attacks with severe economic inadaptability
                          </td>
                          <td className="py-2">
                            {monthlyRate.toFixed(1)} per month with{" "}
                            {
                              filteredLogs.filter(
                                (log) =>
                                  log.data.impact === "Complete inability to function" ||
                                  log.data.impact === "Severe limitation"
                              ).length
                            }{" "}
                            severe impact logs
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium">Date</th>
                        <th className="py-2 text-left font-medium">Severity</th>
                        <th className="py-2 text-left font-medium">Duration</th>
                        <th className="py-2 text-left font-medium">Prostrating</th>
                        <th className="py-2 text-left font-medium">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b">
                          <td className="py-2">{new Date(log.timestamp).toLocaleDateString()}</td>
                          <td className="py-2">{log.data.severity}</td>
                          <td className="py-2">
                            {log.data.duration}{" "}
                            {typeof log.data.duration === "number" ? "hours" : ""}
                          </td>
                          <td className="py-2">{log.data.prostrating || "N/A"}</td>
                          <td className="py-2">{log.data.impact || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="max-h-[500px] overflow-y-auto rounded-lg border bg-white p-4">
                  <div className="mb-4 text-center">
                    <p className="text-muted-foreground text-sm">Preview of the printed report</p>
                  </div>
                  <div className="origin-top scale-90">
                    {/* Print preview of the report */}
                    <div className="bg-white p-6">
                      <h1 className="text-center text-2xl font-bold">
                        {condition} VA Disability Report
                      </h1>
                      <p className="text-muted-foreground mb-6 text-center">
                        Report Period:{" "}
                        {reportTimeframe === "30days"
                          ? "Last 30 Days"
                          : reportTimeframe === "90days"
                            ? "Last 90 Days"
                            : reportTimeframe === "180days"
                              ? "Last 180 Days"
                              : "Last Year"}
                      </p>

                      {/* Summary Section */}
                      <div className="mb-6">
                        <h2 className="mb-2 text-xl font-semibold">Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">Total Attacks: {totalAttacks}</p>
                            <p className="font-medium">Prostrating Attacks: {prostratingAttacks}</p>
                            <p className="font-medium">
                              Monthly Rate: {monthlyRate.toFixed(1)} per month
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Average Severity: {avgSeverity}</p>
                            <p className="font-medium">Average Duration: {avgDuration} hours</p>
                            <p className="font-medium">Estimated VA Rating: {vaRating}</p>
                          </div>
                        </div>
                      </div>

                      {/* VA Rating Section */}
                      <div className="mb-6">
                        <h2 className="mb-2 text-xl font-semibold">VA Rating Criteria</h2>
                        <table className="w-full border text-sm">
                          <thead>
                            <tr className="bg-muted/30">
                              <th className="border p-2 text-left">Rating</th>
                              <th className="border p-2 text-left">Criteria</th>
                              <th className="border p-2 text-left">Your Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2">0%</td>
                              <td className="border p-2">With less frequent attacks</td>
                              <td className="border p-2">{totalAttacks} total attacks</td>
                            </tr>
                            <tr>
                              <td className="border p-2">10%</td>
                              <td className="border p-2">
                                Prostrating attacks averaging one in 2 months
                              </td>
                              <td className="border p-2">{monthlyRate.toFixed(1)} per month</td>
                            </tr>
                            <tr>
                              <td className="border p-2">30%</td>
                              <td className="border p-2">
                                Prostrating attacks averaging once a month
                              </td>
                              <td className="border p-2">{monthlyRate.toFixed(1)} per month</td>
                            </tr>
                            <tr>
                              <td className="border p-2">50%</td>
                              <td className="border p-2">
                                Very frequent prostrating attacks with severe economic
                                inadaptability
                              </td>
                              <td className="border p-2">
                                {monthlyRate.toFixed(1)} per month with{" "}
                                {
                                  filteredLogs.filter(
                                    (log) =>
                                      log.data.impact === "Complete inability to function" ||
                                      log.data.impact === "Severe limitation"
                                  ).length
                                }{" "}
                                severe impact logs
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Log Details Preview (limited) */}
                      <div>
                        <h2 className="mb-2 text-xl font-semibold">Log Details</h2>
                        <table className="w-full border text-sm">
                          <thead>
                            <tr className="bg-muted/30">
                              <th className="border p-2 text-left">Date</th>
                              <th className="border p-2 text-left">Severity</th>
                              <th className="border p-2 text-left">Duration</th>
                              <th className="border p-2 text-left">Prostrating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLogs.slice(0, 5).map((log) => (
                              <tr key={log.id}>
                                <td className="border p-2">
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </td>
                                <td className="border p-2">{log.data.severity}</td>
                                <td className="border p-2">
                                  {log.data.duration}{" "}
                                  {typeof log.data.duration === "number" ? "hours" : ""}
                                </td>
                                <td className="border p-2">{log.data.prostrating || "N/A"}</td>
                              </tr>
                            ))}
                            {filteredLogs.length > 5 && (
                              <tr>
                                <td className="border p-2 text-center" colSpan={4}>
                                  + {filteredLogs.length - 5} more entries in full report
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="text-muted-foreground mt-6 text-center text-xs">
                        <p>Generated on {format(new Date(), "MMMM d, yyyy")} by VA Claims App</p>
                        <p>This report is for VA disability claim documentation purposes.</p>
                        <p>Reference: 38 CFR 4.124a, Diagnostic Code 8100 - Migraine</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Hidden printable report */}
        <div className="hidden">
          <div ref={reportRef} className="p-8">
            <h1 className="text-center text-2xl font-bold">{condition} VA Disability Report</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Report Period:{" "}
              {reportTimeframe === "30days"
                ? "Last 30 Days"
                : reportTimeframe === "90days"
                  ? "Last 90 Days"
                  : reportTimeframe === "180days"
                    ? "Last 180 Days"
                    : "Last Year"}
            </p>

            {/* Summary Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Summary</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-medium">Total Attacks: {totalAttacks}</p>
                  <p className="font-medium">Prostrating Attacks: {prostratingAttacks}</p>
                  <p className="font-medium">Monthly Rate: {monthlyRate.toFixed(1)} per month</p>
                  <p className="font-medium">Estimated VA Rating: {vaRating}</p>
                </div>
                <div>
                  <p className="font-medium">Average Severity: {avgSeverity}</p>
                  <p className="font-medium">Average Duration: {avgDuration} hours</p>
                  <p className="font-medium">
                    Common Triggers: {topTriggers.join(", ") || "None identified"}
                  </p>
                  <p className="font-medium">
                    Common Symptoms: {topSymptoms.join(", ") || "None identified"}
                  </p>
                </div>
              </div>
            </div>

            {/* VA Rating Section */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">VA Rating Criteria (38 CFR 4.124a)</h2>
              <table className="w-full border">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border p-2 text-left">Rating</th>
                    <th className="border p-2 text-left">Criteria</th>
                    <th className="border p-2 text-left">Your Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">0%</td>
                    <td className="border p-2">With less frequent attacks</td>
                    <td className="border p-2">{totalAttacks} total attacks</td>
                  </tr>
                  <tr>
                    <td className="border p-2">10%</td>
                    <td className="border p-2">Prostrating attacks averaging one in 2 months</td>
                    <td className="border p-2">{monthlyRate.toFixed(1)} per month</td>
                  </tr>
                  <tr>
                    <td className="border p-2">30%</td>
                    <td className="border p-2">Prostrating attacks averaging once a month</td>
                    <td className="border p-2">{monthlyRate.toFixed(1)} per month</td>
                  </tr>
                  <tr>
                    <td className="border p-2">50%</td>
                    <td className="border p-2">
                      Very frequent prostrating attacks with severe economic inadaptability
                    </td>
                    <td className="border p-2">
                      {monthlyRate.toFixed(1)} per month with{" "}
                      {
                        filteredLogs.filter(
                          (log) =>
                            log.data.impact === "Complete inability to function" ||
                            log.data.impact === "Severe limitation"
                        ).length
                      }{" "}
                      severe impact logs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Log Details */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Log Details</h2>
              <table className="w-full border">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Severity</th>
                    <th className="border p-2 text-left">Duration</th>
                    <th className="border p-2 text-left">Prostrating</th>
                    <th className="border p-2 text-left">Impact</th>
                    <th className="border p-2 text-left">Symptoms</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="border p-2">{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td className="border p-2">{log.data.severity}</td>
                      <td className="border p-2">
                        {log.data.duration} {typeof log.data.duration === "number" ? "hours" : ""}
                      </td>
                      <td className="border p-2">{log.data.prostrating || "N/A"}</td>
                      <td className="border p-2">{log.data.impact || "N/A"}</td>
                      <td className="border p-2">
                        {Array.isArray(log.data.symptoms)
                          ? log.data.symptoms.join(", ")
                          : log.data.symptoms || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-muted-foreground mt-8 text-center text-sm">
              <p>Generated on {format(new Date(), "MMMM d, yyyy")} by VA Claims App</p>
              <p>This report is for VA disability claim documentation purposes.</p>
              <p>Reference: 38 CFR 4.124a, Diagnostic Code 8100 - Migraine</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
