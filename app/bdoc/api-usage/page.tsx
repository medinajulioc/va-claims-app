"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, BarChart, PieChart, Clock } from "lucide-react";
import {
  apiUsageService,
  ApiUsageSummary,
  ApiUsageLog,
  ApiUsageByDate,
  ApiUsageByEndpoint
} from "@/lib/services/api-usage";

export default function ApiUsagePage() {
  const [selectedService, setSelectedService] = useState<string>("eCFR");
  const [summary, setSummary] = useState<ApiUsageSummary[]>([]);
  const [logs, setLogs] = useState<ApiUsageLog[]>([]);
  const [usageByDate, setUsageByDate] = useState<ApiUsageByDate[]>([]);
  const [usageByEndpoint, setUsageByEndpoint] = useState<ApiUsageByEndpoint[]>([]);
  const [loading, setLoading] = useState({
    summary: true,
    logs: true,
    byDate: true,
    byEndpoint: true
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch summary data
        setLoading((prev) => ({ ...prev, summary: true }));
        const summaryData = await apiUsageService.getSummary();
        setSummary(summaryData);
        setLoading((prev) => ({ ...prev, summary: false }));

        // Fetch logs for the selected service
        await fetchLogs();

        // Fetch usage by date for the selected service
        await fetchUsageByDate();

        // Fetch usage by endpoint for the selected service
        await fetchUsageByEndpoint();
      } catch (error) {
        console.error("Error fetching API usage data:", error);
        setLoading({
          summary: false,
          logs: false,
          byDate: false,
          byEndpoint: false
        });
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // When selected service changes, update the related data
    fetchLogs();
    fetchUsageByDate();
    fetchUsageByEndpoint();
  }, [selectedService]);

  async function fetchLogs() {
    setLoading((prev) => ({ ...prev, logs: true }));
    try {
      const logsData = await apiUsageService.getLogs({ service: selectedService, limit: 50 });
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading((prev) => ({ ...prev, logs: false }));
    }
  }

  async function fetchUsageByDate() {
    setLoading((prev) => ({ ...prev, byDate: true }));
    try {
      const usageData = await apiUsageService.getUsageByDate(selectedService, 30);
      setUsageByDate(usageData);
    } catch (error) {
      console.error("Error fetching usage by date:", error);
    } finally {
      setLoading((prev) => ({ ...prev, byDate: false }));
    }
  }

  async function fetchUsageByEndpoint() {
    setLoading((prev) => ({ ...prev, byEndpoint: true }));
    try {
      const endpointData = await apiUsageService.getUsageByEndpoint(selectedService);
      setUsageByEndpoint(endpointData);
    } catch (error) {
      console.error("Error fetching usage by endpoint:", error);
    } finally {
      setLoading((prev) => ({ ...prev, byEndpoint: false }));
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Simple bar chart component for usage by date
  const UsageBarChart = ({ data }: { data: ApiUsageByDate[] }) => {
    if (!data.length)
      return <div className="flex h-60 items-center justify-center">No data available</div>;

    const maxCalls = Math.max(...data.map((d) => d.calls));

    return (
      <div className="h-60">
        <div className="flex h-full items-end space-x-2">
          {data.map((item, index) => {
            const height = `${(item.calls / maxCalls) * 100}%`;
            const date = new Date(item.date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center"
                title={`${item.date}: ${item.calls} calls`}>
                <div
                  className={`w-full rounded-t-sm ${isWeekend ? "bg-muted-foreground/30" : "bg-primary/80"}`}
                  style={{ height }}></div>
                {index % 5 === 0 && (
                  <span className="text-muted-foreground mt-2 text-xs">{date.getDate()}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Simple pie chart component for usage by endpoint
  const UsagePieChart = ({ data }: { data: ApiUsageByEndpoint[] }) => {
    if (!data.length)
      return <div className="flex h-60 items-center justify-center">No data available</div>;

    const totalCalls = data.reduce((sum, item) => sum + item.calls, 0);
    let cumulativePercentage = 0;

    const colors = ["#2563eb", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

    return (
      <div className="flex h-60 items-center justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {data.map((item, index) => {
              const percentage = (item.calls / totalCalls) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

              // Calculate the SVG arc path
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const largeArcFlag = percentage > 50 ? 1 : 0;

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              cumulativePercentage += percentage;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="mr-2 h-3 w-3"
                style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-sm">
                {item.endpoint} ({Math.round((item.calls / totalCalls) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Usage Monitoring</h1>

        <div className="flex items-center space-x-4">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {summary.map((item) => (
                <SelectItem key={item.service} value={item.service}>
                  {item.service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchLogs();
              fetchUsageByDate();
              fetchUsageByEndpoint();
            }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading.summary
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="flex items-center justify-center p-6">
                  <RefreshCw className="text-muted-foreground h-5 w-5 animate-spin" />
                </Card>
              ))
          : summary
              .filter((s) => s.service === selectedService)
              .map((service) => (
                <React.Fragment key={service.service}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
                      <BarChart className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {service.totalCalls.toLocaleString()}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {service.successCalls.toLocaleString()} successful,{" "}
                        {service.failedCalls.toLocaleString()} failed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      <PieChart className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {service.totalCalls > 0
                          ? `${Math.round((service.successCalls / service.totalCalls) * 100)}%`
                          : "0%"}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {service.totalCalls > 0
                          ? `${service.failedCalls} failed out of ${service.totalCalls} calls`
                          : "No calls recorded"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                      <Clock className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(service.averageResponseTime)} ms
                      </div>
                      <p className="text-muted-foreground text-xs">Average API response time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Last Used</CardTitle>
                      <Clock className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatDate(service.lastUsed).split(",")[0]}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(service.lastUsed).split(",")[1]}
                      </p>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))}
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Usage by Date Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily API Usage</CardTitle>
            <CardDescription>Number of API calls per day over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.byDate ? (
              <div className="flex h-60 items-center justify-center">
                <RefreshCw className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            ) : (
              <UsageBarChart data={usageByDate} />
            )}
          </CardContent>
        </Card>

        {/* Usage by Endpoint Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoint Distribution</CardTitle>
            <CardDescription>API calls distribution by endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.byEndpoint ? (
              <div className="flex h-60 items-center justify-center">
                <RefreshCw className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            ) : (
              <UsagePieChart data={usageByEndpoint} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent API Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
          <CardDescription>The most recent API calls made to the selected service</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.logs ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading API logs...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Query Params</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell className="font-medium">{log.endpoint}</TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700">
                          Success {log.statusCode}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Failed {log.statusCode}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{log.responseTimeMs} ms</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.queryParams ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(log.queryParams, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground py-4 text-center">
                      No API calls recorded for this service
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
