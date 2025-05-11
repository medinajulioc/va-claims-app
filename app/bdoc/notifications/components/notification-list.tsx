"use client";

import { useState } from "react";
import {
  Archive,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { mockNotifications } from "@/lib/mock/notifications";
import { Notification, NotificationType, Priority, Status } from "@/types/notifications";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    if (selectedType !== "all" && notification.type.toString() !== selectedType) {
      return false;
    }

    // Filter by priority
    if (selectedPriority !== "all" && notification.priority.toString() !== selectedPriority) {
      return false;
    }

    // Filter by status
    if (selectedStatus !== "all" && notification.status.toString() !== selectedStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.sender?.name.toLowerCase().includes(query) ||
        notification.sender?.role?.toLowerCase().includes(query) ||
        notification.recipientId.toLowerCase().includes(query)
      );
    }

    return true;
  });

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
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
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

  // Get status badge
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.UNREAD:
        return (
          <Badge variant="outline" className="bg-blue-500 text-white">
            Unread
          </Badge>
        );
      case Status.READ:
        return <Badge variant="outline">Read</Badge>;
      case Status.ARCHIVED:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Archived
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle batch delete
  const handleBatchDelete = () => {
    if (selectedNotifications.length === 0) return;

    setNotifications((prev) =>
      prev.filter((notification) => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
  };

  // Handle single delete
  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Export notifications as CSV
  const handleExport = () => {
    const notificationsToExport =
      selectedNotifications.length > 0
        ? notifications.filter((n) => selectedNotifications.includes(n.id))
        : filteredNotifications;

    // Create CSV content
    const headers = [
      "ID",
      "Recipient",
      "Title",
      "Message",
      "Type",
      "Priority",
      "Status",
      "Created At"
    ];
    const csvContent = [
      headers.join(","),
      ...notificationsToExport.map((n) =>
        [
          n.id,
          n.recipientId,
          `"${n.title.replace(/"/g, '""')}"`,
          `"${n.message.replace(/"/g, '""')}"`,
          n.type,
          n.priority,
          n.status,
          new Date(n.createdAt).toISOString()
        ].join(",")
      )
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `notifications_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>All Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedNotifications.length > 0 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchDelete}
                    className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedNotifications([])}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="claim_update">Claim Updates</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedNotifications.length === filteredNotifications.length &&
                        filteredNotifications.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground py-8 text-center">
                      No notifications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <Checkbox
                          id={`select-${notification.id}`}
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={() => handleCheckboxChange(notification.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-muted-foreground line-clamp-1 text-sm">
                          {notification.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">{notification.recipientId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {NotificationType[notification.type]
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(" ")}
                      </TableCell>
                      <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                      <TableCell>{getStatusBadge(notification.status)}</TableCell>
                      <TableCell>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(notification.id)}
                              className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </>
  );
}
