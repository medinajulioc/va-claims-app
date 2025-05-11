"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  AlertTriangle
} from "lucide-react";
import { generateMeta } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { mockNotifications, markAsRead, archiveNotification } from "@/lib/mock/notifications";
import { Notification, NotificationType, Priority, Status } from "@/types/notifications";

export async function generateMetadata() {
  return generateMeta({
    title: "Notifications",
    description: "View and manage your notifications.",
    canonical: "/dashboard/notifications"
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Filter notifications based on tab and search query
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (selectedTab !== "all" && selectedTab !== "archived") {
      if (selectedTab === "unread") {
        if (notification.status !== Status.UNREAD) return false;
      } else if (notification.type.toString() !== selectedTab) {
        return false;
      }
    }

    // Filter archived notifications
    if (selectedTab === "archived") {
      if (notification.status !== Status.ARCHIVED) return false;
    } else {
      if (notification.status === Status.ARCHIVED) return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.sender?.name.toLowerCase().includes(query) ||
        notification.sender?.role?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "priority-desc":
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      case "priority-asc":
        return getPriorityValue(a.priority) - getPriorityValue(b.priority);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Helper function to get priority value for sorting
  function getPriorityValue(priority: Priority): number {
    switch (priority) {
      case Priority.URGENT:
        return 4;
      case Priority.HIGH:
        return 3;
      case Priority.MEDIUM:
        return 2;
      case Priority.LOW:
        return 1;
      default:
        return 0;
    }
  }

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setNotifications([...notifications]); // Force re-render
  };

  // Handle archiving a notification
  const handleArchive = (id: string) => {
    archiveNotification(id);
    setNotifications([...notifications]); // Force re-render
  };

  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (notification.status === Status.UNREAD) {
        notification.status = Status.READ;
      }
    });
    setNotifications([...notifications]); // Force re-render
  };

  // Handle checkbox selection
  const handleCheckboxChange = (id: string) => {
    setSelectedNotifications((prev) => {
      if (prev.includes(id)) {
        return prev.filter((notificationId) => notificationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(sortedNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  // Handle batch actions
  const handleBatchAction = (action: "read" | "archive") => {
    if (selectedNotifications.length === 0) return;

    const updatedNotifications = [...notifications];
    selectedNotifications.forEach((id) => {
      const notification = updatedNotifications.find((n) => n.id === id);
      if (notification) {
        if (action === "read") {
          notification.status = Status.READ;
        } else if (action === "archive") {
          notification.status = Status.ARCHIVED;
        }
      }
    });

    setNotifications(updatedNotifications);
    setSelectedNotifications([]);
  };

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.CLAIM_UPDATE:
        return <FileText className="h-4 w-4" />;
      case NotificationType.DOCUMENT:
        return <FileText className="h-4 w-4" />;
      case NotificationType.APPOINTMENT:
        return <Calendar className="h-4 w-4" />;
      case NotificationType.MESSAGE:
        return <MessageSquare className="h-4 w-4" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-4 w-4" />;
      case NotificationType.DEADLINE:
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return <Badge variant="destructive">Urgent</Badge>;
      case Priority.HIGH:
        return <Badge className="bg-amber-500">High</Badge>;
      case Priority.MEDIUM:
        return <Badge className="bg-blue-500">Medium</Badge>;
      case Priority.LOW:
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Notifications</h1>
        <div className="flex flex-wrap items-center gap-2">
          {selectedNotifications.length > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction("read")}
                disabled={selectedNotifications.length === 0}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction("archive")}
                disabled={selectedNotifications.length === 0}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNotifications([])}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="priority-desc">Highest Priority</SelectItem>
              <SelectItem value="priority-asc">Lowest Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b p-4">
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="claim_update">Claims</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
              <TabsTrigger value="appointment">Appointments</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="deadline">Deadlines</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {sortedNotifications.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="text-muted-foreground/50 mb-2 h-12 w-12" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-sm">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "You don't have any notifications in this category"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              <div className="bg-muted/50 flex items-center p-4">
                <div className="flex w-full items-center">
                  <Checkbox
                    id="select-all"
                    className="mr-4"
                    checked={
                      selectedNotifications.length === sortedNotifications.length &&
                      sortedNotifications.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <div className="grid w-full grid-cols-12 gap-4">
                    <div className="col-span-7 font-medium">Details</div>
                    <div className="col-span-2 hidden font-medium md:block">Type</div>
                    <div className="col-span-2 hidden font-medium md:block">Date</div>
                    <div className="col-span-1 text-right font-medium">Actions</div>
                  </div>
                </div>
              </div>
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`hover:bg-muted/50 flex items-start p-4 ${
                    notification.status === Status.UNREAD ? "bg-muted/20" : ""
                  }`}>
                  <Checkbox
                    id={`select-${notification.id}`}
                    className="mt-1 mr-4"
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={() => handleCheckboxChange(notification.id)}
                  />
                  <div className="grid w-full grid-cols-12 gap-4">
                    <div className="col-span-7">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-10 flex-shrink-0">
                          <AvatarImage
                            src={`${process.env.ASSETS_URL}/avatars/${notification.sender?.avatar}`}
                            alt={notification.sender?.name || ""}
                          />
                          <AvatarFallback>
                            {notification.sender?.name?.charAt(0) || notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            {notification.status === Status.UNREAD && (
                              <span className="block size-2 rounded-full bg-blue-500" />
                            )}
                            {getPriorityBadge(notification.priority)}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {notification.message}
                          </p>
                          {notification.sender && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              From: {notification.sender.name}
                              {notification.sender.role && ` • ${notification.sender.role}`}
                            </p>
                          )}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {notification.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  variant={action.type === "decline" ? "destructive" : "outline"}>
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 hidden items-center md:flex">
                      <div className="flex items-center gap-1">
                        {getNotificationIcon(notification.type)}
                        <span className="text-sm">
                          {NotificationType[notification.type]
                            .split("_")
                            .map(
                              (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 hidden items-center md:flex">
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {notification.status === Status.UNREAD && (
                            <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          {notification.status !== Status.ARCHIVED && (
                            <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          {notification.relatedEntityId && (
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
