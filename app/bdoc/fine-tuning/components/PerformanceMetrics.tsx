"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart, Zap } from "lucide-react";
import { FineTunedModel, ModelPerformance } from "../data";

interface PerformanceMetricsProps {
  model: FineTunedModel;
  performanceData: ModelPerformance[];
}

export function PerformanceMetrics({ model, performanceData }: PerformanceMetricsProps) {
  // In a real app, this would be a proper chart implementation
  // Here we're just simulating the concept with a mock visualization
  const renderMetricBar = (value: number, label: string) => {
    const percentage = value * 100;
    return (
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-sm font-medium">{label}</div>
          <div className="text-sm font-medium">{percentage.toFixed(1)}%</div>
        </div>
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  // Simple line chart visualization for time-series data
  const renderTimeChart = () => {
    // Just a mock visualization
    return (
      <div className="py-4">
        <div className="flex h-[200px] w-full flex-col justify-between">
          <div className="flex h-full w-full items-end justify-between gap-2">
            {performanceData.map((data, i) => {
              const accuracy = data.accuracy * 100;
              const height = `${accuracy}%`;

              return (
                <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                  <div className="bg-primary w-full rounded-t" style={{ height }} />
                  <span className="mt-1 w-full truncate text-center text-[10px]">
                    {data.date.split("-")[1]}/{data.date.split("-")[2]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-muted-foreground flex justify-between pt-6 text-xs">
            <span>Time →</span>
            <span>Performance Trend</span>
          </div>
        </div>
      </div>
    );
  };

  const renderLatencyChart = () => {
    if (!performanceData.length) return null;

    // Just a mock visualization
    return (
      <div className="py-4">
        <div className="flex h-[200px] w-full flex-col justify-between">
          <div className="flex h-full w-full items-end justify-between gap-2">
            {performanceData.map((data, i) => {
              // Normalize query response time for visualization (assuming 200ms max)
              const height = `${Math.min(100, data.queryResponseTime / 2)}%`;

              return (
                <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                  <div className="w-full rounded-t bg-amber-500" style={{ height }} />
                  <span className="mt-1 w-full truncate text-center text-[10px]">
                    {data.date.split("-")[1]}/{data.date.split("-")[2]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-muted-foreground flex justify-between pt-6 text-xs">
            <span>Time →</span>
            <span>Response Time (ms)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription className="flex items-center">
              <Zap className="mr-1 h-3 w-3" />
              {model.name}
            </CardDescription>
          </div>
          <Badge variant={model.status === "active" ? "default" : "outline"}>
            {model.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="overview" className="flex-1">
              <BarChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex-1">
              Accuracy Trend
            </TabsTrigger>
            <TabsTrigger value="latency" className="flex-1">
              Latency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderMetricBar(model.metrics.accuracy, "Accuracy")}
                  {renderMetricBar(model.metrics.precision, "Precision")}
                  {renderMetricBar(model.metrics.recall, "Recall")}
                  {renderMetricBar(model.metrics.f1Score, "F1 Score")}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm">Average Latency</span>
                    <span className="font-medium">{model.metrics.latency}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm">Documents</span>
                    <span className="font-medium">{model.documentsCount}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm">Base Model</span>
                    <span className="font-medium">{model.baseModel}</span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className="text-sm">Version</span>
                    <span className="font-medium">{model.version}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-4 list-disc space-y-2 text-sm">
                  <li>VA disability claim classification and routing</li>
                  <li>Evidence relevance determination for claims</li>
                  <li>Medical condition service connection analysis</li>
                  <li>Claim decision outcome prediction</li>
                  <li>Appeal success probability estimation</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accuracy">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Accuracy Over Time</CardTitle>
                <CardDescription>
                  Model performance metrics measured over deployment period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTimeChart()}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Initial</span>
                    <span className="font-medium">
                      {performanceData.length > 0
                        ? `${(performanceData[0].accuracy * 100).toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Current</span>
                    <span className="font-medium">
                      {performanceData.length > 0
                        ? `${(performanceData[performanceData.length - 1].accuracy * 100).toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Change</span>
                    <span className="font-medium text-green-500">
                      {performanceData.length > 1
                        ? `+${((performanceData[performanceData.length - 1].accuracy - performanceData[0].accuracy) * 100).toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Samples</span>
                    <span className="font-medium">{model.documentsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="latency">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Response Time</CardTitle>
                <CardDescription>
                  Query response time in milliseconds over deployment period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderLatencyChart()}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Avg. Latency</span>
                    <span className="font-medium">{model.metrics.latency}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Min</span>
                    <span className="font-medium">
                      {performanceData.length > 0
                        ? `${Math.min(...performanceData.map((d) => d.queryResponseTime))}ms`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Max</span>
                    <span className="font-medium">
                      {performanceData.length > 0
                        ? `${Math.max(...performanceData.map((d) => d.queryResponseTime))}ms`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Improvement</span>
                    <span className="font-medium text-green-500">
                      {performanceData.length > 1
                        ? `${performanceData[0].queryResponseTime - performanceData[performanceData.length - 1].queryResponseTime}ms`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
