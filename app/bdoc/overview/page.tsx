import { generateMeta } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  FileText,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart
} from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Admin Dashboard Overview",
    description: "Overview of key metrics and claims status",
    canonical: "/bdoc/overview"
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

function DonutStatCard({ title, description, data, className = "h-60" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <PieChart className="text-muted-foreground h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <div className="mb-4">
            <PieChart className="text-muted-foreground h-24 w-24" />
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Badge
                  variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}
                  className="mb-1 px-3">
                  {item.value}%
                </Badge>
                <span className="text-muted-foreground text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
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

  const claimStatusData = [
    { name: "Approved", value: 64 },
    { name: "Pending", value: 27 },
    { name: "Rejected", value: 9 }
  ];

  // Demo claims data
  const recentClaims = [
    {
      id: "C78901",
      claimant: "Michael Johnson",
      type: "Disability Increase",
      status: "pending",
      submitted: "Jul 15, 2023",
      documents: 8
    },
    {
      id: "C78902",
      claimant: "Sarah Williams",
      type: "New Condition",
      status: "approved",
      submitted: "Jul 10, 2023",
      documents: 12
    },
    {
      id: "C78903",
      claimant: "Robert Davis",
      type: "Appeal",
      status: "rejected",
      submitted: "Jul 8, 2023",
      documents: 6
    },
    {
      id: "C78904",
      claimant: "Jennifer Miller",
      type: "Disability Increase",
      status: "processing",
      submitted: "Jul 5, 2023",
      documents: 9
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard Overview</h1>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> 12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,325</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> 8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">583</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> 4.3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Sign-ups</CardTitle>
            <UserPlus className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">219</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center text-rose-500">
                <ArrowDownRight className="mr-1 h-3 w-3" /> 5.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <StatCard
        title="Revenue Overview"
        description="Monthly revenue for the current year"
        data={revenueData}
        icon={<LineChart className="text-muted-foreground h-5 w-5" />}
      />

      {/* Recent Claims and Status Chart */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <p className="text-muted-foreground text-sm">
              The latest claims submitted to the system
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Claimant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.claimant}</TableCell>
                    <TableCell>{claim.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          claim.status === "approved"
                            ? "default"
                            : claim.status === "rejected"
                              ? "destructive"
                              : claim.status === "processing"
                                ? "outline"
                                : "secondary"
                        }>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DonutStatCard
          className="h-60 md:col-span-3"
          title="Claim Status Distribution"
          description="Current status of all claims"
          data={claimStatusData}
        />
      </div>
    </div>
  );
}
