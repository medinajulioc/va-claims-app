"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock notification type
interface Notification {
  id: string;
  type: "mention" | "reply" | "like" | "community" | "system";
  content: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export function NotificationIndicator() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load mock notifications
  useEffect(() => {
    // In a real app, this would be an API call
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "reply",
        content: "Someone replied to your post about VA disability claims",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: false,
        link: "/community/1/posts/1"
      },
      {
        id: "2",
        type: "like",
        content: "Your post received 5 new likes",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        link: "/community/2/posts/3"
      },
      {
        id: "3",
        type: "community",
        content: "New post in PTSD Support community",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        link: "/community/3"
      },
      {
        id: "4",
        type: "mention",
        content: "You were mentioned in a discussion about VA benefits",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        link: "/community/2/posts/5"
      },
      {
        id: "5",
        type: "system",
        content: "Welcome to the VA Claims community!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: true
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] leading-none font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "hover:bg-muted/50 flex cursor-pointer gap-3 px-4 py-3",
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => {
                    // Mark as read
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
                    );
                    // Close popover
                    setIsOpen(false);

                    // In a real app, this would navigate to the link
                    if (notification.link) {
                      console.log(`Navigate to: ${notification.link}`);
                    }
                  }}>
                  <div
                    className={cn(
                      "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                      !notification.read ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <p className="text-muted-foreground text-center text-sm">No notifications yet</p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2 text-center">
          <Button variant="ghost" size="sm" className="h-auto w-full text-xs">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationIndicator;
