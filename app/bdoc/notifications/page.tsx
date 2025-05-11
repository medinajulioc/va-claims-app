"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { generateMeta } from "@/lib/utils";

import NotificationList from "./components/notification-list";
import NotificationForm from "./components/notification-form";
import NotificationTemplates from "./components/notification-templates";
import NotificationStats from "./components/notification-stats";

export async function generateMetadata() {
  return generateMeta({
    title: "Notification Management",
    description: "Manage and send notifications to users.",
    canonical: "/bdoc/notifications"
  });
}

export default function NotificationsAdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Notification Management</h1>
          <p className="text-muted-foreground">Create, send, and manage notifications for users.</p>
        </div>
      </div>

      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create">Create Notification</TabsTrigger>
          <TabsTrigger value="list">All Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <NotificationStats />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <NotificationForm />
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <NotificationList />
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <NotificationTemplates />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
