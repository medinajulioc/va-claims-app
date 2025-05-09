import { redirect } from "next/navigation";
import { generateMeta } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Download,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  UserPlus,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  PieChart,
  BarChart as BarChartIcon,
  LineChart
} from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "VA Claims Admin Dashboard",
    description:
      "Administrative dashboard for managing VA claims, user accounts, and system analytics.",
    canonical: "/bdoc"
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
            <CardDescription>{description}</CardDescription>
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
            <CardDescription>{description}</CardDescription>
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

export default function Page() {
  redirect("/bdoc/overview");
}
