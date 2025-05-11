"use client";

import { useState } from "react";
import { BellIcon, CheckIcon, ClockIcon, FilterIcon } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { mockNotifications, getUnreadCount, markAsRead } from "@/lib/mock/notifications";
import { NotificationType, Priority, Status } from "@/types/notifications";

const Notifications = () => {
  const isMobile = useIsMobile();
  const [unreadCount, setUnreadCount] = useState<number>(getUnreadCount());
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return notification.status !== Status.ARCHIVED;
    if (activeTab === "unread") return notification.status === Status.UNREAD;
    return notification.type.toString() === activeTab && notification.status !== Status.ARCHIVED;
  });

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setUnreadCount(getUnreadCount());
    setNotifications([...notifications]); // Force re-render
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (notification.status === Status.UNREAD) {
        notification.status = Status.READ;
      }
    });
    setUnreadCount(0);
    setNotifications([...notifications]); // Force re-render
  };

  // Get priority badge color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "bg-destructive text-destructive-foreground";
      case Priority.HIGH:
        return "bg-amber-500 text-white";
      case Priority.MEDIUM:
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <>
            <BellIcon className={unreadCount > 0 ? "animate-tada" : ""} />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"} className="z-10 ms-4 me-4 w-80 p-0">
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex justify-between border-b px-6 py-4">
            <div className="font-medium">Notifications</div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}>
                <CheckIcon className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs" size="sm" asChild>
                <Link href="/dashboard/notifications">View all</Link>
              </Button>
            </div>
          </div>
          <div className="border-b px-4 py-2">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="claim_update">Claims</TabsTrigger>
                <TabsTrigger value="document">Docs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DropdownMenuLabel>
        <ScrollArea className="max-h-[300px] xl:max-h-[350px]">
          {filteredNotifications.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
              <p>No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="group hover:bg-muted flex cursor-pointer items-start gap-3 px-4 py-3"
                onClick={() => handleMarkAsRead(item.id)}>
                <div className="flex-none">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={`${process.env.ASSETS_URL}/avatars/${item.sender?.avatar}`}
                      alt={item.sender?.name || ""}
                    />
                    <AvatarFallback>
                      {item.sender?.name.charAt(0) || item.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="dark:group-hover:text-default-800 truncate text-sm font-medium">
                      {item.title}
                    </div>
                    {item.priority !== Priority.LOW && (
                      <Badge className={`${getPriorityColor(item.priority)} ml-2 text-[10px]`}>
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                  <div className="dark:group-hover:text-default-700 text-muted-foreground line-clamp-2 text-xs">
                    {item.message}
                  </div>
                  {item.actions && item.actions.length > 0 && (
                    <div className="mt-1 flex items-center gap-2">
                      {item.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.type === "decline" ? "destructive" : "outline"}>
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="dark:group-hover:text-default-500 text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                    <ClockIcon className="size-3" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    {item.sender?.role && <span className="ml-1">• {item.sender.role}</span>}
                  </div>
                </div>
                {item.status === Status.UNREAD && (
                  <div className="flex-0">
                    <span className="bg-destructive block size-2 rounded-full border" />
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
