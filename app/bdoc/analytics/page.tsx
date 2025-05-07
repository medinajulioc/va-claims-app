import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  LineChart,
  BarChartIcon,
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";

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
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <p className="text-muted-foreground mb-2">Demo data visualization</p>
          <div className="text-center">
            {data.map((item, index) => (
              <div key={index} className="flex justify-between my-1">
                <span>{item.name}:</span>
                <span className="font-medium ml-2">
                  {typeof item.value === 'number' ? 
                    item.value.toLocaleString() : 
                    item.value}
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
          icon={<BarChartIcon className="h-5 w-5 text-muted-foreground" />}
        />
        
        <StatCard 
          title="Revenue Trends" 
          description="Monthly revenue"
          data={revenueData}
          icon={<LineChart className="h-5 w-5 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <p className="text-sm text-muted-foreground">Activity across platform features</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${(item.value / 2500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <p className="text-sm text-muted-foreground">Visitor to user conversion</p>
          </CardHeader>
          <CardContent className="relative pt-8">
            {/* Simple funnel visualization */}
            <div className="space-y-2">
              <div className="bg-blue-100 dark:bg-blue-950/30 h-14 flex items-center justify-center rounded-t-lg">
                <span className="font-medium">{conversionData[0].value} Visitors</span>
              </div>
              <div className="bg-blue-200 dark:bg-blue-900/30 h-12 flex items-center justify-center mx-4">
                <span className="font-medium">3,921 Interested</span>
              </div>
              <div className="bg-blue-300 dark:bg-blue-800/30 h-10 flex items-center justify-center mx-8">
                <span className="font-medium">2,156 Started</span>
              </div>
              <div className="bg-blue-400 dark:bg-blue-700/30 h-8 flex items-center justify-center mx-12 rounded-b-lg">
                <span className="font-medium">{conversionData[1].value} Signed Up</span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-full">
                <span className="font-medium mr-2">Conversion Rate:</span>
                <Badge>{conversionData[2].value}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Server metrics and application performance</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187ms</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> 12.4%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.97%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.03%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-emerald-500 flex items-center mr-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> 0.01%
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
          <p className="text-sm text-muted-foreground">User distribution by location</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">California</span>
                <span className="text-sm text-muted-foreground">186 users</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Texas</span>
                <span className="text-sm text-muted-foreground">143 users</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Florida</span>
                <span className="text-sm text-muted-foreground">112 users</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '47%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Virginia</span>
                <span className="text-sm text-muted-foreground">98 users</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '41%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Other States</span>
                <span className="text-sm text-muted-foreground">708 users</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 