import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, LineChart, BarChartIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Admin Analytics",
    description: "Analytics and performance metrics for the VA Claims system",
    canonical: "/bdoc/analytics"
  });
}

// Simple stat card components to replace charts
function StatCard({ title, description, data, icon, className = "h-72" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <p className="text-muted-foreground mb-2">Demo data visualization</p>
          <div className="text-center">
            {data.map((item, index) => (
              <div key={index} className="my-1 flex justify-between">
                <span>{item.name}:</span>
                <span className="ml-2 font-medium">
                  {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  // Demo data for the charts
  const revenueData = [
    { name: "Jan", value: 12400 },
    { name: "Feb", value: 15600 },
    { name: "Mar", value: 18200 },
    { name: "Apr", value: 16800 },
    { name: "May", value: 19500 },
    { name: "Jun", value: 22800 },
    { name: "Jul", value: 25400 }
  ];

  const userSignupsData = [
    { name: "Jan", value: 84 },
    { name: "Feb", value: 112 },
    { name: "Mar", value: 153 },
    { name: "Apr", value: 132 },
    { name: "May", value: 168 },
    { name: "Jun", value: 187 },
    { name: "Jul", value: 219 }
  ];

  const engagementData = [
    { name: "Documents Uploaded", value: 1847 },
    { name: "Forms Submitted", value: 932 },
    { name: "Chat Conversations", value: 689 },
    { name: "Search Queries", value: 2154 }
  ];

  const conversionData = [
    { name: "Visitors", value: 8642 },
    { name: "Sign-ups", value: 1247 },
    { name: "Conversion Rate", value: "14.4%" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="User Growth"
          description="Monthly new user registrations"
          data={userSignupsData}
          icon={<BarChartIcon className="text-muted-foreground h-5 w-5" />}
        />

        <StatCard
          title="Revenue Trends"
          description="Monthly revenue"
          data={revenueData}
          icon={<LineChart className="text-muted-foreground h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <p className="text-muted-foreground text-sm">Activity across platform features</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementData.map((item, index) => (
                <div key={index}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                  <div className="bg-muted h-2.5 w-full rounded-full">
                    <div
                      className="h-2.5 rounded-full bg-blue-500"
                      style={{ width: `${(item.value / 2500) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <p className="text-muted-foreground text-sm">Visitor to user conversion</p>
          </CardHeader>
          <CardContent className="relative pt-8">
            {/* Simple funnel visualization */}
            <div className="space-y-2">
              <div className="flex h-14 items-center justify-center rounded-t-lg bg-blue-100 dark:bg-blue-950/30">
                <span className="font-medium">{conversionData[0].value} Visitors</span>
              </div>
              <div className="mx-4 flex h-12 items-center justify-center bg-blue-200 dark:bg-blue-900/30">
                <span className="font-medium">3,921 Interested</span>
              </div>
              <div className="mx-8 flex h-10 items-center justify-center bg-blue-300 dark:bg-blue-800/30">
                <span className="font-medium">2,156 Started</span>
              </div>
              <div className="mx-12 flex h-8 items-center justify-center rounded-b-lg bg-blue-400 dark:bg-blue-700/30">
                <span className="font-medium">{conversionData[1].value} Signed Up</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 dark:bg-blue-950/50">
                <span className="mr-2 font-medium">Conversion Rate:</span>
                <Badge>{conversionData[2].value}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <p className="text-muted-foreground text-sm">
            Server metrics and application performance
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187ms</div>
              <p className="text-muted-foreground mt-1 flex items-center text-xs">
                <span className="mr-1 flex items-center text-emerald-500">
                  <ArrowDownRight className="mr-1 h-3 w-3" /> 12.4%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.97%</div>
              <p className="text-muted-foreground mt-1 text-xs">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.03%</div>
              <p className="text-muted-foreground mt-1 flex items-center text-xs">
                <span className="mr-1 flex items-center text-emerald-500">
                  <ArrowDownRight className="mr-1 h-3 w-3" /> 0.01%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <p className="text-muted-foreground text-sm">User distribution by location</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">California</span>
                <span className="text-muted-foreground text-sm">186 users</span>
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: "78%" }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Texas</span>
                <span className="text-muted-foreground text-sm">143 users</span>
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Florida</span>
                <span className="text-muted-foreground text-sm">112 users</span>
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: "47%" }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Virginia</span>
                <span className="text-muted-foreground text-sm">98 users</span>
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: "41%" }}></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">Other States</span>
                <span className="text-muted-foreground text-sm">708 users</span>
              </div>
              <div className="bg-muted h-2.5 w-full rounded-full">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
