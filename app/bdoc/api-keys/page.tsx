"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Plus, RefreshCw } from "lucide-react";
import { apiUsageService, ApiKey } from "@/lib/services/api-usage";

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchApiKeys() {
      try {
        const keys = await apiUsageService.getApiKeys();
        setApiKeys(keys);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApiKeys();
  }, []);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const updatedKey = await apiUsageService.updateApiKey(id, { isActive });
      if (updatedKey) {
        setApiKeys((keys) => keys.map((key) => (key.id === id ? updatedKey : key)));
      }
    } catch (error) {
      console.error("Error updating API key:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const maskApiKey = (key: string, show: boolean) => {
    if (show) return key;
    return key.substring(0, 8) + "••••••••••••••••";
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">API Keys Management</h1>

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Keys</TabsTrigger>
            <TabsTrigger value="all">All Keys</TabsTrigger>
          </TabsList>

          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New Key
          </Button>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>API keys currently in use for external services</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading API keys...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys
                      .filter((key) => key.isActive)
                      .map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.service}</TableCell>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center space-x-2">
                              <span>{maskApiKey(key.key, !!showKeys[key.id])}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleKeyVisibility(key.id)}>
                                {showKeys[key.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                key.environment === "production" ? "destructive" : "outline"
                              }>
                              {key.environment}
                            </Badge>
                          </TableCell>
                          <TableCell>{key.usageCount.toLocaleString()}</TableCell>
                          <TableCell>{key.lastUsed ? formatDate(key.lastUsed) : "Never"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={key.isActive}
                                onCheckedChange={(checked) => toggleKeyStatus(key.id, checked)}
                              />
                              <span>{key.isActive ? "Active" : "Inactive"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All API Keys</CardTitle>
              <CardDescription>
                Complete list of all API keys, including inactive ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading API keys...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id} className={!key.isActive ? "opacity-60" : undefined}>
                        <TableCell className="font-medium">{key.service}</TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span>{maskApiKey(key.key, !!showKeys[key.id])}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleKeyVisibility(key.id)}>
                              {showKeys[key.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={key.environment === "production" ? "destructive" : "outline"}>
                            {key.environment}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(key.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={key.isActive}
                              onCheckedChange={(checked) => toggleKeyStatus(key.id, checked)}
                            />
                            <span>{key.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
