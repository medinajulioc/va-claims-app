"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Users,
  BarChart3,
  AlertTriangle
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { mockNotifications } from "@/lib/mock/notifications";
import { NotificationType, Priority, Status } from "@/types/notifications";

// Mock analytics data
const deliveryStats = {
  total: 127,
  delivered: 125,
  opened: 98,
  clicked: 45,
  failed: 2
};

const weeklyData = [
  { date: "Jun 1", sent: 15, opened: 12 },
  { date: "Jun 2", sent: 12, opened: 9 },
  { date: "Jun 3", sent: 8, opened: 6 },
  { date: "Jun 4", sent: 10, opened: 7 },
  { date: "Jun 5", sent: 22, opened: 18 },
  { date: "Jun 6", sent: 14, opened: 11 },
  { date: "Jun 7", sent: 9, opened: 7 }
];

const monthlyData = [
  { date: "Jan", sent: 45, opened: 32 },
  { date: "Feb", sent: 58, opened: 45 },
  { date: "Mar", sent: 72, opened: 63 },
  { date: "Apr", sent: 63, opened: 52 },
  { date: "May", sent: 80, opened: 71 },
  { date: "Jun", sent: 90, opened: 77 }
];

export default function NotificationStats() {
  const [timeRange, setTimeRange] = useState("week");

  // Calculate notification stats from mock data
  const notificationCount = mockNotifications.length;
  const unreadCount = mockNotifications.filter((n) => n.status === Status.UNREAD).length;
  const readCount = mockNotifications.filter((n) => n.status === Status.READ).length;
  const archivedCount = mockNotifications.filter((n) => n.status === Status.ARCHIVED).length;

  // Calculate notification types
  const typeStats = Object.values(NotificationType).reduce(
    (acc, type) => {
      acc[type] = mockNotifications.filter((n) => n.type === type).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate priority stats
  const priorityStats = Object.values(Priority).reduce(
    (acc, priority) => {
      acc[priority] = mockNotifications.filter((n) => n.priority === priority).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // Generate random chart data
  const chartData = timeRange === "week" ? weeklyData : monthlyData;

  // Helper to render a stat card
  const StatCard = ({
    title,
    value,
    description,
    icon,
    change = null,
    changeDirection = "up"
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    change?: number | null;
    changeDirection?: "up" | "down";
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-muted-foreground flex items-center text-xs">
          {change !== null && (
            <span
              className={`mr-1 flex items-center ${changeDirection === "up" ? "text-emerald-500" : "text-red-500"}`}>
              {changeDirection === "up" ? "+" : "-"}
              {change}%
              <ArrowUpRight
                className={`ml-0.5 h-3 w-3 ${changeDirection === "down" && "rotate-180"}`}
              />
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  // Render bar chart
  const renderBarChart = () => {
    const maxValue = Math.max(...chartData.map((item) => item.sent));

    return (
      <div className="space-y-2 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Notification Activity</h3>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex h-60 items-end justify-between gap-2">
          {chartData.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-blue-500"
                  style={{ height: `${(day.sent / maxValue) * 180}px` }}
                />
                <div
                  className="w-full rounded-t bg-green-500"
                  style={{ height: `${(day.opened / maxValue) * 180}px` }}
                />
              </div>
              <span className="text-muted-foreground text-xs">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-sm">Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-sm">Opened</span>
          </div>
        </div>
      </div>
    );
  };

  // Render notification type distribution
  const renderTypeDistribution = () => {
    const totalNotifications = Object.values(typeStats).reduce((acc, count) => acc + count, 0);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Type Distribution</h3>

        <div className="space-y-3">
          {Object.entries(typeStats).map(([type, count]) => {
            const percentage =
              totalNotifications > 0 ? Math.round((count / totalNotifications) * 100) : 0;

            return (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type as NotificationType)}
                    <span className="text-sm">
                      {type
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
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

  // Render priority distribution
  const renderPriorityDistribution = () => {
    const totalNotifications = Object.values(priorityStats).reduce((acc, count) => acc + count, 0);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Priority Distribution</h3>

        <div className="space-y-3">
          {Object.entries(priorityStats).map(([priority, count]) => {
            const percentage =
              totalNotifications > 0 ? Math.round((count / totalNotifications) * 100) : 0;
            const barColor = getPriorityColor(priority as Priority);

            return (
              <div key={priority} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
                  </span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full ${barColor} rounded-full`}
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

  // Get icon for notification type
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.CLAIM_UPDATE:
        return <FileText className="h-4 w-4 text-blue-500" />;
      case NotificationType.DOCUMENT:
        return <FileText className="h-4 w-4 text-amber-500" />;
      case NotificationType.APPOINTMENT:
        return <Calendar className="h-4 w-4 text-green-500" />;
      case NotificationType.MESSAGE:
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-4 w-4 text-gray-500" />;
      case NotificationType.DEADLINE:
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Get color for priority bar
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "bg-red-500";
      case Priority.HIGH:
        return "bg-amber-500";
      case Priority.MEDIUM:
        return "bg-blue-500";
      case Priority.LOW:
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Notifications"
          value={notificationCount}
          description="All time"
          icon={<Bell className="text-muted-foreground h-4 w-4" />}
        />
        <StatCard
          title="Active Users"
          value="2,431"
          description="Users with notifications"
          icon={<Users className="text-muted-foreground h-4 w-4" />}
          change={12}
          changeDirection="up"
        />
        <StatCard
          title="Open Rate"
          value={`${Math.round((deliveryStats.opened / deliveryStats.delivered) * 100)}%`}
          description="Last 30 days"
          icon={<CheckCircle className="text-muted-foreground h-4 w-4" />}
          change={5}
          changeDirection="up"
        />
        <StatCard
          title="Click-through Rate"
          value={`${Math.round((deliveryStats.clicked / deliveryStats.opened) * 100)}%`}
          description="Last 30 days"
          icon={<BarChart3 className="text-muted-foreground h-4 w-4" />}
          change={2}
          changeDirection="down"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Notification activity{" "}
              {timeRange === "week" ? "in the last 7 days" : "over the last 6 months"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderBarChart()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Rate</span>
                  <span className="text-sm font-medium text-green-500">
                    {Math.round((deliveryStats.delivered / deliveryStats.total) * 100)}%
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${Math.round((deliveryStats.delivered / deliveryStats.total) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Rate</span>
                  <span className="text-sm font-medium text-blue-500">
                    {Math.round((deliveryStats.opened / deliveryStats.delivered) * 100)}%
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.round((deliveryStats.opened / deliveryStats.delivered) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Click Rate</span>
                  <span className="text-sm font-medium text-purple-500">
                    {Math.round((deliveryStats.clicked / deliveryStats.opened) * 100)}%
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${Math.round((deliveryStats.clicked / deliveryStats.opened) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Failure Rate</span>
                  <span className="text-sm font-medium text-red-500">
                    {Math.round((deliveryStats.failed / deliveryStats.total) * 100)}%
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${Math.round((deliveryStats.failed / deliveryStats.total) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Types</CardTitle>
            <CardDescription>Distribution by notification type</CardDescription>
          </CardHeader>
          <CardContent>{renderTypeDistribution()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priorities</CardTitle>
            <CardDescription>Distribution by priority level</CardDescription>
          </CardHeader>
          <CardContent>{renderPriorityDistribution()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
